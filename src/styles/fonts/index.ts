import localFont from "next/font/local"
import { Noto_Sans_SC, Roboto } from "next/font/google";

// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

const roboto = Roboto({
  weight: ['400', '500', '700'], // Specify the desired weights for Roboto
  subsets: ['latin'],    // Specify the desired subsets
  display: 'swap',       // Optional: use 'swap' for better font loading behavior
  // fallback: ['Arial', 'sans-serif'], // Define Arial and a generic sans-serif as fallbacks
  variable: "--font-roboto",
});

// noto sans chinese only
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  // subsets: ["latin", "cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin-ext", "vietnamese"],
  variable: "--font-noto-sans-sc",
  // uni
});

const menlo = localFont({
  src: "./Menlo-Regular.ttf",
  display: "swap",
  variable: "--font-menlo",
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
  roboto,
  notoSansSC,
  menlo,
  // pixer,
  // sourceCodePro,
  // inputSans,
  // geist
}


export default fonts