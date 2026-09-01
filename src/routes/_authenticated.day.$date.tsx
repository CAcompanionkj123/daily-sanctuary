import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ImagePlus, Paperclip, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoodPicker } from "@/components/MoodPicker";
import { GratitudeBox } from "@/components/GratitudeBox";
import { TaskBoard } from "@/components/TaskBoard";
import { AppShell } from "@/components/AppShell";
import { useAttachmentMutations, useAttachments } from "@/hooks/useAttachments";
import { useEntry, useSaveEntry } from "@/hooks/useDiary";
import { fromDateKey, moodOf, shiftDateKey, writingFontClass, writingSizeClass, lineSpacingClass } from "@/lib/diary";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/day/$date")({
  head: () => ({
    meta: [
      { title: "Daily page — Digital Diary" },
      { name: "description", content: "Write, reflect and plan on your private Digital Diary daily page." },
      { property: "og:title", content: "Daily page — Digital Diary" },
      { property: "og:description", content: "A quiet, private page for writing and reflection." },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const { date } = Route.useParams();
  const { data: entry } = useEntry(date);
  const { data: profile } = useProfile();
  const save = useSaveEntry(date);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(entry?.title ?? "");
    setContent(entry?.content ?? "");
  }, [entry?.id, entry?.title, entry?.content]);

  const displayDate = fromDateKey(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const mood = moodOf(entry?.mood);
  const saveText = (patch: Parameters<typeof save.mutate>[0]) => save.mutate(patch);

  return (
    <AppShell>
      <div className="page-in space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">Daily page</p>
            <h1 className="mt-2 text-4xl">{displayDate}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild aria-label="Previous day">
              <Link to="/day/$date" params={{ date: shiftDateKey(date, -1) }}>
                <ArrowLeft />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild aria-label="Next day">
              <Link to="/day/$date" params={{ date: shiftDateKey(date, 1) }}>
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="paper-sheet p-6 sm:p-10">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => saveText({ title: title.trim() || null })}
              placeholder="A title for today"
              aria-label="Entry title"
              className="border-0 px-0 font-display text-2xl shadow-none focus-visible:ring-0"
            />
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onBlur={() => saveText({ content })}
              placeholder="What is on your mind?"
              aria-label="Diary entry"
              className={`ink-rule mt-7 min-h-[28rem] resize-y border-0 bg-transparent px-0 py-0 text-lg shadow-none focus-visible:ring-0 ${writingFontClass(profile?.preferred_font)} ${writingSizeClass(profile?.writing_size)} ${lineSpacingClass(profile?.line_spacing)}`}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <span className="font-sans text-xs text-muted-foreground">
                {save.isPending ? "Saving…" : entry?.updated_at ? "Saved just now" : "Your page saves when you leave a field"}
              </span>
              {mood && <span className="font-sans text-sm text-muted-foreground">{mood.emoji} {mood.label}</span>}
            </div>
          </article>

          <aside className="space-y-6">
            <section className="paper-sheet p-6">
              <h2 className="text-xl">How did it feel?</h2>
              <div className="mt-4"><MoodPicker value={entry?.mood} onChange={(key, score) => saveText({ mood: key, mood_score: score })} /></div>
            </section>
            <AttachmentBox entryId={entry?.id} inputRef={fileInput} />
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GratitudeBox entryId={entry?.id} />
          <TaskBoard dateKey={date} />
        </div>
      </div>
    </AppShell>
  );
}

function AttachmentBox({ entryId, inputRef }: { entryId: string | undefined; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const { data: attachments = [] } = useAttachments(entryId);
  const { upload, remove } = useAttachmentMutations(entryId);
  return (
    <section className="paper-sheet p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl">Keepsakes</h2>
        <Button size="icon" variant="outline" aria-label="Add photo or file" disabled={!entryId} onClick={() => inputRef.current?.click()}>
          <ImagePlus />
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,audio/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            upload.mutate(file, { onError: (error) => toast.error(error.message) });
            event.target.value = "";
          }}
        />
      </div>
      {!entryId && <p className="mt-2 font-sans text-xs text-muted-foreground">Save your page first to add a memory.</p>}
      <ul className="mt-4 space-y-3">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="flex items-center gap-2 font-sans text-sm">
            <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
            <a href={attachment.url ?? "#"} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate underline-offset-4 hover:underline">{attachment.file_name}</a>
            <Button size="icon" variant="ghost" aria-label={`Delete ${attachment.file_name}`} onClick={() => remove.mutate(attachment)}><Trash2 /></Button>
          </li>
        ))}
        {!attachments.length && entryId && <li className="font-sans text-sm text-muted-foreground">No keepsakes yet.</li>}
      </ul>
    </section>
  );
}