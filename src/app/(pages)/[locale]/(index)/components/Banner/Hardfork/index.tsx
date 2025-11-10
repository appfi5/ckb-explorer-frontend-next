import Link from "next/link";
import SquareBackground from "@/components/SquareBackground";
import { HARDFORK_ESTIMATED_ACTIVATION_TIME } from "@/constants/common";
import Cube from "./3d_cube.png";
import styles from "./index.module.scss";
import InteImage from "@/components/InteImage";

const HardforkBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <SquareBackground
          speed={0.1}
          squareSize={24}
          direction="down" // up, down, left, right, diagonal
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>
            <Link href="/hardfork">Hardfork is activated!</Link>
          </h1>
          <div className={styles.epoch}>
            <span>
              {HARDFORK_ESTIMATED_ACTIVATION_TIME.epoch.toLocaleString("en")}
            </span>
            <span>Epoch Number</span>
          </div>
        </div>
        <div className={styles.illustration}>
          <InteImage src={Cube} alt="3d cube" />
          <div className={styles.annotation}>
            <Link href="/hardfork#syscall">VM Syscalls 3</Link>
            <Link href="/hardfork#ckb-vm-2">CKB-VM V2</Link>
            <Link href="/hardfork#data-structure">Data Structure</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardforkBanner;
