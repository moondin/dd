# FULLSTACK WEBSITE TYPES - PART 10: IOT, TRANSPORTATION & SMART HOME

**Category:** IoT, Transportation & Smart Systems  
**Total Types:** 15  
**Complexity:** High to Very High  
**Database References:** PART1-2, MQTT patterns, Real-time data processing

---

## 📋 WEBSITE TYPES - IOT & SMART HOME (5 types)

1. **IoT Device Management Platform**
2. **Smart Home Automation Hub**
3. **IoT Dashboard & Analytics**
4. **Device Marketplace**
5. **IoT Integration Platform**

## 📋 TRANSPORTATION & LOGISTICS (5 types)

6. **Fleet Management System**
7. **Route Optimization Platform**
8. **Delivery Tracking System**
9. **Vehicle Marketplace**
10. **Driver Management App**

## 📋 HOSPITALITY (5 types)

11. **Hotel Booking Platform**
12. **Restaurant Reservation System**
13. **POS System**
14. **Review/Rating Platform**
15. **Staff Scheduling System**

---

## 1. IOT DEVICE MANAGEMENT PLATFORM

### Tech Stack
- **Backend:** Node.js or Python + FastAPI
- **Database:** PostgreSQL + TimescaleDB (time-series)
- **MQTT Broker:** Mosquitto or EMQX
- **Frontend:** Next.js + TypeScript
- **Real-time:** WebSockets + MQTT
- **Build Time:** 16-24 weeks

### Schema
```typescript
export const devices = pgTable("devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: text("device_id").notNull().unique(), // Hardware ID
  name: text("name").notNull(),
  type: text("type").notNull(), // sensor, actuator, gateway, camera
  model: text("model"),
  manufacturer: text("manufacturer"),
  
  // Ownership
  userId: uuid("user_id").references(() => users.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id),
  
  // Status
  status: text("status").default("offline"), // online, offline, error
  lastSeen: timestamp("last_seen"),
  firmwareVersion: text("firmware_version"),
  
  // Configuration
  config: json("config").$type<DeviceConfig>(),
  metadata: json("metadata"),
  
  // Security
  authToken: text("auth_token").notNull(), // For device authentication
  publicKey: text("public_key"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  @@index([userId])
  @@index([status])
})

export const deviceData = pgTable("device_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").references(() => devices.id).notNull(),
  
  // Telemetry
  dataType: text("data_type").notNull(), // temperature, humidity, motion, etc.
  value: text("value").notNull(),
  unit: text("unit"),
  
  timestamp: timestamp("timestamp").notNull(),
  
  @@index([deviceId, timestamp])
  @@index([timestamp])
})

export const deviceCommands = pgTable("device_commands", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").references(() => devices.id).notNull(),
  
  command: text("command").notNull(), // turn_on, turn_off, set_temperature
  parameters: json("parameters"),
  
  status: text("status").default("pending"), // pending, sent, acknowledged, failed
  
  sentAt: timestamp("sent_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([deviceId, status])
})

export const deviceAlerts = pgTable("device_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").references(() => devices.id).notNull(),
  
  alertType: text("alert_type").notNull(), // threshold, offline, error
  severity: text("severity").notNull(), // info, warning, critical
  message: text("message").notNull(),
  
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([deviceId, resolved])
})

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  name: text("name").notNull(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  timezone: text("timezone"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

### MQTT Integration
```typescript
// lib/mqtt-client.ts
import mqtt from 'mqtt'

export class IoTMQTTClient {
  private client: mqtt.MqttClient
  
  constructor() {
    this.client = mqtt.connect(process.env.MQTT_BROKER_URL!, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    })
    
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker')
      this.subscribeToDeviceTopics()
    })
    
    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message)
    })
  }
  
  subscribeToDeviceTopics() {
    // Subscribe to all device telemetry
    this.client.subscribe('devices/+/telemetry')
    this.client.subscribe('devices/+/status')
  }
  
  async handleMessage(topic: string, message: Buffer) {
    const parts = topic.split('/')
    const deviceId = parts[1]
    const messageType = parts[2]
    
    const data = JSON.parse(message.toString())
    
    if (messageType === 'telemetry') {
      await this.storeTelemetry(deviceId, data)
    } else if (messageType === 'status') {
      await this.updateDeviceStatus(deviceId, data)
    }
  }
  
  async storeTelemetry(deviceId: string, data: any) {
    await db.insert(deviceData).values({
      deviceId,
      dataType: data.type,
      value: data.value.toString(),
      unit: data.unit,
      timestamp: new Date(data.timestamp),
    })
  }
  
  sendCommand(deviceId: string, command: string, parameters: any) {
    const topic = `devices/${deviceId}/commands`
    this.client.publish(topic, JSON.stringify({
      command,
      parameters,
      timestamp: Date.now(),
    }))
  }
}
```

**DB Parts:** PART1, PART2 (Real-time), TimescaleDB patterns

---

## 2. SMART HOME AUTOMATION HUB

### Schema (extends IoT platform)
```typescript
export const automationRules = pgTable("automation_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Trigger
  trigger: json("trigger").$type<AutomationTrigger>(),
  // {type: "device_state", deviceId: "xyz", condition: "temperature > 25"}
  // {type: "schedule", cron: "0 7 * * *"}
  // {type: "location", event: "user_arrives"}
  
  // Actions
  actions: json("actions").$type<AutomationAction[]>(),
  // [{type: "device_command", deviceId: "abc", command: "turn_on"}]
  
  enabled: boolean("enabled").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastTriggeredAt: timestamp("last_triggered_at"),
  
  @@index([userId, enabled])
})

export const scenes = pgTable("scenes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id),
  
  name: text("name").notNull(),
  icon: text("icon"),
  
  // Device states to apply
  deviceStates: json("device_states").$type<{deviceId: string, state: any}[]>(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  
  name: text("name").notNull(),
  type: text("type"), // bedroom, living_room, kitchen, etc.
  floor: integer("floor"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const roomDevices = pgTable("room_devices", {
  roomId: uuid("room_id").references(() => rooms.id).notNull(),
  deviceId: uuid("device_id").references(() => devices.id).notNull(),
  
  @@unique([roomId, deviceId])
})
```

**DB Parts:** PART1, PART2, Automation engine patterns

---

## 6. FLEET MANAGEMENT SYSTEM

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + PostGIS
- **Maps:** Google Maps or Mapbox
- **GPS Tracking:** Real-time WebSockets
- **Build Time:** 12-18 weeks

### Schema
```typescript
export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Vehicle details
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vin: text("vin").unique(),
  licensePlate: text("license_plate").notNull().unique(),
  
  // Type
  type: text("type").notNull(), // truck, van, car, motorcycle
  
  // Status
  status: text("status").default("available"), // available, in_use, maintenance, retired
  
  // Mileage
  currentMileage: integer("current_mileage").default(0),
  lastMaintenanceMileage: integer("last_maintenance_mileage"),
  
  // GPS Device
  gpsDeviceId: text("gps_device_id"),
  
  // Ownership
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([organizationId, status])
})

export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  licenseNumber: text("license_number").notNull().unique(),
  licenseExpiry: timestamp("license_expiry").notNull(),
  licenseClass: text("license_class"),
  
  status: text("status").default("active"), // active, suspended, inactive
  
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: uuid("driver_id").references(() => drivers.id).notNull(),
  
  // Route
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  startLatitude: real("start_latitude"),
  startLongitude: real("start_longitude"),
  endLatitude: real("end_latitude"),
  endLongitude: real("end_longitude"),
  
  // Time
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  
  // Metrics
  distance: real("distance"), // kilometers
  duration: integer("duration"), // minutes
  fuelUsed: real("fuel_used"), // liters
  
  // Costs
  fuelCost: integer("fuel_cost"), // in cents
  tollCost: integer("toll_cost"),
  
  status: text("status").default("planned"), // planned, in_progress, completed, cancelled
  
  @@index([vehicleId])
  @@index([driverId])
  @@index([startTime])
})

export const vehicleLocations = pgTable("vehicle_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  speed: real("speed"), // km/h
  heading: integer("heading"), // degrees
  
  timestamp: timestamp("timestamp").notNull(),
  
  @@index([vehicleId, timestamp])
})

export const maintenanceRecords = pgTable("maintenance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
  
  type: text("type").notNull(), // oil_change, tire_rotation, inspection, repair
  description: text("description").notNull(),
  
  cost: integer("cost"), // in cents
  mileage: integer("mileage"),
  
  performedBy: text("performed_by"),
  performedAt: timestamp("performed_at").notNull(),
  
  nextDueAt: timestamp("next_due_at"),
  nextDueMileage: integer("next_due_mileage"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([vehicleId])
})
```

**DB Parts:** PART1, PART2 (Real-time tracking), PostGIS

---

## 7. ROUTE OPTIMIZATION PLATFORM

### Schema
```typescript
export const deliveryRoutes = pgTable("delivery_routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  driverId: uuid("driver_id").references(() => drivers.id),
  
  // Optimization
  optimized: boolean("optimized").default(false),
  totalDistance: real("total_distance"),
  estimatedDuration: integer("estimated_duration"), // minutes
  
  status: text("status").default("planned"), // planned, in_progress, completed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const stops = pgTable("stops", {
  id: uuid("id").defaultRandom().primaryKey(),
  routeId: uuid("route_id").references(() => deliveryRoutes.id).notNull(),
  
  // Location
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  
  // Order
  sequence: integer("sequence").notNull(),
  
  // Details
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  
  // Time windows
  earliestTime: timestamp("earliest_time"),
  latestTime: timestamp("latest_time"),
  serviceTime: integer("service_time").default(10), // minutes
  
  // Status
  status: text("status").default("pending"), // pending, in_transit, delivered, failed
  arrivedAt: timestamp("arrived_at"),
  completedAt: timestamp("completed_at"),
  
  // Proof of delivery
  signatureUrl: text("signature_url"),
  photoUrl: text("photo_url"),
  
  @@index([routeId, sequence])
})
```

### Route Optimization Algorithm
```typescript
// lib/route-optimizer.ts
export async function optimizeRoute(routeId: string) {
  const stops = await db
    .select()
    .from(stops)
    .where(eq(stops.routeId, routeId))
    .orderBy(stops.sequence)
  
  // Use Google Maps Distance Matrix API or custom algorithm
  // Traveling Salesman Problem (TSP) solution
  
  const optimizedSequence = await solveTSP(stops)
  
  // Update stop sequences
  for (let i = 0; i < optimizedSequence.length; i++) {
    await db
      .update(stops)
      .set({ sequence: i + 1 })
      .where(eq(stops.id, optimizedSequence[i].id))
  }
  
  // Calculate total distance and duration
  const { totalDistance, totalDuration } = await calculateRouteMetrics(optimizedSequence)
  
  await db
    .update(deliveryRoutes)
    .set({
      optimized: true,
      totalDistance,
      estimatedDuration: totalDuration,
    })
    .where(eq(deliveryRoutes.id, routeId))
}
```

**DB Parts:** PART1, PART2, Optimization algorithms

---

## 11. HOTEL BOOKING PLATFORM

### Schema
```typescript
export const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Location
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Details
  starRating: integer("star_rating"),
  amenities: text("amenities").array(), // wifi, pool, gym, parking
  
  // Images
  images: text("images").array(),
  
  // Contact
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  
  // Management
  ownerId: uuid("owner_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const rooms = pgTable("hotel_rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
  
  roomType: text("room_type").notNull(), // single, double, suite
  name: text("name").notNull(),
  description: text("description"),
  
  // Capacity
  maxOccupancy: integer("max_occupancy").notNull(),
  bedType: text("bed_type"), // king, queen, twin
  numBeds: integer("num_beds").default(1),
  
  // Pricing
  basePrice: integer("base_price").notNull(), // per night in cents
  
  // Amenities
  amenities: text("amenities").array(),
  
  // Availability
  totalRooms: integer("total_rooms").notNull(),
  
  images: text("images").array(),
  
  @@index([hotelId])
})

export const bookings = pgTable("hotel_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
  roomId: uuid("room_id").references(() => rooms.id).notNull(),
  
  // Guest
  guestId: uuid("guest_id").references(() => users.id).notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  
  // Dates
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  numNights: integer("num_nights").notNull(),
  
  // Guests
  numAdults: integer("num_adults").notNull(),
  numChildren: integer("num_children").default(0),
  
  // Pricing
  pricePerNight: integer("price_per_night").notNull(),
  totalPrice: integer("total_price").notNull(),
  
  // Status
  status: text("status").default("pending"), // pending, confirmed, checked_in, checked_out, cancelled
  
  // Payment
  paymentStatus: text("payment_status").default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  specialRequests: text("special_requests"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([hotelId])
  @@index([guestId])
  @@index([checkInDate, checkOutDate])
})

export const roomAvailability = pgTable("room_availability", {
  roomId: uuid("room_id").references(() => rooms.id).notNull(),
  date: timestamp("date").notNull(),
  availableRooms: integer("available_rooms").notNull(),
  price: integer("price").notNull(), // Dynamic pricing
  
  @@unique([roomId, date])
})
```

**DB Parts:** PART1, PART3 (payments), PART2

---

## 12-15. ADDITIONAL TYPES (Quick Reference)

### 12. Restaurant Reservation System
- **Stack:** Next.js + PostgreSQL + Twilio (SMS)
- **Build Time:** 6-8 weeks
- **Key:** Table management, waitlist, floor plan
- **DB Parts:** PART1, PART2

### 13. POS System
- **Stack:** Next.js/Electron + PostgreSQL + Stripe Terminal
- **Build Time:** 10-14 weeks
- **Key:** Orders, inventory, payments, receipts
- **DB Parts:** PART1, PART3, Inventory

### 14. Review/Rating Platform (Yelp-like)
- **Stack:** Next.js + PostgreSQL + Elasticsearch
- **Build Time:** 8-10 weeks
- **Key:** Reviews, ratings, photos, search
- **DB Parts:** PART1, PART4, Search

### 15. Staff Scheduling System
- **Stack:** Next.js + PostgreSQL
- **Build Time:** 6-8 weeks
- **Key:** Shift management, availability, time-off
- **DB Parts:** PART1, PART2, Calendar

---

**Next:** [PART 11 - Legal, Agriculture & Manufacturing →](FULLSTACK_WEBSITE_TYPES_PART11_PROFESSIONAL.md)
