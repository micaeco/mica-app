import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";

export function EditProfilePanel({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="from-brand-secondary bg-gradient-to-b from-5% to-white to-45%"></SheetContent>
    </Sheet>
  );
}
