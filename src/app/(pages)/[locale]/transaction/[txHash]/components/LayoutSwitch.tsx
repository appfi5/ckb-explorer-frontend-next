
import { LayoutLiteProfessional } from '@/constants/common'
import { useUpdateSearchParams } from '@/hooks';
import styles from './LayoutSwitch.module.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import type { ComponentProps } from 'react';
import { useTxLaytout } from '../tool';

const { Professional, Lite } = LayoutLiteProfessional
export default function LayoutSwitch(props: ComponentProps<"div">) {
  const { t } = useTranslation()
  const layout = useTxLaytout();
  const updateSearchParams = useUpdateSearchParams<'layout'>()
  const onChangeLayout = (layoutType: LayoutLiteProfessional) => {
    if (layoutType === layout) return;
    updateSearchParams(params =>
      layoutType === Professional
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: layoutType },
    )
  }

  return (
    <div {...props} className={classNames("relative inline-flex",  styles.layoutSwitch, props.className)}>
      <div className={classNames(styles.borderLine, styles.top)} />
      <div className={classNames(styles.borderLine, styles.bottom)} />
      <div className={classNames(styles.borderLine, styles.left)} />
      <div className={classNames(styles.borderLine, styles.right)} />
      <div
        className={classNames("font-medium text-base w-[134px] h-[28px] ", styles.tab, { [styles.active]: layout === Professional })}
        onClick={() => onChangeLayout(Professional)}
      >
        {t('transaction.professional')}
      </div>
      <div
        className={classNames("font-medium text-base w-[134px] h-[28px] ", styles.tab, { [styles.active]: layout === Lite })}
        onClick={() => onChangeLayout(Lite)}
      >
        {t('transaction.lite')}
      </div>
    </div>
  );
}