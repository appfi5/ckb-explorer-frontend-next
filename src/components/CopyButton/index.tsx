

import CopyIcon from '@/assets/icons/copy.svg?component';
import { useSetToast } from '../Toast';
import { useTranslation } from 'react-i18next';
import type { ComponentProps, SVGProps } from 'react';
import Tooltip from '../Tooltip';
import classNames from 'classnames';
import { toast } from 'sonner';

type CopyProps = ComponentProps<"div"> & {
  text: string;
}
export default function CopyButton(props: CopyProps) {
  const { text, className, ...divProps } = props;
  const { t } = useTranslation();
  const setToast = useSetToast();
  return (
    <Tooltip
      trigger={
        <div
          {...divProps}
          className={classNames("items-center justify-center p-1 cursor-pointer rounded-[2px] hover:bg-[#edf2f2] dark:hover:bg-[#ffffff1a] hover:text-primary", className)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(text).then(() => {
              // setToast({ message: t("common.copied") });
              toast.success(t("common.copied"))
            });
          }}
        >
          <div className="size-[16px] sm:size-[20px]">
            <CopyIcon width="100%" height="100%" />
          </div>
        </div>
      }
    >
      {t("common.copy")}
    </Tooltip>
  )
}