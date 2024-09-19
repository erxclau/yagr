import satori from "satori";

import fonts from "./fonts";
import Paragraph from "./components/Paragraph";
import Headline from "./components/Headline";

export default async function Page() {
  const width = 640;

  const svg = await satori(
    <div tw="flex flex-col" style={{ gap: 4 }}>
      <div tw="flex flex-col" style={{ gap: 20 }}>
        <div tw="flex flex-col" style={{ gap: 16 }}>
          <div tw="flex flex-col" style={{ gap: 8 }}>
            <div tw="font-franklin font-bold text-xl leading-[22px]">
              Headline
            </div>
            <div tw="font-franklin text-base leading-5">Description</div>
          </div>
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
        </div>
        <div tw="font-franklin text-base leading-5">Note</div>
      </div>
      <div
        tw="flex justify-between"
        style={{
          width: width,
        }}
      >
        <div tw="font-franklin text-sm leading-4">Source: Me</div>
        <div tw="font-franklin text-sm leading-4">
          ERIC LAU/THE WASHINGTON POST
        </div>
      </div>
    </div>,
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
        <figure dangerouslySetInnerHTML={{ __html: svg }} />
        <Paragraph />
      </div>
    </main>
  );
}
