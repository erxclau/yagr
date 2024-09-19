import type { ReactNode } from "react";

export default function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="font-georgia text-lg">
      {children ??
        `Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
      cupiditate, pariatur obcaecati, laboriosam voluptatibus architecto nemo
      adipisci vitae id, eius repellat iusto vel similique et. Natus quos totam
      quisquam dolorum?`}
    </p>
  );
}
