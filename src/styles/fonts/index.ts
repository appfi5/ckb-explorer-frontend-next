// import localFont from "next/font/local"
import { Noto_Sans_SC, Roboto, Source_Code_Pro } from "next/font/google";

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
  variable: "--font-noto-sans-sc",
});


const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-source-code-pro",
});



const fonts = {
  roboto,
  notoSansSC,
  sourceCodePro,
}


export default fonts