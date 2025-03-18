import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-primary backdrop-blur-3xl h-screen w-screen absolute flex items-center justify-center">
      <LoaderCircle className="w-12 h-12 animate-spin" />
    </div>
  );
}
