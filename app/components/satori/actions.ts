"use server";

import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import { renderAsync } from "@resvg/resvg-js";

export async function write(
  buffer: Buffer,
  id: string | undefined,
  extension: "svg" | "png"
) {
  const fileName =
    "graphic" +
    (id ? "-" + id + "-" : "-") +
    new Date().toISOString() +
    "." +
    extension;

  if (!existsSync("./.yagr")) {
    mkdirSync("./.yagr");
  }

  await writeFile(`./.yagr/${fileName}`, buffer);
}

export async function writeSvg(svg: string, id: string | undefined) {
	await write(Buffer.from(svg), id, "svg");
}

export async function writePng(svg: string, id: string | undefined) {
  const image = await renderAsync(svg, {
    background: "white",
  });
  const buffer = image.asPng();
  await write(buffer, id, "png");
}
