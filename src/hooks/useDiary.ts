import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Entry = Database["public"]["Tables"]["diary_entries"]["Row"];
export type EntryUpdate = Database["public"]["Tables"]["diary_entries"]["Update"];
export type Gratitude = Database["public"]["Tables"]["gratitude_items"]["Row"];
export type Tag = Database["public"]["Tables"]["entry_tags"]["Row"];
export type Attachment = Database["public"]["Tables"]["entry_attachments"]["Row"];

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

/** Fetches (or lazily creates) the diary page for a given date. */
export function useEntry(dateKey: string) {
  return useQuery({
    queryKey: ["entry", dateKey],
    queryFn: async (): Promise<Entry | null> => {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("entry_date", dateKey)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveEntry(dateKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: EntryUpdate): Promise<Entry> => {
      const user_id = await uid();
      const { data, error } = await supabase
        .from("diary_entries")
        .upsert({ user_id, entry_date: dateKey, ...patch }, { onConflict: "user_id,entry_date" })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["entry", dateKey], data);
      qc.invalidateQueries({ queryKey: ["entries"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("diary_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
      qc.invalidateQueries({ queryKey: ["entry"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { data, error } = await supabase
        .from("diary_entries")
        .update({ is_favorite: value })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["entry", data.entry_date], data);
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

/** Paginated archive list. */
export function useEntries(
  opts: { page?: number; pageSize?: number; favoritesOnly?: boolean } = {},
) {
  const page = opts.page ?? 0;
  const pageSize = opts.pageSize ?? 20;
  return useQuery({
    queryKey: ["entries", page, pageSize, opts.favoritesOnly ?? false],
    queryFn: async () => {
      let q = supabase
        .from("diary_entries")
        .select("*", { count: "exact" })
        .order("entry_date", { ascending: false })
        .range(page * pageSize, page * pageSize + pageSize - 1);
      if (opts.favoritesOnly) q = q.eq("is_favorite", true);
      const { data, error, count } = await q;
      if (error) throw error;
      return { rows: data ?? [], count: count ?? 0 };
    },
  });
}

/** Month range summary for the calendar. */
export function useCalendarMonth(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["calendar", monthStart, monthEnd],
    queryFn: async () => {
      const [entries, tasks] = await Promise.all([
        supabase
          .from("diary_entries")
          .select("entry_date, mood, content")
          .gte("entry_date", monthStart)
          .lte("entry_date", monthEnd),
        supabase
          .from("tasks")
          .select("task_date, completed")
          .gte("task_date", monthStart)
          .lte("task_date", monthEnd),
      ]);
      if (entries.error) throw entries.error;
      if (tasks.error) throw tasks.error;
      return { entries: entries.data ?? [], tasks: tasks.data ?? [] };
    },
  });
}

export function useSearch(
  term: string,
  filters: { from?: string; to?: string; mood?: string } = {},
) {
  return useQuery({
    queryKey: ["search", term, filters],
    enabled: term.trim().length > 1,
    queryFn: async () => {
      const like = `%${term.trim()}%`;
      let q = supabase
        .from("diary_entries")
        .select("*")
        .or(`content.ilike.${like},title.ilike.${like}`)
        .order("entry_date", { ascending: false })
        .limit(50);
      if (filters.from) q = q.gte("entry_date", filters.from);
      if (filters.to) q = q.lte("entry_date", filters.to);
      if (filters.mood) q = q.eq("mood", filters.mood);
      const [entries, tasks, grat] = await Promise.all([
        q,
        supabase.from("tasks").select("*").ilike("title", like).limit(25),
        supabase.from("gratitude_items").select("*").ilike("content", like).limit(25),
      ]);
      if (entries.error) throw entries.error;
      return {
        entries: entries.data ?? [],
        tasks: tasks.data ?? [],
        gratitude: grat.data ?? [],
      };
    },
  });
}

export function useGratitude(entryId: string | null | undefined) {
  return useQuery({
    queryKey: ["gratitude", entryId],
    enabled: !!entryId,
    queryFn: async (): Promise<Gratitude[]> => {
      const { data, error } = await supabase
        .from("gratitude_items")
        .select("*")
        .eq("entry_id", entryId!)
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSaveGratitude(entryId: string | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ position, content }: { position: number; content: string }) => {
      if (!entryId) throw new Error("No entry yet");
      const user_id = await uid();
      const existing = await supabase
        .from("gratitude_items")
        .select("id")
        .eq("entry_id", entryId)
        .eq("position", position)
        .maybeSingle();
      if (!content.trim()) {
        if (existing.data)
          await supabase.from("gratitude_items").delete().eq("id", existing.data.id);
        return;
      }
      if (existing.data) {
        const { error } = await supabase
          .from("gratitude_items")
          .update({ content: content.trim() })
          .eq("id", existing.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("gratitude_items")
          .insert({ entry_id: entryId, user_id, content: content.trim(), position });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gratitude", entryId] }),
  });
}

export function useTags(entryId: string | null | undefined) {
  return useQuery({
    queryKey: ["tags", entryId],
    enabled: !!entryId,
    queryFn: async (): Promise<Tag[]> => {
      const { data, error } = await supabase
        .from("entry_tags")
        .select("*")
        .eq("entry_id", entryId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTagMutations(entryId: string | null | undefined) {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["tags", entryId] });
    qc.invalidateQueries({ queryKey: ["all-tags"] });
  };
  const add = useMutation({
    mutationFn: async (tag: string) => {
      if (!entryId) throw new Error("No entry yet");
      const user_id = await uid();
      const clean = tag.trim().replace(/^#/, "").toLowerCase().slice(0, 32);
      if (!clean) return;
      const { error } = await supabase
        .from("entry_tags")
        .insert({ entry_id: entryId, user_id, tag: clean });
      if (error && !error.message.includes("duplicate")) throw error;
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("entry_tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
  return { add, remove };
}

export function usePrompts() {
  return useQuery({
    queryKey: ["prompts"],
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_prompts").select("*").eq("active", true);
      if (error) throw error;
      return data ?? [];
    },
  });
}
