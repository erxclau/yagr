import type { ReactNode } from "react";
import satori, { type SatoriOptions } from "satori";

import Client from "./Client";

export default async function Server({
  children,
  options,
  id = undefined,
  vectorizeNestedSVGs = true,
  linkImageHrefs = true,
  groupChildren = true,
}: {
  children: ReactNode;
  options: SatoriOptions;
  id?: string;
  vectorizeNestedSVGs?: boolean;
  linkImageHrefs?: boolean;
  groupChildren?: boolean;
}) {
  const svg = await satori(children, options);
  return (
    <Client
      svg={svg}
      id={id}
      options={{
        vectorizeNestedSVGs,
        linkImageHrefs,
        groupChildren,
      }}
    />
  );
}
