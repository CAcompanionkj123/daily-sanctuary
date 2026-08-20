import { MOODS } from "@/lib/diary";
import { cn } from "@/lib/utils";

export function MoodPicker({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (key: string, score: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key, m.score)}
          aria-pressed={value === m.key}
          className={cn(
            "flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-sans text-sm transition-colors",
            value === m.key
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60",
          )}
        >
          <span aria-hidden>{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
