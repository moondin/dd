import { useEffect, useRef, useCallback } from "react";

interface MenuItemProps {
  label: string;
  shortcut?: string;
  onClick: () => void;
  onClose: () => void;
  danger?: boolean;
  accent?: boolean;
}

function MenuItem({
  label,
  shortcut,
  onClick,
  onClose,
  danger,
  accent,
}: MenuItemProps) {
  const handleClick = useCallback(() => {
    onClick();
    onClose();
  }, [onClick, onClose]);

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-mono hover:bg-steel/20 transition-colors ${
        danger 
          ? "text-destructive hover:bg-destructive/10" 
          : accent 
            ? "text-safety hover:bg-safety/10" 
            : "text-ceramic-foreground"
      }`}
      role="menuitem"
    >
      <span className="uppercase tracking-wide text-xs">{label}</span>
      {shortcut && (
        <span className="tech-label text-[10px] opacity-50">{shortcut}</span>
      )}
    </button>
  );
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onInpaint: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUseAsReference: () => void;
  hasReference: boolean;
  onApplyReference: () => void;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onInpaint,
  onDelete,
  onDuplicate,
  onUseAsReference,
  hasReference,
  onApplyReference,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Calculate position to keep menu in viewport
  const menuStyle = {
    left: Math.min(x, window.innerWidth - 240),
    top: Math.min(y, window.innerHeight - 200),
  };

  return (
    <div
      ref={menuRef}
      className="fixed ceramic-panel py-2 min-w-[220px] z-[200]"
      style={menuStyle}
      role="menu"
      aria-label="Image actions"
    >
      <div className="px-4 py-1 mb-1">
        <span className="tech-label text-[10px] opacity-40">PAYLOAD_ACTIONS</span>
      </div>
      <MenuItem label="Modify / Inpaint" shortcut="RMB" onClick={onInpaint} onClose={onClose} />
      <MenuItem label="Use as Reference" shortcut="R" onClick={onUseAsReference} onClose={onClose} accent />
      {hasReference && (
        <MenuItem label="Apply Reference Here" shortcut="T" onClick={onApplyReference} onClose={onClose} accent />
      )}
      <MenuItem label="Duplicate" shortcut="⌘D" onClick={onDuplicate} onClose={onClose} />
      <div className="h-px bg-steel/30 my-1" role="separator" />
      <MenuItem label="Jettison" shortcut="⌫" onClick={onDelete} onClose={onClose} danger />
    </div>
  );
}
