import { useRef, useState, useEffect } from "react";

interface InpaintOverlayProps {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
  brushSize: number;
  mask: { x: number; y: number; radius: number }[];
  onAddMaskPoint: (x: number, y: number, radius: number) => void;
  zoom: number;
  mode?: "inpaint" | "reference" | "target";
}

export function InpaintOverlay({
  imageWidth,
  imageHeight,
  imageX,
  imageY,
  brushSize,
  mask,
  onAddMaskPoint,
  zoom,
  mode = "inpaint",
}: InpaintOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // getModeLabel and getModeHint remain as functions since they're only called during render

  const getModeLabel = () => {
    switch (mode) {
      case "reference":
        return "REFERENCE_SELECT";
      case "target":
        return "TARGET_SELECT";
      default:
        return "MODIFY_MODE";
    }
  };

  const getModeHint = () => {
    switch (mode) {
      case "reference":
        return "ENTER TO CONFIRM";
      case "target":
        return "TYPE PROMPT TO APPLY";
      default:
        return "[ / ] ADJUST APERTURE";
    }
  };

  // Get mask color based on mode - memoized to avoid stale closure
  const maskColor = (() => {
    switch (mode) {
      case "reference":
        return "hsla(120, 100%, 50%, 0.5)"; // Green for reference
      case "target":
        return "hsla(25, 100%, 55%, 0.5)"; // Orange for target
      default:
        return "hsla(25, 100%, 55%, 0.5)"; // Orange for inpaint
    }
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, imageWidth, imageHeight);

    // Draw mask with mode-specific color
    ctx.fillStyle = maskColor;
    mask.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [mask, imageWidth, imageHeight, maskColor]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPainting(true);
    addPoint(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    if (isPainting) {
      addPoint(e);
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const addPoint = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Canvas is already scaled by zoom, so we need to account for that
    const scaleX = imageWidth / rect.width;
    const scaleY = imageHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    onAddMaskPoint(x, y, brushSize * scaleX);
  };

  const borderColor = mode === "reference" ? "border-emerald-500" : "border-safety";

  return (
    <div
      className="absolute cursor-reticle"
      style={{
        left: imageX,
        top: imageY,
        width: imageWidth,
        height: imageHeight,
      }}
    >
      <canvas
        ref={canvasRef}
        width={imageWidth}
        height={imageHeight}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Brush Cursor Indicator - position is in screen coords, size is visual */}
      <div
        className={`pointer-events-none absolute border-2 ${borderColor} rounded-full opacity-70`}
        style={{
          left: cursorPos.x - brushSize / 2,
          top: cursorPos.y - brushSize / 2,
          width: brushSize,
          height: brushSize,
        }}
      />

      {/* Mode Indicator */}
      <div className="absolute top-2 right-2 ceramic-panel px-3 py-1.5">
        <span className={`tech-label text-[10px] ${mode === "reference" ? "text-emerald-500" : "text-safety"}`}>
          {getModeLabel()}
        </span>
        <span className="text-[10px] text-muted-foreground ml-2">
          {getModeHint()}
        </span>
      </div>
    </div>
  );
}
