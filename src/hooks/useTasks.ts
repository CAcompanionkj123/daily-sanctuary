import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function useDayTasks(dateKey: string) {
  return useQuery({
    queryKey: ["tasks", "day", dateKey],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_date", dateKey)
        .order("position")
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllTasks() {
  return useQuery({
    queryKey: ["tasks", "all"],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("task_date")
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTaskMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["tasks"] });
    qc.invalidateQueries({ queryKey: ["calendar"] });
  };

  const create = useMutation({
    mutationFn: async (task: Omit<TaskInsert, "user_id">) => {
      const user_id = await uid();
      const { data, error } = await supabase.from("tasks").insert({ ...task, user_id }).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TaskUpdate }) => {
      const { data, error } = await supabase.from("tasks").update(patch).eq("id", id).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async (task: Task) => {
      const completed = !task.completed;
      const { data, error } = await supabase
        .from("tasks")
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", task.id)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const moveToDate = useMutation({
    mutationFn: async ({ ids, dateKey }: { ids: string[]; dateKey: string }) => {
      if (!ids.length) return;
      const { error } = await supabase.from("tasks").update({ task_date: dateKey }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, toggle, remove, moveToDate };
}

/** Unfinished tasks dated before the given day. */
export function useCarryOver(dateKey: string) {
  return useQuery({
    queryKey: ["tasks", "carryover", dateKey],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("completed", false)
        .lt("task_date", dateKey)
        .order("task_date", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });
}
