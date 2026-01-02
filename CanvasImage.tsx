import { useRef, useState, useEffect, useCallback } from "react";
import { CanvasImage as CanvasImageType } from "@/types/canvas";

const GRID_SIZE = 32;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

interface CanvasImageProps {
  image: CanvasImageType;
  isSelected: boolean;
  isInpaintMode: boolean;
  isFocusDimmed: boolean;
  zoom: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function CanvasImageComponent({
  image,
  isSelected,
  isInpaintMode,
  isFocusDimmed,
  zoom,
  onSelect,
  onMove,
  onResize,
  onContextMenu,
}: CanvasImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, imageX: 0, imageY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const originalPosRef = useRef({ x: 0, y: 0 });

  /**
   * Handle mouse move - update position while dragging or resizing
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStartRef.current.x) / zoom;
        const dy = (e.clientY - dragStartRef.current.y) / zoom;
        onMove(dragStartRef.current.imageX + dx, dragStartRef.current.imageY + dy);
      }
      if (isResizing && resizeCorner) {
        const dx = (e.clientX - resizeStartRef.current.x) / zoom;
        const dy = (e.clientY - resizeStartRef.current.y) / zoom;
        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;
        let newX = originalPosRef.current.x;
        let newY = originalPosRef.current.y;

        // Handle horizontal resizing
        if (resizeCorner.includes("e")) {
          newWidth += dx;
        }
        if (resizeCorner.includes("w")) {
          newWidth -= dx;
          newX = originalPosRef.current.x + dx;
        }
        
        // Handle vertical resizing
        if (resizeCorner.includes("s")) {
          newHeight += dy;
        }
        if (resizeCorner.includes("n")) {
          newHeight -= dy;
          newY = originalPosRef.current.y + dy;
        }

        // Apply minimum size constraints
        const finalWidth = Math.max(100, newWidth);
        const finalHeight = Math.max(100, newHeight);
        
        // Adjust position if we hit minimum size
        if (resizeCorner.includes("w") && newWidth < 100) {
          newX = originalPosRef.current.x + resizeStartRef.current.width - 100;
        }
        if (resizeCorner.includes("n") && newHeight < 100) {
          newY = originalPosRef.current.y + resizeStartRef.current.height - 100;
        }

        onResize(finalWidth, finalHeight);
        onMove(newX, newY);
      }
    },
    [isDragging, isResizing, resizeCorner, zoom, onMove, onResize]
  );

  /**
   * Handle mouse up - stop dragging or resizing
   */
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current && !isResizing) return;

    // Snap to grid on mouse up
    if (isDragging) {
      const snappedX = snapToGrid(image.x);
      const snappedY = snapToGrid(image.y);
      onMove(snappedX, snappedY);
    }
    if (isResizing) {
      const snappedX = snapToGrid(image.x);
      const snappedY = snapToGrid(image.y);
      const snappedWidth = snapToGrid(image.width);
      const snappedHeight = snapToGrid(image.height);
      onMove(snappedX, snappedY);
      onResize(Math.max(GRID_SIZE * 2, snappedWidth), Math.max(GRID_SIZE * 2, snappedHeight));
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setIsResizing(false);
    setResizeCorner(null);

    // Remove dragging cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [isDragging, isResizing, image.x, image.y, image.width, image.height, onMove, onResize]);

  /**
   * Set up global mouse event listeners
   */
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  /**
   * Handle mouse down on drag handle - start dragging
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;

      e.stopPropagation();
      onSelect();

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        imageX: image.x,
        imageY: image.y,
      };

      // Add dragging cursor to body
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
    },
    [image.x, image.y, onSelect]
  );

  /**
   * Handle resize start
   */
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, corner: string) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeCorner(corner);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: image.width,
        height: image.height,
      };
      originalPosRef.current = {
        x: image.x,
        y: image.y,
      };
    },
    [image.width, image.height, image.x, image.y]
  );

  return (
    <div
      className={`absolute transition-all duration-75 ${
        isFocusDimmed ? "focus-dim" : "focus-active"
      }`}
      style={{
        left: image.x,
        top: image.y,
        width: image.width,
        height: image.height,
        zIndex: isSelected ? 100 : 1,
      }}
    >
      {/* Image */}
      <div
        className={`w-full h-full snap-in cursor-move ${
          isSelected ? "target-lock" : ""
        }`}
        onMouseDown={handleMouseDown}
        onContextMenu={onContextMenu}
      >
        <img
          src={image.src}
          alt={image.prompt}
          className="w-full h-full object-cover rounded"
          draggable={false}
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".35em" fill="%23666" font-size="12">Image failed</text></svg>';
          }}
        />
      </div>

      {/* Selection Brackets */}
      {isSelected && !isInpaintMode && (
        <>
          {/* Corner Brackets */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />

          {/* Resize Handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-primary cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-primary cursor-ne-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary cursor-sw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}
    </div>
  );
}
