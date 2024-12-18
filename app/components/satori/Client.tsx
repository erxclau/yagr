"use client";

import { useEffect, useRef, useState } from "react";
import { writeSvg, writePng } from "./actions";
import Button from "./Button";

function transform(
  svg: string,
  vectorizeNestedSVGs: boolean,
  linkImageHrefs: boolean,
  groupChildren: boolean
) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svg, "image/svg+xml");

  const svgElement = document.querySelector("svg");
  if (svgElement === null) {
    return svg;
  }

  const images = svgElement.querySelectorAll("image");

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

  const patterns = svgElement.querySelectorAll("pattern");
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

    for (const image of images) {
      image.removeAttribute("mask");
    }

    const textGroups = svgElement.querySelectorAll<SVGGElement>(
      "g:not(:has(> :not(text)))"
    );

    for (const textGroup of textGroups) {
      if (textGroup.children.length === 1) {
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
        const textAttributes: Map<string, string> = new Map();
        let span: SVGTSpanElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );

        for (const t of texts) {
          if (t.textContent === null) {
            continue;
          }

          let shouldCreateNewSpan = false;
          const spanAttributes: Set<string> = new Set();
          for (const { name, value } of t.attributes) {
            if (name === "x") {
              if (x === null || +value < x) {
                x = +value;
              }

              continue;
            }

            if (name === "width") {
              continue;
            }

            if (textAttributes.get(name) !== value) {
              shouldCreateNewSpan = true;
            }

            spanAttributes.add(name);
            textAttributes.set(name, value);
          }

          if (shouldCreateNewSpan) {
            if (text.children.length > 0) {
              span = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "tspan"
              );

              span.append(" ");
            }

            for (const name of spanAttributes) {
              span.setAttribute(name, textAttributes.get(name) ?? "");
            }

            text.appendChild(span);
          }

          span.append(t.textContent);
        }

        text.setAttribute("x", String(x));

        if (text.children.length === 1) {
          for (const { name, value } of span.attributes) {
            text.setAttribute(name, value);
          }

          const spanTextContent = span.textContent;
          text.removeChild(span);
          text.textContent = spanTextContent;
        } else {
          for (const [name, value] of textAttributes) {
            let common = true;

            for (const span of text.children) {
              if (span.getAttribute(name) !== value) {
                common = false;
                break;
              }
            }

            if (common) {
              for (const span of text.children) {
                span.removeAttribute(name);
              }

              text.setAttribute(name, value);
            }
          }
        }

        g.appendChild(text);
      }

      textGroup.replaceWith(g);
    }

    svgElement.append(...other);
  }

  return svgElement.outerHTML;
}

function useTransform(
  svg: string,
  vectorizeNestedSVGs: boolean,
  linkImageHrefs: boolean,
  groupChildren: boolean
) {
  const [result, setResult] = useState(svg);

  useEffect(() => {
    const transformation = transform(
      svg,
      vectorizeNestedSVGs,
      linkImageHrefs,
      groupChildren
    );
    setResult(transformation);
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

  const figure = useRef<HTMLElement>(null);

  return (
    <figure ref={figure} className="flex flex-col gap-3">
      <menu className="flex gap-2">
        <li>
          <Button
            onClick={async () => {
              if (figure.current === null) {
                return;
              }

              const svg = figure.current.querySelector("svg");
              if (svg === null) {
                return;
              }

              await writeSvg(svg.outerHTML, id);
            }}
          >
            Download SVG
          </Button>
        </li>
        <li>
          <Button
            onClick={async () => {
              const transformation = transform(
                svg,
                options.vectorizeNestedSVGs,
                false,
                options.groupChildren
              );

              await writePng(transformation, id);
            }}
          >
            Download PNG
          </Button>
        </li>
      </menu>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
