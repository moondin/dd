import { useState, useRef, useEffect } from "react";
import { ChevronDown, Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MODELS = [
  { id: "google/gemini-2.5-flash-image-preview", label: "Gemini Flash", tier: "fast" },
  { id: "google/gemini-3-pro-image-preview", label: "Gemini Pro", tier: "quality" },
] as const;

type ModelId = typeof MODELS[number]["id"];

interface CommandModuleProps {
  onSubmit: (prompt: string, model: ModelId) => void;
  isLocked: boolean;
  hasSelection: boolean;
  isInpaintMode: boolean;
}

export function CommandModule({
  onSubmit,
  isLocked,
  hasSelection,
  isInpaintMode,
}: CommandModuleProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelId>("google/gemini-2.5-flash-image-preview");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    const sanitizedPrompt = trimmedPrompt
      .replace(/<[^>]*>/g, '')
      .slice(0, 1000);
    
    if (sanitizedPrompt && !isLocked) {
      onSubmit(sanitizedPrompt, selectedModel);
      setPrompt("");
    }
  };

  const getPlaceholder = () => {
    if (isLocked) return "PROCESSING...";
    if (isInpaintMode) return "DESCRIBE MODIFICATION...";
    if (hasSelection) return "REFINE TARGET";
    return "DESCRIBE PAYLOAD...";
  };

  const getStatus = () => {
    if (isLocked) return "INPUT_LOCKED";
    if (isInpaintMode) return "MODIFY_MODE";
    if (hasSelection) return "TARGET_ACQUIRED";
    return "SYS_READY";
  };

  const currentModel = MODELS.find(m => m.id === selectedModel);

  const handleModelChange = (modelId: ModelId) => {
    setSelectedModel(modelId);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="ceramic-panel px-6 py-4 min-w-[500px] max-w-[700px]">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isLocked
                    ? "bg-safety animate-pulse"
                    : "bg-emerald-500"
                }`}
              />
              <span className="tech-label text-[10px]">{getStatus()}</span>
            </div>
            
            {/* Model Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger 
                disabled={isLocked}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Cpu className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-foreground/80">
                  {currentModel?.label}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="bg-ceramic border-steel min-w-[160px]"
              >
                {MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`flex items-center justify-between gap-3 text-xs font-mono cursor-pointer ${
                      selectedModel === model.id ? "bg-secondary/50" : ""
                    }`}
                  >
                    <span>{model.label}</span>
                    <span className="text-[9px] text-muted-foreground uppercase">
                      {model.tier}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <span className="tech-label text-[10px] opacity-50">
            CMD + ENTER TO EXECUTE
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLocked}
            placeholder={getPlaceholder()}
            className="w-full bg-transparent text-ceramic-foreground placeholder:text-muted-foreground/40 text-sm font-mono outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ caretColor: "hsl(var(--safety-orange))" }}
          />
          {isLocked && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tech-label text-safety animate-status-blink">
                  UPLOADING
                </span>
                <div className="w-4 h-4 border-2 border-safety border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}
        </form>

        {/* Bottom Accent Line */}
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-steel to-transparent" />
      </div>
    </div>
  );
}

export type { ModelId };
