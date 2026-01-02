import { useRef, useState, useEffect, useCallback } from "react";
import { useCanvasState } from "@/hooks/useCanvasState";
import { CanvasImage } from "@/types/canvas";
import { CommandModule, type ModelId } from "./CommandModule";
import { CanvasImageComponent } from "./CanvasImage";
import { GhostPayload } from "./GhostPayload";
import { ContextMenu } from "./ContextMenu";
import { InpaintOverlay } from "./InpaintOverlay";
import { StatusBar } from "./StatusBar";
import { HelpPanel } from "./HelpPanel";
import { generateImage as generateAIImage, editWithReference } from "@/services/imageGeneration";
import { toast } from "sonner";

const GRID_SIZE = 32;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function InfiniteCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    state,
    addImage,
    updateImage,
    selectImage,
    deleteImage,
    moveImage,
    resizeImage,
    setZoom,
    setPan,
    setPanning,
    enterInpaintMode,
    exitInpaintMode,
    addMaskPoint,
    setBrushSize,
    setGenerating,
    setGhostPayload,
    undo,
    enterReferenceMode,
    setReferenceData,
    enterTargetMode,
    exitReferenceMode,
  } = useCanvasState();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    imageId: string;
  } | null>(null);

  const lastPanPos = useRef({ x: 0, y: 0 });
  
  const selectedImage = state.images.find((img) => img.id === state.selectedId);

  // Generate AI image or apply reference edit
  const generateImage = useCallback(
    async (prompt: string, model: ModelId) => {
      // Handle target mode (reference-based editing)
      if (state.isTargetMode && state.referenceData && selectedImage) {
        setGenerating(true);
        
        try {
          const result = await editWithReference({
            prompt,
            targetImage: selectedImage.src,
            referenceImage: state.referenceData.imageSrc,
            targetMask: state.inpaintMask,
            referenceMask: state.referenceData.mask,
          });

          if (result) {
            // Update the existing image in place with the edited version
            const updatedImage: CanvasImage = {
              ...selectedImage,
              src: result.imageUrl,
              prompt: `${selectedImage.prompt} → ${result.prompt}`,
            };
            updateImage(updatedImage);
            exitReferenceMode();
            toast.success("Reference edit applied successfully");
          } else {
            setGenerating(false);
          }
        } catch (error) {
          console.error("Reference edit failed:", error);
          setGenerating(false);
          toast.error("Reference edit failed. Please try again.");
        }
        return;
      }

      // Normal generation
      setGenerating(true);
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const imageWidth = 512;
      const imageHeight = 512;

      const rawX = (viewportCenterX - state.panX) / state.zoom - imageWidth / 2;
      const rawY = (viewportCenterY - state.panY) / state.zoom - imageHeight / 2;
      const x = snapToGrid(rawX);
      const y = snapToGrid(rawY);

      setGhostPayload({ x, y, width: imageWidth, height: imageHeight });

      try {
        const result = await generateAIImage(prompt, model);

        if (result) {
          const newImage: CanvasImage = {
            id: `img_${Date.now()}`,
            src: result.imageUrl,
            x,
            y,
            width: imageWidth,
            height: imageHeight,
            prompt: result.prompt,
            createdAt: Date.now(),
          };

          addImage(newImage);
          toast.success("Payload deployed successfully");
        } else {
          setGenerating(false);
          setGhostPayload(null);
        }
      } catch (error) {
        console.error("Generation failed:", error);
        setGenerating(false);
        setGhostPayload(null);
        toast.error("Generation failed. Please try again.");
      }
    },
    [addImage, updateImage, setGenerating, setGhostPayload, state.panX, state.panY, state.zoom, state.isTargetMode, state.referenceData, state.inpaintMask, selectedImage, exitReferenceMode]
  );

  const handleConfirmReference = useCallback(() => {
    if (state.isReferenceMode && state.inpaintMask.length > 0 && selectedImage) {
      setReferenceData({
        imageId: selectedImage.id,
        imageSrc: selectedImage.src,
        mask: [...state.inpaintMask],
        imageWidth: selectedImage.width,
        imageHeight: selectedImage.height,
      });
      toast.success("Reference captured! Right-click another image and select 'Apply Reference Here'");
    }
  }, [state.isReferenceMode, state.inpaintMask, selectedImage, setReferenceData]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Allow normal typing in inputs, only intercept Escape
      if (isTyping) {
        if (e.key === "Escape") {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      // Space for panning
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setPanning(true);
      }

      // Escape to deselect or exit inpaint/reference mode
      if (e.key === "Escape") {
        if (state.isReferenceMode || state.isTargetMode) {
          exitReferenceMode();
          toast.info("Reference mode cancelled");
        } else if (state.isInpaintMode) {
          exitInpaintMode();
        } else {
          selectImage(null);
        }
        setContextMenu(null);
      }

      // Enter to confirm reference selection
      if (e.key === "Enter" && state.isReferenceMode && state.inpaintMask.length > 0) {
        e.preventDefault();
        handleConfirmReference();
      }

      // Backspace/Delete to remove selected image
      if ((e.key === "Backspace" || e.key === "Delete") && state.selectedId) {
        e.preventDefault();
        deleteImage(state.selectedId);
      }

      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }

      // [ and ] for brush size
      if (e.key === "[") {
        setBrushSize(state.brushSize - 5);
      }
      if (e.key === "]") {
        setBrushSize(state.brushSize + 5);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    state.selectedId,
    state.isInpaintMode,
    state.isReferenceMode,
    state.isTargetMode,
    state.brushSize,
    state.inpaintMask.length,
    deleteImage,
    selectImage,
    setPanning,
    exitInpaintMode,
    exitReferenceMode,
    setBrushSize,
    undo,
    handleConfirmReference,
  ]);

  // Handle wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(state.zoom + delta);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [state.zoom, setZoom]);

  // Handle panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state.isPanning) {
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    } else if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-content")) {
      selectImage(null);
      setContextMenu(null);
    }
  }, [state.isPanning, selectImage]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (state.isPanning && e.buttons === 1) {
      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;
      setPan(state.panX + dx, state.panY + dy);
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  }, [state.isPanning, state.panX, state.panY, setPan]);

  const handleContextMenu = useCallback((e: React.MouseEvent, imageId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, imageId });
    selectImage(imageId);
  }, [selectImage]);

  const handleInpaint = useCallback(() => {
    if (state.selectedId) {
      enterInpaintMode();
    }
  }, [state.selectedId, enterInpaintMode]);

  const handleDuplicate = useCallback(() => {
    const original = state.images.find((img) => img.id === state.selectedId);
    if (original) {
      const duplicate: CanvasImage = {
        ...original,
        id: `img_${Date.now()}`,
        x: snapToGrid(original.x + GRID_SIZE),
        y: snapToGrid(original.y + GRID_SIZE),
        createdAt: Date.now(),
      };
      addImage(duplicate);
    }
  }, [state.images, state.selectedId, addImage]);

  const handleUseAsReference = useCallback(() => {
    if (state.selectedId) {
      enterReferenceMode();
      toast.info("Paint the reference area, then press Enter to confirm");
    }
  }, [state.selectedId, enterReferenceMode]);

  const handleApplyReference = useCallback(() => {
    if (state.selectedId && state.referenceData) {
      enterTargetMode();
      toast.info("Paint the target area to modify, then type your prompt");
    }
  }, [state.selectedId, state.referenceData, enterTargetMode]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (state.selectedId) {
      deleteImage(state.selectedId);
    }
  }, [state.selectedId, deleteImage]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 grid-crosshairs" />

      {/* Canvas Content */}
      <div
        ref={canvasRef}
        className={`absolute inset-0 canvas-content ${
          state.isPanning ? "cursor-glove" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Transformed Layer */}
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`,
          }}
        >
          {/* Ghost Payload (Loading State) */}
          {state.ghostPayload && (
            <GhostPayload
              x={state.ghostPayload.x}
              y={state.ghostPayload.y}
              width={state.ghostPayload.width}
              height={state.ghostPayload.height}
            />
          )}

          {/* Images */}
          {state.images.map((image) => (
            <CanvasImageComponent
              key={image.id}
              image={image}
              isSelected={image.id === state.selectedId}
              isInpaintMode={state.isInpaintMode && image.id === state.selectedId}
              isFocusDimmed={
                state.isInpaintMode && image.id !== state.selectedId
              }
              zoom={state.zoom}
              onSelect={() => selectImage(image.id)}
              onMove={(x, y) => moveImage(image.id, x, y)}
              onResize={(w, h) => resizeImage(image.id, w, h)}
              onContextMenu={(e) => handleContextMenu(e, image.id)}
            />
          ))}

          {/* Inpaint Overlay */}
          {state.isInpaintMode && selectedImage && (
            <InpaintOverlay
              imageWidth={selectedImage.width}
              imageHeight={selectedImage.height}
              imageX={selectedImage.x}
              imageY={selectedImage.y}
              brushSize={state.brushSize}
              mask={state.inpaintMask}
              onAddMaskPoint={addMaskPoint}
              zoom={state.zoom}
              mode={state.isReferenceMode ? "reference" : state.isTargetMode ? "target" : "inpaint"}
            />
          )}
        </div>
      </div>

      {/* UI Overlays */}
      <StatusBar
        zoom={state.zoom}
        imageCount={state.images.length}
        hasSelection={!!state.selectedId}
        isInpaintMode={state.isInpaintMode}
        brushSize={state.brushSize}
        isReferenceMode={state.isReferenceMode}
        isTargetMode={state.isTargetMode}
        hasReference={!!state.referenceData}
      />

      <HelpPanel />

      <CommandModule
        onSubmit={generateImage}
        isLocked={state.isGenerating}
        hasSelection={!!state.selectedId}
        isInpaintMode={state.isInpaintMode}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onInpaint={handleInpaint}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onUseAsReference={handleUseAsReference}
          hasReference={!!state.referenceData}
          onApplyReference={handleApplyReference}
        />
      )}
    </div>
  );
}
