import type { ReactNode } from "react";
import satori from "satori";

import fonts from "@/app/fonts";
import { wpdsColors } from "@/tailwind.config";

import Client from "./Client";

export default async function Server({
  children,
  width,
  id = undefined,
  debug = false,
  options = {
    vectorizeNestedSVGs: true,
    linkImageHrefs: true,
    groupChildren: true,
  },
}: {
  children: ReactNode;
  width: number;
  id?: string;
  debug?: boolean;
  options?: {
    vectorizeNestedSVGs?: boolean;
    linkImageHrefs?: boolean;
    groupChildren?: boolean;
  };
}) {
  const svg = await satori(children, {
    width,
    fonts,
    debug,
    embedFont: false,
    tailwindConfig: {
      theme: {
        extend: {
          colors: wpdsColors,
          fontFamily: {
            franklin: ["Franklin"],
            postoni: ["Postoni"],
            georgia: ["Georgia"],
          },
        },
      },
    },
  });

  return (
    <Client
      svg={svg}
      id={id}
      options={{
        vectorizeNestedSVGs: true,
        linkImageHrefs: true,
        groupChildren: true,
        ...options,
      }}
    />
  );
}
