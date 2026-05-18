import DesktopSidebar from "@/components/DesktopSidebar";
import MobileHeader from "@/components/MobileHeader";
import { MotionConfig } from "framer-motion";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isTeacher = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_teacher")
      .eq("id", user.id)
      .single();
    isTeacher = profile?.is_teacher ?? false;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen">
        {/* Desktop sidebar — visible on md+, Server Component safe */}
        <DesktopSidebar isTeacher={isTeacher} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile: top bar + drawer (Client Component for useState) */}
          <MobileHeader isTeacher={isTeacher} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
