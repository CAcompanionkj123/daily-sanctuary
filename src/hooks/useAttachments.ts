import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Attachment } from "./useDiary";

const BUCKET = "diary-media";

export function useAttachments(entryId: string | null | undefined) {
  return useQuery({
    queryKey: ["attachments", entryId],
    enabled: !!entryId,
    queryFn: async (): Promise<(Attachment & { url: string | null })[]> => {
      const { data, error } = await supabase
        .from("entry_attachments")
        .select("*")
        .eq("entry_id", entryId!)
        .order("created_at");
      if (error) throw error;
      const rows = data ?? [];
      const signed = await Promise.all(
        rows.map(async (row) => {
          const { data: s } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(row.file_path, 60 * 60);
          return { ...row, url: s?.signedUrl ?? null };
        }),
      );
      return signed;
    },
  });
}

export function useAttachmentMutations(entryId: string | null | undefined) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["attachments", entryId] });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      if (!entryId) throw new Error("Write something first so this page can be saved.");
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) throw new Error("Not signed in");
      const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
      const path = `${uid}/${entryId}/${crypto.randomUUID()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { error } = await supabase.from("entry_attachments").insert({
        entry_id: entryId,
        user_id: uid,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        file_type: file.type || "application/octet-stream",
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (row: Attachment) => {
      await supabase.storage.from(BUCKET).remove([row.file_path]);
      const { error } = await supabase.from("entry_attachments").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { upload, remove };
}
