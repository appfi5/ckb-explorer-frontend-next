"use client"
import styles from './index.module.scss'
import Img404Balck from './404.black.png';
import Img404White from './404.white.png';
import Image from 'next/image'
import { useTheme } from '@/components/Theme';

export default function PageNotFound() {
  const [theme] = useTheme()
  return (
    <div className={styles.container}>
      {/* <InteImage className={styles.notFoundImage} src={get404Image(isMobile)} alt="404" /> */}
      <Image className={styles.img} src={theme === "dark" ? Img404White : Img404Balck} alt="404" />
    </div>
  )
}
