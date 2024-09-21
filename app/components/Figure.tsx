"use client";

import { useEffect, useRef, useState } from "react";

export default function Figure({ id, svg }: { id?: string; svg: string }) {
  const [vector, setVector] = useState(svg);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const parser = new DOMParser();
    const document = parser.parseFromString(svg, "image/svg+xml");

    const svgElement = document.querySelector("svg");
    if (svgElement === null) {
      return;
    }

    const prefix = "data:image/svg+xml;utf8,";

    const images = svgElement.querySelectorAll(`image[href^="${prefix}"]`);

    images.forEach((image) => {
      const href = image.getAttribute("href");
      if (href === null) {
        return;
      }

      const data = decodeURI(href);
      const svgString = data.slice(data.indexOf(prefix) + prefix.length);

      const replacementDocument = parser.parseFromString(
        svgString,
        "image/svg+xml"
      );
      const replacementSvg = replacementDocument.querySelector("svg");

      if (replacementSvg === null) {
        return;
      }

      for (let i = 0; i < image.attributes.length; i++) {
        const attribute = image.attributes.item(i);
        if (
          attribute === null ||
          attribute.name === "href" ||
          attribute.name === "mask" ||
          attribute.name === "clip-path"
        ) {
          continue;
        }

        replacementSvg.setAttribute(attribute.name, attribute.value);
      }

      image.replaceWith(replacementSvg);
    });

    setVector(svgElement.outerHTML);
  }, [svg]);

  return (
    <figure ref={ref} id={id} className="flex flex-col gap-1">
      <button
        onClick={() => {
          if (ref.current === null) {
            return;
          }

          const svg = ref.current.querySelector("svg");
          if (svg === null) {
            return;
          }

          const a = document.createElement("a");
          const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
          a.href = URL.createObjectURL(blob);
          a.download =
            "graphic" +
            (ref.current.id ? "-" + ref.current.id + "-" : "-") +
            new Date().toISOString() +
            ".svg";
          a.click();
          a.remove();
        }}
        className="outline w-fit p-1 focus:bg-slate-50 hover:bg-slate-50"
      >
        Download SVG
      </button>
      <div dangerouslySetInnerHTML={{ __html: vector }} />
    </figure>
  );
}
