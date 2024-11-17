import { getArrow, type ArrowOptions } from "perfect-arrows";

export default function Arrow({
  x0,
  y0,
  x1,
  y1,
  head = undefined,
  options,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  head?: "start" | "control" | "end";
  options?: ArrowOptions;
}) {
  const [
    xStart,
    yStart,
    xControl,
    yControl,
    xEnd,
    yEnd,
    endHeadRadians,
    startHeadRadians,
    controlHeadRadians,
  ] = getArrow(x0, y0, x1, y1, options);

  const endHeadDegrees = endHeadRadians * (180 / Math.PI);
  const startHeadDegrees = startHeadRadians * (180 / Math.PI);
  const controlHeadDegrees = controlHeadRadians * (180 / Math.PI);

  const width =
    distance(
      Math.min(xStart, xControl, xEnd),
      Math.max(xStart, xControl, xEnd)
    ) +
    12 +
    Math.min(x0, x1);
  const height =
    distance(
      Math.min(yStart, yControl, yEnd),
      Math.max(yStart, yControl, yEnd)
    ) +
    12 +
    Math.min(y0, y1);

  let markerTransform: string | undefined = undefined;
  if (head === "start") {
    markerTransform = `translate(${xStart},${yStart}) rotate(${startHeadDegrees})`;
  } else if (head === "control") {
    markerTransform = `translate(${xControl},${yControl}) rotate(${controlHeadDegrees})`;
  } else if (head === "end") {
    markerTransform = `translate(${xEnd},${yEnd}) rotate(${endHeadDegrees})`;
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{
        position: "absolute",
        left: Math.min(x0, x1),
        top: Math.min(y0, y1),
      }}
    >
      <path
        d={`M${xStart},${yStart} Q${xControl},${yControl} ${xEnd},${yEnd}`}
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
      {head === undefined ? null : (
        <polygon
          points="0,-6 12,0, 0,6"
          transform={markerTransform}
          stroke="black"
          fill="black"
        />
      )}
    </svg>
  );
}

function distance(p0: number, p1: number) {
  return Math.abs(p0 - p1);
}
