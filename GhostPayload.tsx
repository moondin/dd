import { useState } from "react";

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "SPACE (Hold)", action: "Pan Canvas" },
    { key: "WHEEL", action: "Zoom" },
    { key: "⌘ + ENTER", action: "Execute" },
    { key: "⌘ + Z", action: "Undo" },
    { key: "BACKSPACE", action: "Delete Selected" },
    { key: "ESC", action: "Deselect / Exit Mode" },
    { key: "[ / ]", action: "Brush Size" },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ceramic-panel w-8 h-8 flex items-center justify-center hover:shadow-ceramic-hover transition-shadow"
      >
        <span className="text-ceramic-foreground font-bold text-sm">?</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 ceramic-panel p-4 min-w-[250px]">
          <div className="mb-3">
            <span className="tech-label text-[10px] opacity-50">
              AVIONICS_CONTROLS
            </span>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-ceramic-foreground/60">
                  {shortcut.action}
                </span>
                <span className="tech-label text-[10px] bg-steel/20 px-2 py-0.5 rounded">
                  {shortcut.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
