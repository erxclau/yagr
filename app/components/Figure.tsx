"use client";

import { useEffect, useRef, useState } from "react";

function useTransform(
  svg: string,
  vectorizeNestedSVGs = true,
  linkImageHrefs = true,
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

    const images = svgElement.getElementsByTagName("image");

    if (vectorizeNestedSVGs) {
      const prefix = "data:image/svg+xml;utf8,";

      for (const image of images) {
        const href = image.getAttribute("href");
        if (href === null || !href.startsWith(prefix)) {
          continue;
        }

        const data = decodeURI(href);
        const svgString = data.slice(data.indexOf(prefix) + prefix.length);

        const replacementDocument = parser.parseFromString(
          svgString,
          "image/svg+xml"
        );

        const replacementSvg = replacementDocument.querySelector("svg");

        if (replacementSvg === null) {
          continue;
        }

        for (const { name, value } of image.attributes) {
          if (name === "href" || name === "mask" || name === "clip-path") {
            continue;
          }

          replacementSvg.setAttribute(name, value);
        }

        image.replaceWith(replacementSvg);
      }
    }

    if (linkImageHrefs) {
      for (const image of images) {
        const href = image.getAttribute("href");
        if (href === null) {
          continue;
        }

        image.setAttribute("xlink:href", href);
        image.removeAttribute("href");
      }
    }

    const patterns = svgElement.getElementsByTagName("pattern");
    for (const pattern of patterns) {
      const linearGradient = pattern.querySelector("linearGradient");
      if (linearGradient === null) {
        continue;
      }

      const elements = svgElement.querySelectorAll(
        `[fill="url(#${pattern.id})"]`
      );

      for (const element of elements) {
        element.setAttribute("fill", `url(#${linearGradient.id})`);
      }
    }

    if (groupChildren) {
      let mask: Element | null = null;
      const groups: Map<Element, Array<Element>> = new Map();
      const other: Array<Element> = [];
      for (let i = 0; i < svgElement.children.length; i++) {
        const child = svgElement.children[i];
        if (child.localName === "mask") {
          mask = child;
          groups.set(child, []);
          continue;
        }

        if (child.localName === "clipPath" || child.localName === "defs") {
          child.remove();
          other.push(child);
          i -= 1;
          continue;
        }

        if (mask === null) {
          continue;
        }

        groups.get(mask)?.push(child);
      }

      for (const [mask, elements] of groups) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = mask.id;

        if (elements.length === 0) {
          const children = svgElement.querySelectorAll(`[id^=${mask.id}]`);
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

      for (const image of images) {
        image.removeAttribute("mask");
      }

      svgElement.append(...other);
    }

    setResult(svgElement.outerHTML);
  }, [svg, vectorizeNestedSVGs, linkImageHrefs, groupChildren]);

  return result;
}

export default function Figure({
  svg,
  id,
  options = {
    vectorizeNestedSVGs: true,
    linkImageHrefs: true,
    groupChildren: true,
  },
}: {
  svg: string;
  id?: string;
  options?: {
    vectorizeNestedSVGs?: boolean;
    linkImageHrefs?: boolean;
    groupChildren?: boolean;
  };
}) {
  const html = useTransform(
    svg,
    options.vectorizeNestedSVGs,
    options.linkImageHrefs,
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
            (id ? "-" + id + "-" : "-") +
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
