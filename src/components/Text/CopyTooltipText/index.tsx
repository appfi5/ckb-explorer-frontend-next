import { useTranslation } from "react-i18next";
import SimpleButton from "../../SimpleButton";
import { useSetToast } from "../../Toast";
import { toast } from "sonner";

const CopyTooltipText = ({ content }: { content: string }) => {
  const setToast = useSetToast();
  const { t } = useTranslation();

  return (
    <SimpleButton
      id={`copy__content__${content}`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        navigator.clipboard.writeText(content).then(() => {
          // setToast({ message: t("common.copied") });
          toast.success(t("common.copied"));
        });
      }}
    >
      {content}
    </SimpleButton>
  );
};
export default CopyTooltipText;
