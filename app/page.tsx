import { readFileSync } from "node:fs";

import { wpdsColors as colors } from "@/tailwind.config";

import Headline from "./components/Headline";
import Paragraph from "./components/Paragraph";

import Figure from "./components/Figure";
import Graphic from "./components/Graphic";
import stringify from "./stringify";

const imageSrc =
  "data:image/png;base64," +
  Buffer.from(readFileSync("./app/img/blank.png")).toString("base64");

const width = 640;

const graphic = (
  <Graphic
    headline="Graphic Headline"
    description="Graphic Description"
    note="Note: Graphic note"
    source="Source: Eric Lau"
    byline="ERIC LAU/THE WASHINGTON POST"
  >
    <svg width={width} height={75} viewBox={`0 0 ${width} 75`}>
      {[100, 200, 300].map((d, i) => (
        <rect
          x={0}
          height={25}
          width={d}
          y={i * 25}
          fill={colors["wpds-blue200"]}
          key={d}
        ></rect>
      ))}
    </svg>

    <div tw="w-20 h-20 flex" style={{ gap: "1rem" }}>
      <img alt="" tw="rounded-full" src={imageSrc} width={80} height={80} />
      <img alt="" src={imageSrc} width={80} height={80} />
    </div>

    <div tw="flex" style={{ gap: "1rem" }}>
      <div
        tw="w-10 h-10 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors["wpds-blue200"]} 0%, ${colors["wpds-blue200"]} 50%, ${colors["wpds-blue400"]} 50%, ${colors["wpds-blue400"]} 100%)`,
        }}
      />

      <div
        tw="w-10 h-10 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors["wpds-red200"]} 0%, ${colors["wpds-red200"]} 50%, ${colors["wpds-red400"]} 50%, ${colors["wpds-red400"]} 100%)`,
        }}
      />
    </div>

    <div tw="flex flex-col" style={{ gap: "0.25rem" }}>
      {[100, 200, 300].map((d) => (
        <div
          tw="bg-wpds-blue100"
          style={{ width: d, height: 25 }}
          key={d}
        ></div>
      ))}
    </div>

    <div tw="flex flex-wrap" style={{ gap: "0.25rem" }}>
      {Array.from({ length: 5 }, (_, i) => i).map((d) => (
        <div
          tw="bg-wpds-blue400"
          style={{
            width: 25,
            height: 25,
            borderRadius: "50%",
          }}
          key={d}
        ></div>
      ))}
    </div>
  </Graphic>
);

const svg = await stringify(graphic, width);

export default async function Page() {
  return (
    <main className="max-w-[640px] mx-auto my-0 w-full flex flex-col gap-4">
      <Headline>yagr-next</Headline>
      <Paragraph>Yet another graphics rig with Next.js.</Paragraph>
      <Figure svg={svg} />
    </main>
  );
}
