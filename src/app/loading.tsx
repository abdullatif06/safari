import { SunMark } from "@/components/Logo";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <SunMark className="h-12 w-12 animate-spin [animation-duration:2.2s]" />
    </div>
  );
}
