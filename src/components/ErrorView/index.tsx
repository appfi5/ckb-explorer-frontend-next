"use client"
import React from 'react'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import PCErrorImage from './error.png'
import MobileErrorImage from './Mobile_error.png'
import { useIsMobile } from '@/hooks'
import styles from './index.module.scss'
import InteImage from '@/components/InteImage'
import Link from 'next/link'

type ErrorViewProps = {
  error: Error,
  errorMessage?: string
  errorDescription?: React.ErrorInfo['componentStack']
}

export default function ErrorView({ error, errorMessage, errorDescription }: ErrorViewProps) {
  const isMobile = useIsMobile()
  const [t] = useTranslation()

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Content>
      <div className={styles.container}>
        {(error || errorDescription) && (
          <>
            <InteImage className={styles.notErrorImage} src={isMobile ? MobileErrorImage : PCErrorImage} alt="error" />
            <div className={styles.pageCrashedTip}>{t('error.page_crashed_tip')}</div>
            <Link className={styles.backHome} href="/">
              {t('error.back_home')}
            </Link>
            {!isProduction && (
              <pre className={styles.pageCrashedError}>
                {error.message}
                {errorDescription}
              </pre>
            )}
          </>
        )}
      </div>
    </Content>
  )
}
