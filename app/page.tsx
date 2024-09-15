import satori from "satori";

import fonts from "./fonts";

export default async function Page() {
  const width = 640;
  // const height = 400;

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
      // height,
      fonts,
      // embedFont: false,
      // debug: true,
      onNodeDetected(node) {
        console.log(node);
      },
    }
  );

  return (
    <main className="max-w-[640px] mx-auto my-0 w-full flex flex-col gap-4">
      <h1 className="font-postoni text-4xl font-bold">Story headline</h1>
      <div className="flex flex-col gap-2">
        <p className="font-georgia text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
          cupiditate, pariatur obcaecati, laboriosam voluptatibus architecto
          nemo adipisci vitae id, eius repellat iusto vel similique et. Natus
          quos totam quisquam dolorum?
        </p>
        <figure dangerouslySetInnerHTML={{ __html: svg }}></figure>
        <p className="font-georgia text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
          cupiditate, pariatur obcaecati, laboriosam voluptatibus architecto
          nemo adipisci vitae id, eius repellat iusto vel similique et. Natus
          quos totam quisquam dolorum?
        </p>
        <svg width={100} height={100}>
          <rect width={100} height={25} fill="blue"></rect>
          <svg width={50} height={40}>
            <rect width={10} height={10} fill="red"></rect>
          </svg>
        </svg>
      </div>
    </main>
  );
}
