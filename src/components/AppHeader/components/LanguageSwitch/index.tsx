import PixelBorderBlock from "@/components/PixelBorderBlock";
import EnIcon from './lan.en.svg?component';
import CnIcon from './lan.zh.svg?component';
import { useChangeLanguage, useCurrentLanguage } from "@/utils/i18n";



export default function LanguageSwitch() {
  const currentLanguage = useCurrentLanguage();
  const { changeLanguage } = useChangeLanguage();
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    changeLanguage(newLanguage);
  };
  return (
    <PixelBorderBlock
      onClick={toggleLanguage}
      apperanceClassName="*:data-[slot=border]:bg-[#4d4d4d] hover:*:data-[slot=bg]:bg-[#ffffff14]"
      className="cursor-pointer"
      contentClassName="p-[3px]"
    >
      {currentLanguage === 'zh' ? <CnIcon /> : <EnIcon />}
    </PixelBorderBlock>
  )
}