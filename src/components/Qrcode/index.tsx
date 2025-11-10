import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import QrCodeIcon from "./qrcode.svg?component";
import styles from "./styles.module.scss";
// import SvgIcon from "../SvgIcon";
import InteImage from "../InteImage";
import classNames from "classnames";
import Tooltip from "../Tooltip";
import { useTranslation } from "react-i18next";
// import QrCodeIcon from "../icons/qrcode";

// TODO: add address verification
// network type
// joyID
const Qrcode = ({ text, size }: { text: string; size?: number }) => {
  const { t }  = useTranslation();
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = qrRef.current;
    if (!cvs || !text) return;
    QRCode.toCanvas(
      cvs,
      text,
      {
        margin: 5,
        errorCorrectionLevel: "H",
        width: 144,
      },
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
  }, [qrRef, text]);

  return (
    <div className={classNames("p-1 cursor-pointer", styles.container)}>
      <label htmlFor="address-qr">
        <Tooltip
          trigger={
            <div className="items-center justify-center p-1 cursor-pointer rounded-[2px] hover:bg-[#edf2f2] dark:hover:bg-[#ffffff1a] hover:text-primary">
              <QrCodeIcon width={20} height={20} />
            </div>
          }
        >
          {t("common.qrcode")}
        </Tooltip>
      </label>
      <input id="address-qr" />
      <canvas ref={qrRef} className={styles.qrcode} />
    </div>
  );
};

export default Qrcode;
