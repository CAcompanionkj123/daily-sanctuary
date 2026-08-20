import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { useCarryOver, useDayTasks, useTaskMutations, type Task } from "@/hooks/useTasks";
import { PRIORITIES, type Priority } from "@/lib/diary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function TaskBoard({ dateKey }: { dateKey: string }) {
  const { data: tasks = [] } = useDayTasks(dateKey);
  const { data: carryOver = [] } = useCarryOver(dateKey);
  const { create, toggle, remove, update, moveToDate } = useTaskMutations();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    create.mutate({ title: title.trim(), task_date: dateKey, priority, position: tasks.length });
    setTitle("");
  }

  return (
    <section className="paper-sheet p-6">
      <h2 className="text-xl">Plan for the day</h2>
      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add something to do…"
          className="min-w-40 flex-1"
        />
        <div className="flex gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "rounded-md border border-border px-2.5 py-1 font-sans text-xs capitalize transition-colors",
                priority === p ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <Button type="submit" size="icon" aria-label="Add task">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <ul className="mt-5 space-y-1">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            onToggle={() => toggle.mutate(t)}
            onRemove={() => remove.mutate(t.id)}
            onCyclePriority={() => {
              const idx = PRIORITIES.indexOf((t.priority as Priority) ?? "medium");
              update.mutate({
                id: t.id,
                patch: { priority: PRIORITIES[(idx + 1) % PRIORITIES.length] },
              });
            }}
          />
        ))}
        {!tasks.length && (
          <li className="font-sans text-sm text-muted-foreground">Nothing planned yet.</li>
        )}
      </ul>

      {carryOver.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-sans text-sm text-muted-foreground">
              {carryOver.length} unfinished from earlier days
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveToDate.mutate({ ids: carryOver.map((t) => t.id), dateKey })}
            >
              <ArrowRight className="mr-1 h-3.5 w-3.5" /> Bring to today
            </Button>
          </div>
          <ul className="mt-3 space-y-1">
            {carryOver.slice(0, 6).map((t) => (
              <li key={t.id} className="font-serif text-lg text-muted-foreground">
                {t.title}
                <span className="ml-2 font-sans text-xs">{t.task_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
  onCyclePriority,
}: {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
  onCyclePriority: () => void;
}) {
  return (
    <li className="group flex items-center gap-3 rounded-md px-1 py-1.5 hover:bg-accent/40">
      <Checkbox checked={task.completed} onCheckedChange={onToggle} aria-label={task.title} />
      <span
        className={cn(
          "write-serif flex-1 text-lg",
          task.completed && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </span>
      <button
        onClick={onCyclePriority}
        className="font-sans text-xs capitalize text-muted-foreground hover:text-foreground"
      >
        {task.priority}
      </button>
      <button
        onClick={onRemove}
        aria-label={`Delete ${task.title}`}
        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
