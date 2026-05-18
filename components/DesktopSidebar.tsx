import SidebarContent from "@/components/SidebarContent";

interface DesktopSidebarProps {
  isTeacher?: boolean;
}

export default function DesktopSidebar({ isTeacher }: DesktopSidebarProps) {
  return (
    <div className="hidden md:flex w-64 min-h-screen flex-col shrink-0">
      <SidebarContent isTeacher={isTeacher} />
    </div>
  );
}
