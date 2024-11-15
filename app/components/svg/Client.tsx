"use client";

import { useEffect, useRef, useState } from "react";

function useTransform(
  svg: string,
  vectorizeNestedSVGs: boolean,
  linkImageHrefs: boolean,
  groupChildren: boolean
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

      const maskGroups: Map<Element, SVGGElement> = new Map();

      for (const [mask, elements] of groups) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = mask.id;

        const isTextGroup =
          elements.length > 0 &&
          elements.every((element) => element.localName === "text");

        if (elements.length === 0 || isTextGroup) {
          const children = svgElement.querySelectorAll(
            `[id^=${mask.id}]:not([id=${mask.id}])`
          );

          for (const child of children) {
            if (isTextGroup) {
              maskGroups.set(child, g);
            }

            g.appendChild(child);
          }
        }

        g.append(...elements);

        if (g.children.length > 0) {
          mask.insertAdjacentElement("afterend", g);
        }

        mask.remove();
      }

      for (const [mask, group] of maskGroups) {
        const childGroup = svgElement.getElementById(mask.id);
        group.append(...childGroup.children);
        group.removeChild(childGroup);
      }

      const richTextGroups = new Set(maskGroups.values());

      for (const image of images) {
        image.removeAttribute("mask");
      }

      const textGroups = svgElement.querySelectorAll<SVGGElement>(
        "g:not(:has(> :not(text)))"
      );

      for (const textGroup of textGroups) {
        // TODO: handle rich text groups in a more appropriate manner, instead of skipping grouping
        if (textGroup.children.length === 1 || richTextGroups.has(textGroup)) {
          continue;
        }

        const lines: Map<string, Array<Element>> = new Map();
        for (const text of textGroup.children) {
          const y = text.getAttribute("y");
          if (y === null) {
            console.log("Text element is missing y attribute", text);
            continue;
          }

          if (lines.has(y)) {
            lines.get(y)!.push(text);
          } else {
            lines.set(y, [text]);
          }
        }

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = textGroup.id;

        for (const [y, texts] of lines) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("y", y);

          let x: number | null = null;
          let width = 0;

          for (const t of texts) {
            if (t.textContent === null) {
              continue;
            }

            text.textContent += t.textContent;

            for (const { name, value } of t.attributes) {
              if (name === "x") {
                if (x === null || +value < x) {
                  x = +value;
                }

                continue;
              }

              if (name === "width") {
                width += +value;
                continue;
              }

              if (!text.hasAttribute(name)) {
                text.setAttribute(name, value);
              }
            }
          }

          text.setAttribute("width", String(width));
          text.setAttribute("x", String(x));

          g.appendChild(text);
        }

        textGroup.replaceWith(g);
      }

      svgElement.append(...other);
    }

    setResult(svgElement.outerHTML);
  }, [svg, vectorizeNestedSVGs, linkImageHrefs, groupChildren]);

  return result;
}

export default function Client({
  svg,
  id,
  options,
}: {
  svg: string;
  id?: string;
  options: {
    vectorizeNestedSVGs: boolean;
    linkImageHrefs: boolean;
    groupChildren: boolean;
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
