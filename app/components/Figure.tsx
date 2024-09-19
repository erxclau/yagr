"use client";

import { useEffect, useState } from "react";

export default function Figure({ svg }: { svg: string }) {
  const [vector, setVector] = useState(svg);

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

  return <figure dangerouslySetInnerHTML={{ __html: vector }} />;
}
