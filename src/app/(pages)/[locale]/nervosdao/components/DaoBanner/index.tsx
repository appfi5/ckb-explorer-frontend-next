import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import RewardCalcutorModal from '../RewardCalcutorModal'
import { NERVOS_DAO_RFC_URL } from '@/constants/common'
import styles from './DaoBanner.module.scss'
import PixelBorderBlock from "@/components/PixelBorderBlock"
import LinkSingle from '@/assets/icons/linkSingle.svg?component'
import { useIsMobile, useMediaQuery } from '@/hooks'
import { useCurrentLanguage } from '@/utils/i18n'

const LinkButtonContent = ({ name, isLinkHref, isShowModal }: { name: string, isLinkHref?: string, isShowModal?: (show: boolean) => void }) => {
  return (
    <div className={styles.btnStyle}>
      <PixelBorderBlock
        pixelSize="3px"
        apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] hover:*:data-[slot=border]:bg-primary hover:*:data-[slot=bg]:bg-[rgb(from_var(--color-primary)_r_g_b_/_20%)]"
        className="cursor-pointer h-[34px] inline-block"
        contentClassName="h-full flex items-center justify-left px-[8px] text-[14px] leading-[20px]"
      >
        <a href={isLinkHref} target="_blank" rel="noopener noreferrer" className='w-auto flex items-center justify-center gap-[9px]' onClick={() => isShowModal?.(true)}>
          <span className={styles.chartDesc}>{name}</span>
          {
            !!isLinkHref && <LinkSingle />
          }
        </a>
      </PixelBorderBlock>
    </div>
  )
}

const DaoBanner = ({ estimatedApc }: { estimatedApc: string }) => {
  const [showRewardCalcutorModal, setShowRewardCalcutorModal] = useState(false)
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const isMaxW = useMediaQuery(`(max-width: 1200px)`)
  const currentLanguage = useCurrentLanguage()
  const isZh = currentLanguage === 'zh'

  return (
    <div className={styles.bannerContainer}>
      <div className={`container ${styles.content}`}>
        <p className={styles.title}>{t('nervos_dao.deposit_to_dao')}</p>
        <p className={styles.description}>{t('nervos_dao.deposit_to_dao_description')}</p>
        <div className={styles.actions}>
          <LinkButtonContent name={t('nervos_dao.reward_calculator')} isShowModal={setShowRewardCalcutorModal} />
          <LinkButtonContent name={t('nervos_dao.nervos_dao_rfc')} isLinkHref={NERVOS_DAO_RFC_URL} />
          <LinkButtonContent name={t('nervos_dao.learn_more')} isLinkHref="https://www.nervos.org/knowledge-base/nervosdao_withdrawal_process_explained"  />
        </div>
      </div>
      {showRewardCalcutorModal ? (
        <RewardCalcutorModal estimatedApc={estimatedApc} onClose={() => setShowRewardCalcutorModal(false)} />
      ) : null}
    </div>
  )
}

export default DaoBanner
