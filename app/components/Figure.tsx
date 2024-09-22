"use client";

import { useEffect, useRef, useState } from "react";

function useTransform(
  svg: string,
  vectorizeNestedSVGs = true,
  groupChildren = true
) {
  const [result, setResult] = useState(svg);

  useEffect(() => {
    const parser = new DOMParser();
    const document = parser.parseFromString(svg, "image/svg+xml");

    const svgElement = document.querySelector("svg");
    if (svgElement === null) {
      return;
    }

    if (vectorizeNestedSVGs) {
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
    }

    if (groupChildren) {
      let mask: Element | null = null;
      const groups: Map<Element, Array<Element>> = new Map();
      for (let i = 0; i < svgElement.children.length; i++) {
        const child = svgElement.children[i];
        if (child.localName === "mask") {
          mask = child;
          groups.set(child, []);
          continue;
        }

        if (child.localName === "clipPath") {
          child.remove();
          i -= 1;
          continue;
        }

        if (mask === null) {
          continue;
        }

        groups.get(mask)?.push(child);
      }

      for (const [mask, elements] of groups) {
        const g = document.createElement("g");
        g.id = mask.id;
        g.setAttribute("xmlns", "http://www.w3.org/2000/svg")

        if (elements.length === 0) {
          const children = svgElement.querySelectorAll(`[id^=${mask.id}]`)
          for (const child of children) {
            if (child === mask) {
              continue;
            }

            g.appendChild(child);
          }
        } else {
          for (const element of elements) {
            g.appendChild(element);
          }
        }

        if (g.children.length > 0) {
          mask.insertAdjacentElement("afterend", g);
        }

        mask.remove();
      }
    }

    setResult(svgElement.outerHTML);
  }, [svg, vectorizeNestedSVGs, groupChildren]);

  return result;
}

export default function Figure({
  svg,
  id,
  options = { vectorizeNestedSVGs: true, groupChildren: true },
}: {
  svg: string;
  id?: string;
  options?: { vectorizeNestedSVGs?: boolean; groupChildren?: boolean };
}) {
  const html = useTransform(
    svg,
    options.vectorizeNestedSVGs,
    options.groupChildren
  );
  const ref = useRef<HTMLElement>(null);

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
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
