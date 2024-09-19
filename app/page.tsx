import satori from "satori";

import fonts from "./fonts";
import Paragraph from "./components/Paragraph";
import Headline from "./components/Headline";

export default async function Page() {
  const width = 640;

  const svg = await satori(
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontFamily: "var(--font-franklin)",
                fontWeight: "bold",
                fontSize: 20,
                lineHeight: "22px",
              }}
            >
              Headline
            </div>
            <div
              style={{
                fontFamily: "var(--font-franklin)",
                fontSize: 16,
                lineHeight: "20px",
              }}
            >
              Description
            </div>
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {[100, 200, 300].map((d) => (
              <div
                style={{ width: d, height: 25, backgroundColor: "steelblue" }}
                key={d}
              ></div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.25rem" }}>
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
        <div
          style={{
            fontFamily: "var(--font-franklin)",
            fontSize: 16,
            lineHeight: "20px",
          }}
        >
          Note
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: width,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-franklin)",
            fontSize: 14,
            lineHeight: "16px",
          }}
        >
          Source: Me
        </div>
        <div
          style={{
            fontFamily: "var(--font-franklin)",
            fontSize: 14,
            lineHeight: "16px",
          }}
        >
          ERIC LAU/THE WASHINGTON POST
        </div>
      </div>
    </div>,
    {
      width,
      fonts,
      embedFont: false,
      // debug: true,
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
