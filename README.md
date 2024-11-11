# yagr-next

`yagr-next` is yet another graphics rig built using Next and [`satori`](https://github.com/vercel/satori).

It is intended for creating flex layouts that can be consumed by Adobe Illustrator. Complex flex- or grid- like layouts can be difficult to create and maintain in SVG. `satori` solves for this by converting flex-based JSX to SVG. 

`satori` itself was not built for exporting to external software like Adobe Illustrator. `yagr-next` transforms `satori` SVG output for better compatibility with Illustrator. Notably, the following transforms are available:

- `vectorizeNestedSVGs` — By default, `satori` will convert nested SVGs into `image` elements. This rig retains the SVGs as vectors that can be manipulated in Illustrator.
- `linkImageHrefs` — By default, `satori` will use the `href` attribute on any `image` elements. Instead, use the `link:href` attribute which Illustrator uses to properly link image assets.
- `groupChildren` — Regroups exported SVG eqlements to more closely mirror the JSX input. May result in improper clipping or masking.
