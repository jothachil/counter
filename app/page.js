import Image from "next/image";
import BarrelCounter from "./barrel-counter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <Image
        src="/flipkart-logo.png"
        alt="Flipkart"
        width={940}
        height={260}
        preload
        className="mb-6 h-auto w-[clamp(10rem,28vw,18rem)]"
      />
      <BarrelCounter />
      <p className="text-[clamp(1rem,2.5vw,1.75rem)] font-medium text-zinc-500">
        Onboarding
      </p>
    </main>
  );
}
