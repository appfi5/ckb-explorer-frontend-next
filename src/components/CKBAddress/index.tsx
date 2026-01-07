import TextEllipsis, { type TextEllipsisProps } from "../TextEllipsis";
import useDASAccount from "@/hooks/useDASAccount";
import DIDAccountIcon from "@/assets/icons/das_account.png"
import { cn } from "@/lib/utils";
import Image from "next/image";


type CKBAddressProps = {
  className?: string;
  address: string;
  ellipsis: TextEllipsisProps['ellipsis'];
  didIconSize?: string;
};

export default function CKBAddress(props: CKBAddressProps) {
  const { className, address, ellipsis, didIconSize = "size-6" } = props;
  const dasAccount = useDASAccount(address);

  if (dasAccount) {
    return (
      <div className={cn(className, "flex flex-row items-center gap-1.5")}>
        <Image className={didIconSize} src={DIDAccountIcon} alt="" />
        <TextEllipsis
          className={className}
          text={dasAccount}
          tooltipText={address}
          ellipsis={ellipsis}
        />
      </div>

    )
  }

  return (
    <TextEllipsis
      className={className}
      text={address}
      ellipsis={ellipsis}
    />
  )
}
