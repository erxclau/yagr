import satori from "satori";

import fonts from "./fonts";
import Paragraph from "./components/Paragraph";
import Headline from "./components/Headline";
import Figure from "./components/Figure";
import Graphic from "./components/Graphic";

export default async function Page() {
  const width = 640;

  const svg = await satori(
    <Graphic
      width={width}
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
            fill="steelblue"
            key={d}
          ></rect>
        ))}
      </svg>

      <div tw="flex flex-col" style={{ gap: "0.25rem" }}>
        {[100, 200, 300].map((d) => (
          <div
            style={{ width: d, height: 25, backgroundColor: "steelblue" }}
            key={d}
          ></div>
        ))}
      </div>

      <div tw="flex" style={{ gap: "0.25rem" }}>
        {[100, 200, 300].map((d) => (
          <div
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              backgroundColor: "steelblue",
            }}
            key={d}
          ></div>
        ))}
      </div>
    </Graphic>,
    {
      width,
      fonts,
      embedFont: false,
      tailwindConfig: {
        theme: {
          extend: {
            fontFamily: {
              franklin: ["Franklin"],
              postoni: ["Postoni"],
              georgia: ["Georgia"],
            },
          },
        },
      },
    }
  );

  return (
    <main className="max-w-[640px] mx-auto my-0 w-full flex flex-col gap-4">
      <Headline />
      <div className="flex flex-col gap-2">
        <Paragraph />
        <Figure svg={svg} />
        <Paragraph />
      </div>
    </main>
  );
}
