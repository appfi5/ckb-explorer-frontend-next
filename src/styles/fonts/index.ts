import localFont from "next/font/local"
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
  geist
}


export default fonts