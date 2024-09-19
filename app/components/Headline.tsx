import type { ReactNode } from "react";

export default function Headline({ children }: { children?: ReactNode }) {
  return (
    <h1 className="font-postoni text-4xl font-bold">
      {children ?? `Story headline`}
    </h1>
  );
}
