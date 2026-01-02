interface StatusBarProps {
  zoom: number;
  imageCount: number;
  hasSelection: boolean;
  isInpaintMode: boolean;
  brushSize: number;
  isReferenceMode?: boolean;
  isTargetMode?: boolean;
  hasReference?: boolean;
}

export function StatusBar({
  zoom,
  imageCount,
  hasSelection,
  isInpaintMode,
  brushSize,
  isReferenceMode,
  isTargetMode,
  hasReference,
}: StatusBarProps) {
  const getActiveMode = () => {
    if (isReferenceMode) return { label: "REFERENCE_SELECT", color: "text-safety" };
    if (isTargetMode) return { label: "TARGET_SELECT", color: "text-safety" };
    if (isInpaintMode) return { label: "MODIFY_MODE", color: "text-muted-foreground" };
    return null;
  };

  const activeMode = getActiveMode();

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="ceramic-panel px-4 py-2 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-safety rounded-sm" />
          <span className="font-bold text-sm tracking-widest text-ceramic-foreground">
            CANVASEDIT
          </span>
        </div>

        <div className="h-4 w-px bg-steel/30" />

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="tech-label text-[10px] opacity-50">ZOOM</span>
            <span className="text-xs text-ceramic-foreground font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="tech-label text-[10px] opacity-50">PAYLOADS</span>
            <span className="text-xs text-ceramic-foreground font-mono">
              {imageCount}
            </span>
          </div>

          {hasSelection && !activeMode && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-safety rounded-full" />
              <span className="tech-label text-[10px] text-safety">
                TARGET_LOCKED
              </span>
            </div>
          )}

          {activeMode && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-safety rounded-full animate-pulse" />
              <span className={`tech-label text-[10px] ${activeMode.color}`}>
                {activeMode.label}
              </span>
            </div>
          )}

          {hasReference && !isTargetMode && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="tech-label text-[10px] text-emerald-500">
                REF_STORED
              </span>
            </div>
          )}

          {isInpaintMode && (
            <div className="flex items-center gap-2">
              <span className="tech-label text-[10px] opacity-50">APERTURE</span>
              <span className="text-xs text-ceramic-foreground font-mono">
                {brushSize}px
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
