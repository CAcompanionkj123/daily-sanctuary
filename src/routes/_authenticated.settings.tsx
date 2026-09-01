import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { WRITING_FONTS } from "@/lib/diary";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Digital Diary" },
      {
        name: "description",
        content: "Personalize your private Digital Diary writing experience.",
      },
      { property: "og:title", content: "Settings — Digital Diary" },
      { property: "og:description", content: "Personalize your diary." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const [name, setName] = useState("");
  const [font, setFont] = useState("serif");
  const [size, setSize] = useState("medium");
  const [theme, setTheme] = useState("system");
  useEffect(() => {
    if (!profile) return;
    setName(profile.display_name ?? "");
    setFont(profile.preferred_font);
    setSize(profile.writing_size);
    setTheme(profile.preferred_theme);
  }, [
    profile?.id,
    profile?.display_name,
    profile?.preferred_font,
    profile?.writing_size,
    profile?.preferred_theme,
  ]);
  function save() {
    update.mutate(
      {
        display_name: name.trim() || null,
        preferred_font: font,
        writing_size: size,
        preferred_theme: theme,
      },
      {
        onSuccess: () => toast.success("Settings saved."),
        onError: () => toast.error("Could not save your settings."),
      },
    );
  }
  return (
    <AppShell>
      <div className="page-in mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Make it yours
          </p>
          <h1 className="mt-2 text-4xl">Settings</h1>
        </header>
        <section className="paper-sheet space-y-7 p-6 sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="display-name">Your name</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What should we call you?"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Writing font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WRITING_FONTS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Writing size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Comfortable</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Appearance</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Use device setting</SelectItem>
                <SelectItem value="light">Light paper</SelectItem>
                <SelectItem value="dark">Dark paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end border-t border-border pt-5">
            <Button onClick={save} disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
