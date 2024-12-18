import { readFileSync } from "fs";
import type { Font } from "satori";

const FranklinITCStdBold = readFileSync(
  "./app/fonts/franklin/FranklinITCStd-Bold.otf"
);
const FranklinITCStdBoldItalic = readFileSync(
  "./app/fonts/franklin/FranklinITCStd-BoldItalic.otf"
);
const FranklinITCStdLight = readFileSync(
  "./app/fonts/franklin/FranklinITCStd-Light.otf"
);
const FranklinITCStdLightItalic = readFileSync(
  "./app/fonts/franklin/FranklinITCStd-LightItalic.otf"
);
const PostoniBold = readFileSync("./app/fonts/postoni/Postoni-Bold.otf");
const PostoniBoldItalic = readFileSync(
  "./app/fonts/postoni/Postoni-BoldItalic.otf"
);
const PostoniLight = readFileSync("./app/fonts/postoni/Postoni-Light.otf");
const PostoniLightItalic = readFileSync(
  "./app/fonts/postoni/Postoni-LightItalic.otf"
);

const fonts: Array<Font> = [
  {
    name: "Franklin",
    data: FranklinITCStdBold,
    weight: 800,
    style: "normal",
  },
  {
    name: "Franklin",
    data: FranklinITCStdBoldItalic,
    weight: 800,
    style: "italic",
  },
  {
    name: "Franklin",
    data: FranklinITCStdLight,
    weight: 400,
    style: "normal",
  },
  {
    name: "Franklin",
    data: FranklinITCStdLightItalic,
    weight: 400,
    style: "italic",
  },

  {
    name: "Postoni",
    data: PostoniBold,
    weight: 800,
    style: "normal",
  },
  {
    name: "Postoni",
    data: PostoniBoldItalic,
    weight: 800,
    style: "italic",
  },
  {
    name: "Postoni",
    data: PostoniLight,
    weight: 400,
    style: "normal",
  },
  {
    name: "Postoni",
    data: PostoniLightItalic,
    weight: 400,
    style: "italic",
  },
];

export default fonts;
