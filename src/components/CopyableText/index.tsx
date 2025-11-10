import { type FC } from "react";
import { useTranslation } from "react-i18next";
import CopyIcon from '@/assets/icons/copy.svg?component';
// import { useSetToast } from "../Toast";
// import InteImage from "../InteImage";
import { toast } from "sonner";
import IconBox from "../IconBox";
import Tooltip from "../Tooltip";

const CopyableText: FC<{
  children: string;
}> = ({ children: text }) => {
  const { t } = useTranslation();
  // const setToast = useSetToast();

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { detail } = e.currentTarget.dataset;
    if (!detail) return;
    navigator.clipboard.writeText(detail).then(() => {
      // setToast({ message: t("common.copied") });
      toast.success(t("common.copied"));
    });
  };

  const content = (
    <>
      {text}

      <button
        type="button"
        className="ml-1 appearance-nonenone translate-y-0.5"
        // className={styles.copy}
        onClick={handleCopy}
        data-detail={text}
      >
        {/* <CopyIcon width="100%" height="100%" /> */}
        <Tooltip
          trigger={
            <IconBox>
              <CopyIcon width={14} height={14} />
            </IconBox>
          }
        >
          {t("common.copy")}
        </Tooltip>
      </button>
    </>
  );

  return content;
};

export default CopyableText;
