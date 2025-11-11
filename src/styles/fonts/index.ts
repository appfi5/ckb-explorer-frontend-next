import localFont from "next/font/local"
import { Geist,Source_Code_Pro } from "next/font/google";

// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

// const pixer = localFont({
//   src: "./Pixer-Regular.ttf",
//   display: "swap",
//   variable: "--font-pixer",
//   declarations:[{
//     prop: "ascent-override",
//     value: "80%"
//   }]
// })


const fonts = {
  // pixer,
  sourceCodePro,
  // inputSans,
  // geist
}


export default fonts