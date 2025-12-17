import { LoaderCircle } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderCircle size={64} className="animate-spin" />
    </div>
  );
}
