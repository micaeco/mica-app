import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderCircle size={64} className="animate-spin" />
    </div>
  );
}
