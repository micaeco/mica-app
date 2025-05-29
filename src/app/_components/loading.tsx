import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-screen w-full animate-spin items-center justify-center">
      <LoaderCircle size={64} />
    </div>
  );
}
