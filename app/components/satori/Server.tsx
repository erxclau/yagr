import type { ReactNode } from "react";
import satori, { type SatoriOptions } from "satori";

import Client from "./Client";
import fonts from "@/app/fonts/index";
import { wpdsColors } from "@/tailwind.config";

const defaultSatoriOptions = {
  fonts,
  embedFont: false,
  debug: false,
  tailwindConfig: {
    theme: {
      extend: {
        colors: wpdsColors,
        fontFamily: {
          franklin: ["Franklin"],
          postoni: ["Postoni"],
        },
      },
    },
  },
};

export default async function Server({
  children,
  options,
  id = undefined,
  vectorizeNestedSVGs = true,
  linkImageHrefs = true,
  groupChildren = true,
}: {
  children: ReactNode;
  options: Partial<SatoriOptions> & { width: number };
  id?: string;
  vectorizeNestedSVGs?: boolean;
  linkImageHrefs?: boolean;
  groupChildren?: boolean;
}) {
  const svg = await satori(children, { ...defaultSatoriOptions, ...options });
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono">
        <div>width: {options.width}px</div>
        {id === undefined ? null : <div>id: {id}</div>}
      </div>

      <Client
        id={id}
        svg={svg}
        options={{
          vectorizeNestedSVGs,
          linkImageHrefs,
          groupChildren,
        }}
      />
    </div>
  );
}
