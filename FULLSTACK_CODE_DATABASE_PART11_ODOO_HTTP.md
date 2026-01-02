---
source_txt: FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART11 ODOO HTTP

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 11: ODOO HTTP ROUTING & CONTROLLERS
================================================================================
Source: Odoo 19.0 - HTTP Layer & Web Controllers
Tech Stack: Python Werkzeug, WSGI, JSON-RPC
Generated: December 17, 2025
================================================================================

TABLE OF CONTENTS:
1. HTTP ROUTING ARCHITECTURE
   - @http.route Decorator
   - Controller Classes
   - Request/Response Objects
   - Authentication Types

2. REST API ENDPOINTS
   - HTTP Routes (GET, POST, etc.)
   - JSON-RPC Endpoints
   - File Upload/Download
   - CORS Configuration

3. AUTHENTICATION & SESSION
   - Session Management
   - CSRF Protection
   - Multi-database Support
   - User Context

4. RESPONSE TYPES
   - HTML Rendering (QWeb Templates)
   - JSON Responses
   - File Downloads
   - Redirects

================================================================================
1. HTTP ROUTING ARCHITECTURE
================================================================================

---[FILE: Basic Controller - controllers/main.py]---
Location: addons/my_module/controllers/main.py
Purpose: Define HTTP endpoints and web controllers

```python
from odoo import http
from odoo.http import request
from odoo.exceptions import AccessError, UserError

class MyController(http.Controller):
    """
    Controller class for handling HTTP requests
    All methods decorated with @http.route become web endpoints
    """
    
    # ==================== BASIC HTTP ROUTE ====================
    
    @http.route('/my_module/hello', type='http', auth='public', website=True)
    def hello_world(self, **kw):
        """
        Basic HTTP endpoint
        
        Parameters:
        - type='http': Returns HTML (can also be 'json' for JSON-RPC)
        - auth='public': Anyone can access (also: 'user', 'none')
        - website=True: Enable website context and multi-website support
        
        URL Parameters automatically passed as **kw
        """
        return request.render('my_module.hello_template', {
            'title': 'Hello World',
            'content': 'Welcome to Odoo'
        })
    
    # ==================== JSON-RPC ENDPOINT ====================
    
    @http.route('/my_module/api/get_products', type='json', auth='user', methods=['POST'])
    def get_products(self, **kw):
        """
        JSON-RPC endpoint
        
        Features:
        - type='json': Expects JSON payload, returns JSON
        - auth='user': Requires logged-in user
        - methods=['POST']: Only POST requests allowed
        
        Called via JSON-RPC:
        POST /my_module/api/get_products
        {"jsonrpc": "2.0", "method": "call", "params": {...}}
        """
        # Access query parameters from kw
        limit = kw.get('limit', 10)
        category_id = kw.get('category_id')
        
        # Access Odoo models via request.env
        domain = [('active', '=', True)]
        if category_id:
            domain.append(('category_id', '=', category_id))
        
        products = request.env['product.product'].search(domain, limit=limit)
        
        # Return Python dict (automatically converted to JSON)
        return {
            'products': [{
                'id': p.id,
                'name': p.name,
                'price': p.list_price,
                'image_url': f'/web/image/product.product/{p.id}/image_128'
            } for p in products],
            'total': len(products)
        }
    
    # ==================== MULTIPLE ROUTES (SAME HANDLER) ====================
    
    @http.route([
        '/shop',
        '/shop/page/<int:page>',
        '/shop/category/<model("product.category"):category>',
        '/shop/category/<model("product.category"):category>/page/<int:page>'
    ], type='http', auth='public', website=True, sitemap=True)
    def shop(self, page=1, category=None, search='', **kw):
        """
        Advanced routing with multiple URL patterns
        
        Features:
        - Multiple URL patterns for same handler
        - <int:page>: Integer URL parameter
        - <model("product.category"):category>: Model converter (fetches record)
        - sitemap=True: Include in sitemap.xml
        
        Model converter automatically queries database and passes record
        """
        # Pagination
        page_size = 20
        offset = (page - 1) * page_size
        
        # Build domain
        domain = [('sale_ok', '=', True)]
        if category:
            domain.append(('categ_id', 'child_of', category.id))
        if search:
            domain.append(('name', 'ilike', search))
        
        # Query products
        Product = request.env['product.template']
        products = Product.search(domain, limit=page_size, offset=offset)
        total = Product.search_count(domain)
        
        # Calculate pagination
        pager = request.website.pager(
            url='/shop',
            total=total,
            page=page,
            step=page_size,
            url_args={'search': search}
        )
        
        return request.render('my_module.shop_template', {
            'products': products,
            'category': category,
            'search': search,
            'pager': pager
        })
    
    # ==================== FILE UPLOAD ====================
    
    @http.route('/my_module/upload', type='http', auth='user', methods=['POST'], csrf=True)
    def upload_file(self, file=None, **kw):
        """
        Handle file upload
        
        Parameters:
        - csrf=True: Requires CSRF token (default for POST/PUT/DELETE)
        
        File automatically accessible in **kw or as parameter
        """
        if not file:
            return request.redirect('/my_module/upload_form?error=no_file')
        
        # Read file content
        file_content = file.read()
        file_name = file.filename
        
        # Save to ir.attachment
        attachment = request.env['ir.attachment'].create({
            'name': file_name,
            'datas': base64.b64encode(file_content),
            'type': 'binary',
            'res_model': 'my.model',
            'res_id': kw.get('record_id'),
        })
        
        return request.redirect(f'/my_module/upload_success/{attachment.id}')
    
    # ==================== FILE DOWNLOAD ====================
    
    @http.route('/my_module/download/<int:attachment_id>', type='http', auth='user')
    def download_file(self, attachment_id, **kw):
        """
        Download file by attachment ID
        """
        attachment = request.env['ir.attachment'].browse(attachment_id)
        
        # Check access rights
        if not attachment.exists():
            raise werkzeug.exceptions.NotFound()
        
        # Return file download response
        return request.make_response(
            base64.b64decode(attachment.datas),
            headers=[
                ('Content-Type', attachment.mimetype),
                ('Content-Disposition', f'attachment; filename="{attachment.name}"')
            ]
        )
    
    # ==================== AJAX ENDPOINT ====================
    
    @http.route('/my_module/ajax/search', type='json', auth='public', methods=['POST'])
    def ajax_search(self, query='', limit=10, **kw):
        """
        AJAX search endpoint for autocomplete
        
        Called from JavaScript:
        ```javascript
        await jsonrpc('/my_module/ajax/search', {query: 'laptop', limit: 5})
        ```
        """
        if not query or len(query) < 2:
            return {'results': []}
        
        products = request.env['product.product'].search([
            ('name', 'ilike', query)
        ], limit=limit)
        
        return {
            'results': [{
                'id': p.id,
                'name': p.name,
                'price': p.list_price
            } for p in products]
        }
    
    # ==================== AUTHENTICATION LEVELS ====================
    
    @http.route('/public_endpoint', type='http', auth='public')
    def public_endpoint(self):
        """
        auth='public': Accessible to everyone (logged in or not)
        - request.env.user might be public user
        - Use for public website pages
        """
        return "Anyone can see this"
    
    @http.route('/user_endpoint', type='http', auth='user')
    def user_endpoint(self):
        """
        auth='user': Requires logged-in user
        - Redirects to login if not authenticated
        - request.env.user is authenticated user
        """
        return f"Hello {request.env.user.name}"
    
    @http.route('/none_endpoint', type='http', auth='none')
    def none_endpoint(self):
        """
        auth='none': No authentication, no session
        - No database connection
        - Use for health checks, webhooks
        - Very fast, minimal overhead
        """
        return "Server is running"
    
    # ==================== CSRF PROTECTION ====================
    
    @http.route('/protected_form', type='http', auth='user', csrf=True)
    def protected_form(self, **kw):
        """
        csrf=True (default for unsafe methods)
        
        Template must include CSRF token:
        <input type="hidden" name="csrf_token" t-att-value="request.csrf_token()"/>
        """
        if request.httprequest.method == 'POST':
            # Process form
            name = kw.get('name')
            # ... save to database
            return request.redirect('/success')
        
        return request.render('my_module.form_template')
    
    @http.route('/webhook', type='http', auth='none', csrf=False)
    def webhook(self, **kw):
        """
        csrf=False: Disable CSRF protection
        
        Use for:
        - External webhooks (payment gateways, APIs)
        - Third-party integrations
        - Implement own authentication
        """
        # Verify webhook signature
        signature = request.httprequest.headers.get('X-Signature')
        if not self._verify_signature(signature):
            return werkzeug.exceptions.Forbidden()
        
        # Process webhook
        data = request.jsonrequest
        # ... handle webhook
        
        return {'status': 'ok'}
    
    # ==================== CORS CONFIGURATION ====================
    
    @http.route('/api/external', type='json', auth='none', cors='*', csrf=False)
    def external_api(self, **kw):
        """
        cors='*': Allow all origins
        cors='https://example.com': Allow specific origin
        
        For cross-origin API requests from external websites
        """
        return {'message': 'CORS enabled'}
```

================================================================================
2. REQUEST/RESPONSE PATTERNS
================================================================================

```python
from odoo import http
from odoo.http import request
import json
import werkzeug

class RequestResponsePatterns(http.Controller):
    
    # ==================== ACCESSING REQUEST DATA ====================
    
    @http.route('/demo/request_data', type='http', auth='public')
    def request_data(self, **kw):
        """Access various request properties"""
        
        # Request object
        req = request.httprequest
        
        # HTTP method
        method = req.method  # GET, POST, PUT, DELETE
        
        # Headers
        content_type = req.headers.get('Content-Type')
        user_agent = req.headers.get('User-Agent')
        
        # Query parameters (GET)
        query_param = kw.get('param_name')
        # or
        query_param = req.args.get('param_name')
        
        # POST data (form)
        form_value = req.form.get('field_name')
        
        # POST data (JSON)
        if req.is_json:
            json_data = req.get_json()
        
        # Files
        if 'file' in req.files:
            uploaded_file = req.files['file']
            filename = uploaded_file.filename
            content = uploaded_file.read()
        
        # Cookies
        session_id = req.cookies.get('session_id')
        
        # Full URL
        url = req.url  # http://example.com/demo/request_data?param=value
        base_url = req.base_url  # http://example.com/demo/request_data
        
        # Remote address
        ip_address = req.remote_addr
        
        return json.dumps({
            'method': method,
            'content_type': content_type,
            'params': kw
        })
    
    # ==================== RESPONSE TYPES ====================
    
    @http.route('/demo/html_response', type='http', auth='public')
    def html_response(self):
        """Return HTML response"""
        return request.render('my_module.template_name', {
            'var1': 'value1',
            'var2': 'value2'
        })
    
    @http.route('/demo/json_response', type='json', auth='public')
    def json_response(self):
        """Return JSON response (type='json')"""
        return {
            'status': 'success',
            'data': {'key': 'value'},
            'message': 'Operation completed'
        }
    
    @http.route('/demo/custom_response', type='http', auth='public')
    def custom_response(self):
        """Custom HTTP response"""
        return request.make_response(
            data='Custom content',
            headers=[
                ('Content-Type', 'text/plain'),
                ('X-Custom-Header', 'value')
            ]
        )
    
    @http.route('/demo/redirect', type='http', auth='public')
    def redirect_response(self):
        """Redirect response"""
        return request.redirect('/target_url')
        
        # Or with query params
        return request.redirect('/shop?category=5')
        
        # External redirect
        return werkzeug.utils.redirect('https://www.odoo.com')
    
    @http.route('/demo/404', type='http', auth='public')
    def not_found(self):
        """Return 404 error"""
        raise werkzeug.exceptions.NotFound()
    
    @http.route('/demo/error', type='http', auth='public')
    def error_response(self):
        """Return error with custom message"""
        raise werkzeug.exceptions.BadRequest('Invalid input')
        # or
        raise werkzeug.exceptions.Forbidden('Access denied')
        # or
        raise werkzeug.exceptions.InternalServerError('Server error')
    
    # ==================== STREAMING RESPONSE ====================
    
    @http.route('/demo/stream', type='http', auth='user')
    def stream_response(self):
        """Stream large file"""
        def generate():
            for i in range(1000):
                yield f"Line {i}\n"
        
        return request.make_response(
            generate(),
            headers=[('Content-Type', 'text/plain')]
        )
    
    # ==================== BINARY RESPONSE (FILE DOWNLOAD) ====================
    
    @http.route('/demo/download', type='http', auth='user')
    def download_file(self):
        """Download file"""
        import io
        
        # Create file content
        content = b"File content here"
        buffer = io.BytesIO(content)
        
        return request.make_response(
            buffer.getvalue(),
            headers=[
                ('Content-Type', 'application/octet-stream'),
                ('Content-Disposition', 'attachment; filename="file.txt"'),
                ('Content-Length', len(content))
            ]
        )
    
    # ==================== SET COOKIES ====================
    
    @http.route('/demo/set_cookie', type='http', auth='public')
    def set_cookie(self):
        """Set cookie in response"""
        response = request.make_response('Cookie set')
        response.set_cookie(
            'my_cookie',
            'cookie_value',
            max_age=3600,  # 1 hour
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        return response
```

================================================================================
3. ENVIRONMENT & CONTEXT PATTERNS
================================================================================

```python
from odoo import http
from odoo.http import request

class EnvironmentPatterns(http.Controller):
    
    @http.route('/demo/environment', type='http', auth='user')
    def environment_usage(self):
        """Accessing Odoo environment"""
        
        # ==================== ENVIRONMENT ACCESS ====================
        
        # Current environment
        env = request.env
        
        # Current user
        user = env.user
        user_name = user.name
        user_email = user.email
        user_id = user.id
        
        # Current company
        company = env.company
        company_name = company.name
        
        # Current database
        db_name = env.cr.dbname
        
        # ==================== MODEL ACCESS ====================
        
        # Access models
        Product = env['product.product']
        Partner = env['res.partner']
        SaleOrder = env['sale.order']
        
        # Search records
        products = Product.search([('active', '=', True)], limit=10)
        
        # Browse by ID
        product = Product.browse(123)
        
        # Create record
        partner = Partner.create({
            'name': 'New Partner',
            'email': 'partner@example.com'
        })
        
        # ==================== CONTEXT MANAGEMENT ====================
        
        # Get context
        context = env.context
        lang = context.get('lang', 'en_US')
        timezone = context.get('tz', 'UTC')
        
        # Modify context (immutable, creates new env)
        env_with_lang = env['product.product'].with_context(lang='fr_FR')
        products_fr = env_with_lang.search([])
        
        # Switch user (DANGEROUS - use with caution)
        admin_env = env['product.product'].with_user(1)  # 1 = admin
        admin_products = admin_env.search([])
        
        # Sudo (bypass access rights)
        products_sudo = env['product.product'].sudo().search([])
        
        # ==================== SESSION ACCESS ====================
        
        # Access session
        session = request.session
        
        # Session variables
        uid = session.uid  # User ID
        db = session.db    # Database name
        login = session.login  # Username
        
        # Custom session data
        session['custom_key'] = 'custom_value'
        custom_value = session.get('custom_key')
        
        # ==================== WEBSITE CONTEXT ====================
        
        # Current website (if website=True)
        website = request.website
        website_name = website.name
        website_domain = website.domain
        
        # Website-specific records
        menu = website.menu_id
        
        # ==================== LANGUAGE/TRANSLATION ====================
        
        # Get current language
        lang_code = env.context.get('lang', 'en_US')
        lang = env['res.lang']._lang_get(lang_code)
        
        # Translate string
        from odoo import _
        translated = _('Hello World')
        
        # ==================== TIMEZONE ====================
        
        # Get user timezone
        from pytz import timezone
        tz = timezone(env.context.get('tz') or 'UTC')
        
        # Convert datetime to user timezone
        from datetime import datetime
        utc_time = datetime.now()
        local_time = utc_time.astimezone(tz)
        
        return request.render('my_module.environment_template', {
            'user': user,
            'company': company,
            'products': products,
            'lang': lang_code
        })
    
    # ==================== TRANSACTION MANAGEMENT ====================
    
    @http.route('/demo/transaction', type='json', auth='user')
    def transaction_example(self):
        """Database transaction handling"""
        env = request.env
        
        try:
            # All operations in same transaction
            partner = env['res.partner'].create({'name': 'Partner 1'})
            product = env['product.product'].create({'name': 'Product 1'})
            
            # Commit happens automatically at end of request
            
            return {'status': 'success'}
            
        except Exception as e:
            # Rollback happens automatically on exception
            return {'status': 'error', 'message': str(e)}
    
    @http.route('/demo/manual_commit', type='http', auth='user', csrf=False)
    def manual_commit(self):
        """Manual transaction control (RARE - usually not needed)"""
        env = request.env
        
        try:
            partner = env['res.partner'].create({'name': 'Partner'})
            
            # Manual commit (breaks transaction isolation!)
            env.cr.commit()
            
            # This runs in new transaction
            product = env['product.product'].create({'name': 'Product'})
            
        except Exception:
            # Only product creation will be rolled back
            # Partner creation was already committed
            pass
        
        return 'Done'
```

USAGE NOTES:
- @http.route decorator registers URL endpoints
- type='http' for HTML, type='json' for JSON-RPC
- auth levels: 'public', 'user', 'none'
- request.env provides ORM access
- request.session for session data
- CSRF protection enabled by default for POST/PUT/DELETE
- Use cors parameter for cross-origin requests
- Model converters in URL patterns automatically fetch records


````
