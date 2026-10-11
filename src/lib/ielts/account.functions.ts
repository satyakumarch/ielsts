import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = context.userId;
    for (const t of ["mistakes", "reading_attempts", "skill_scores", "study_tasks"] as const) {
      await supabaseAdmin.from(t).delete().eq("user_id", id);
    }
    await supabaseAdmin.from("profiles").delete().eq("id", id);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
