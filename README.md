# yagr

`yagr` is yet another graphics rig, built using Next and [Satori](https://github.com/vercel/satori).

It is intended for creating flex layouts that can be consumed by Adobe Illustrator. Complex flex- or grid- like layouts can be difficult to create and maintain in SVG. Satori solves for this by converting flex-based JSX to SVG.

Satori itself was not built for exporting to external software like Adobe Illustrator. The rig transforms Satori SVG output for better compatibility with Illustrator. Notably, the following transforms are available:

- `vectorizeNestedSVGs` — By default, Satori converts nested SVGs into `image` elements. The rig retains the SVGs as vectors that can be manipulated in Illustrator.
- `linkImageHrefs` — By default, Satori uses the `href` attribute on `image` elements. Instead, the rig uses the `link:href` attribute which Illustrator uses to properly link image assets.
- `groupChildren` — Regroups exported SVG elements to more closely mirror the JSX input. May result in improper clipping, masking or text rendering.
