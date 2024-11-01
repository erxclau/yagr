import type { ReactNode } from "react";
import satori from "satori";

import fonts from "@/app/fonts";
import { wpdsColors } from "@/tailwind.config";

export default async function stringify(
  node: ReactNode,
  width: number,
  debug = false
) {
  return await satori(node, {
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
}
