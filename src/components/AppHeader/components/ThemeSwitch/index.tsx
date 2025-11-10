import { useTheme } from "@/components/Theme";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import MoonIcon from './moon.svg?component';
import SunIcon from './sun.svg?component';



export default function ThemeSwitch() {
  const [theme, toggleTheme] = useTheme();
  return (
    <PixelBorderBlock
      onClick={toggleTheme}
      apperanceClassName="*:data-[slot=border]:bg-[#4d4d4d] hover:*:data-[slot=bg]:bg-[#ffffff14]"
      className="cursor-pointer"
      contentClassName="p-[3px]"
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </PixelBorderBlock>
  )
}