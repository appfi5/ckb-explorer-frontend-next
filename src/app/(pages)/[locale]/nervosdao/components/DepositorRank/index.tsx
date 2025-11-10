import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shannonToCkb } from '@/utils/util'
import Capacity from '@/components/Capacity'
import { handleBigNumber } from '@/utils/string'
import AddressText from '@/components/AddressText'
import styles from './index.module.scss'
import { useIsMobile } from '@/hooks'
import { type NervosDaoDepositor } from '@/server/dataTypes'
import { type CardCellFactory, CardListWithCellsList } from '@/components/CardList'

type RankedDepositor = NervosDaoDepositor & { rank: number }

const AddressTextCol = ({ address }: { address: string }) => {
  return (
    <AddressText
      linkProps={{
        className: styles.addressTextCol,
        href: `/address/${address}`,
      }}
    >
      {address}
    </AddressText>
  )
}

const DepositorCardGroup: FC<{ depositors: RankedDepositor[] }> = ({ depositors }) => {
  const { t } = useTranslation()

  const items: CardCellFactory<RankedDepositor>[] = [
    {
      title: t('nervos_dao.dao_title_rank'),
      content: depositor => depositor.rank,
    },
    {
      title: t('nervos_dao.dao_title_address'),
      content: depositor => <AddressTextCol address={depositor.addressHash} />,
    },
    {
      title: t('nervos_dao.dao_title_deposit_capacity'),
      content: depositor => <Capacity capacity={shannonToCkb(depositor.daoDeposit)} layout="responsive" textDirection='left' />,
    },
    // {
    //   title: t('nervos_dao.dao_title_deposit_time'),
    //   content: depositor => handleBigNumber(depositor.averageDepositTime, 1),
    // },
  ]

  return (
    <CardListWithCellsList
      className={styles.depositorCardGroup}
      dataSource={depositors}
      getDataKey={data => data.addressHash}
      cells={items}
      cardProps={{ rounded: false }}
    />
  )
}

const DepositorRank: FC<{ depositors: NervosDaoDepositor[]; filter?: string }> = ({ depositors, filter }) => {
  const { t } = useTranslation()
  const rankedDepositors: RankedDepositor[] = depositors.length > 0 && depositors.map((depositor, index) => ({
    ...depositor,
    rank: index + 1,
  }))

  const filteredDepositors = rankedDepositors.length > 0 && filter ? rankedDepositors.filter(d => d.addressHash === filter) : rankedDepositors

  return useIsMobile() ? (
    <>
      <div className={styles.depositorRankCardPanel}>
        <DepositorCardGroup depositors={filteredDepositors} />
      </div>
    </>
  ) : (
    <>
      <div className={styles.depositorRankPanel}>
        <div className={styles.depositorRankTitle}>
          <div>{t('nervos_dao.dao_title_rank')}</div>
          <div>{t('nervos_dao.dao_title_address')}</div>
          <div>{t('nervos_dao.dao_title_deposit_capacity')}</div>
          {/* <div>{t('nervos_dao.dao_title_deposit_time')}</div> */}
        </div>
        {filteredDepositors.length > 0 && filteredDepositors.map(depositor => (
          <div className={styles.depositorRankItem} key={depositor.addressHash}>
            <div>{depositor.rank}</div>
            <div>
              <div className={styles.address}><AddressTextCol address={depositor.addressHash} /></div>
            </div>
            <div>
              <Capacity capacity={shannonToCkb(depositor.daoDeposit)} layout="responsive" textDirection="left" />
            </div>
            {/* <div>{handleBigNumber(depositor.averageDepositTime, 1)}</div> */}
          </div>
        ))}
      </div>
    </>
  )
}

export default DepositorRank