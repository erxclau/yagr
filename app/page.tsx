import { readFileSync } from "node:fs";

import { wpdsColors as colors } from "@/tailwind.config";

import Headline from "./components/Headline";
import Paragraph from "./components/Paragraph";

import Satori from "./components/satori/Server";
import Graphic from "./components/Graphic";

const imageSrc =
  "data:image/png;base64," +
  Buffer.from(readFileSync("./app/img/blank.png")).toString("base64");

const sizes = {
  xxsmall: 304,
  xsmall: 384,
  medium: 640,
  xlarge: 960,
} as const;

const width = sizes.medium;

const graphic = (
  <Graphic
    headline="Graphic Headline"
    description="Graphic Description"
    note="Note: Graphic note"
    source="Source: Eric Lau"
    byline="ERIC LAU/THE WASHINGTON POST"
  >
    <div tw="flex flex-wrap w-full font-franklin text-2xl">
      This group contains a sentence with enough words to wrap to two lines.
    </div>
    <div tw="flex flex-wrap w-full font-franklin text-2xl">
      This group contains <span tw="text-wpds-blue100">blue text</span> and{" "}
      <span>
        <b>bold</b>{" "}
        <b>
          <i>italics</i>
        </b>
      </span>{" "}
      in a sentence.
    </div>
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" tw="rounded-full" src={imageSrc} width={80} height={80} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
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

export default async function Page() {
  return (
    <main
      className="mx-auto my-0 w-full flex flex-col gap-4"
      style={{ maxWidth: width }}
    >
      <Headline>yagr</Headline>

      <Paragraph>Yet another graphics rig.</Paragraph>
      <div className="flex flex-col gap-8">
        <Satori id="medium" options={{ width: sizes.medium }}>
          {graphic}
        </Satori>
      </div>
    </main>
  );
}
