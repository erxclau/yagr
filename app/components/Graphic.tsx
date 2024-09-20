import type { ReactNode } from "react";
// import { isValidElement } from "react";

export default function Graphic({
  width = 640,
  headline,
  description,
  note,
  source,
  byline,
  children,
}: {
  width?: number;
  headline?: ReactNode;
  description?: ReactNode;
  note?: ReactNode;
  source?: ReactNode;
  byline?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div tw="flex flex-col" style={{ gap: 4 }}>
      <div tw="flex flex-col" style={{ gap: 20 }}>
        <div tw="flex flex-col" style={{ gap: 16 }}>
          <div tw="flex flex-col" style={{ gap: 8 }}>
            <div tw="flex font-franklin font-bold text-xl leading-[22px]">
              {headline}
            </div>
            <div tw="flex font-franklin text-base leading-5">{description}</div>
          </div>
          {children}
        </div>
        <div tw="flex font-franklin text-base leading-5">{note}</div>
      </div>
      <div
        tw="flex justify-between"
        style={{
          width: width,
        }}
      >
        <div tw="flex font-franklin text-sm leading-4">{source}</div>
        <div tw="flex font-franklin text-sm leading-4">{byline}</div>
      </div>
    </div>
  );
}
