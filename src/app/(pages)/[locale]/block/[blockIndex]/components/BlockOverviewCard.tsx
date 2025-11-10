import { type ReactNode, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { dayjs } from '@/utils/date'
import { localeNumberString, handleDifficulty, numberToOrdinal } from '@/utils/number'
import { useIsMobile } from '@/hooks'
import { hexToUtf8 } from '@/utils/string'
import { shannonToCkb } from '@/utils/util'
import Capacity from '@/components/Capacity'
import { DELAY_BLOCK_NUMBER } from '@/constants/common'
import styles from '../styles.module.scss'
import ComparedToMaxTooltip from '@/components/Tooltip/ComparedToMaxTooltip'
import Tooltip from '@/components/Tooltip'
import { useSetToast } from '@/components/Toast'
import Link from 'next/link'
import InteImage from '@/components/InteImage'
import { useRouter } from 'next/navigation'
import LeftArrow from '../prev_block.svg?component'
import InfoIcon from '../info.svg?component'
import { useBlockChainInfo } from '@/store/useBlockChainInfo'
import CopyIcon from '@/assets/icons/copy.svg?component'
import OutLink from "@/components/OutLink";
import TextEllipsis from "@/components/TextEllipsis";
import DescPanel from "@/components/Card/DescPanel";
import DescPanelSingle from "@/components/Card/DescPanelSingle";
import Card from "@/components/Card";
import type { Field } from "@/components/Card/DescPanel";
import Tips from '@/components/Tips'
import MinerRewardIcon from '@/components/icons/MinerRewardIcon'

import QuestionIcon from "@/assets/icons/question.svg?component";
import CopyTooltipText from '@/components/Text/CopyTooltipText'

const CELL_BASE_ANCHOR = 'cellbase'

const BlockMiner = ({ miner }: { miner: string }) => {
    const { t } = useTranslation()
    if (!miner) {
        return <div className={styles.blockLinkPanel}>{t('address.unable_decode_address')}</div>
    }
    return (
        <OutLink href={`/address/${miner}`} className="underline">
            <TextEllipsis
                text={miner}
                ellipsis="address"
            />
        </OutLink>
    )
}

const BlockMinerMessage = ({ minerMessage }: { minerMessage: string }) => {
    return (
        <div className={`${styles.blockMinerMessagePanel} flex items-center gap-[8px]`}>
            <TextEllipsis text={minerMessage} ellipsis="address" />
            <Tips placement="top" asChild trigger={<InfoIcon className={styles.infoIconStyle} />}>
                {`UTF-8: ${hexToUtf8(minerMessage)}`}
            </Tips>
        </div>
    )
}

const BlockMinerReward = ({
    value,
    tooltip,
    sentBlockNumber,
}: {
    value: string | ReactNode
    tooltip: string
    sentBlockNumber?: string
}) => {
    const router = useRouter();
    return (
        <div className={`${styles.blockMinerRewardPanel} ${sentBlockNumber ? styles.sent : ''}`}>
            <div className="block__miner__reward_value mr-[8px]">{value}</div>
            <Tooltip
                placement="top"
                trigger={
                    <div
                        className="blockMinerRewardTip"
                        role="button"
                        tabIndex={-1}
                        onKeyDown={() => { }}
                        onClick={() => {
                            if (sentBlockNumber) {
                                router.push(`/block/${sentBlockNumber}#${CELL_BASE_ANCHOR}`)
                            }
                        }}
                    >
                        {sentBlockNumber ? <MinerRewardIcon /> : <QuestionIcon />}
                    </div>
                }
            >
                {tooltip}
            </Tooltip>
        </div>
    )
}

export interface BlockOverviewCardProps {
    block: APIExplorer.BlockResponse
}

const BlockOverviewCard: FC<BlockOverviewCardProps> = ({ block }) => {
    const isMobile = useIsMobile()
    const { t } = useTranslation()
    const setToast = useSetToast()
    const tipBlockNumber = useBlockChainInfo(s => s.blockNumber)
    const epochStartNumber = block.startNumber;
    const rewardPending = tipBlockNumber - Number(block.number) < DELAY_BLOCK_NUMBER
    const sentBlockNumber = `${Number(block.number) + DELAY_BLOCK_NUMBER}`
    const blockNumber = Number(block.number)

    const toHexString = (num: number, length: number) => `0x${num.toString(16).padStart(length, '0')}`
    const EpochInfoTooltip = () => (
        <Tips
            placement="top"
            trigger={
                <InfoIcon className={`${styles.infoIconStyle} ml-[8px]`} />
            }
        >
            <div className="flex flex-col gap-[4px] w-[230px] py-[4px]">
                <div className='bg-[#343434] rounded-[4px] px-[8px] py-[4px] dark:bg-[#F5F5F5] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)]'>
                    <span className='text-white text-[12px] font-medium mb-[2px] dark:text-[#333333]'>Epoch length</span>
                    <div className='flex align-center justify-between'>
                        <span className="text-right text-white text-[12px] dark:text-[#333333]">{localeNumberString(block.length)}</span>
                        <span className="col-span-2 text-[#999999] gap-1 flex items-center">
                            {toHexString(Number(block.length), 4)}
                            <span className='mx-[4px]'>on chain</span>
                            <CopyIcon
                                className="cursor-pointer text-primary w-[12px]"
                                onClick={() => {
                                    navigator.clipboard.writeText(toHexString(Number(block.length), 4))
                                    setToast({ message: t('common.copied') })
                                }}
                            />
                        </span>
                    </div>
                </div>

                <div className='bg-[#343434] rounded-[4px] px-[8px] py-[4px] dark:bg-[#F5F5F5] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)]'>
                    <span className='text-white text-[12px] font-medium mb-[2px] dark:text-[#333333]'>Epoch index</span>
                    <div className='flex align-center justify-between'>
                        <span className="text-right text-white text-[12px] dark:text-[#333333]">{localeNumberString(block.blockIndexInEpoch)}</span>
                        <span className="col-span-2 text-[#999999] gap-1 flex items-center">
                            {toHexString(Number(block.blockIndexInEpoch), 4)}
                            <span className='mx-[4px]'>on chain</span>
                            <CopyIcon
                                className="cursor-pointer text-primary w-[12px]"
                                onClick={() => {
                                    navigator.clipboard.writeText(toHexString(Number(block.blockIndexInEpoch), 4))
                                    setToast({ message: t('common.copied') })
                                }}
                            />
                        </span>
                    </div>
                </div>

                <div className='bg-[#343434] rounded-[4px] px-[8px] py-[4px] dark:bg-[#F5F5F5] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)]'>
                    <span className='text-white text-[12px] font-medium mb-[2px] dark:text-[#333333]'>Block index</span>
                    <div className='flex align-center justify-between'>
                        <span className="text-right text-white text-[12px] dark:text-[#333333]">{numberToOrdinal(Number(block.blockIndexInEpoch) + 1)}</span>
                        <span className="col-span-2 text-[#999999] gap-1 flex items-center">
                            {toHexString(Number(block.blockIndexInEpoch + 1), 4)}
                            <span className='mx-[4px]'>of the Epoch</span>
                            <CopyIcon
                                className="cursor-pointer text-primary w-[12px]"
                                onClick={() => {
                                    navigator.clipboard.writeText(toHexString(Number(block.blockIndexInEpoch + 1), 4))
                                    setToast({ message: t('common.copied') })
                                }}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </Tips>
    )

    const isNumber = (value: unknown): value is number => {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    };

    const overviewItems: Field[] = [
        {
            key: 'block_height',
            label: t('block.block_height'),
            tooltip: t('glossary.block_height'),
            content: (
                <div className={styles.blockNumber}>
                    <Tooltip
                        placement="top"
                        trigger={
                            <Link
                                href={`/block/${blockNumber - 1}`}
                                className={styles.prev}
                                data-disabled={!block.number || +blockNumber <= 0}
                            >
                                <LeftArrow />
                            </Link>
                        }
                    >
                        {t('block.view_prev_block')}
                    </Tooltip>
                    <div className='font-menlo'>{localeNumberString(blockNumber)}</div>
                    <Tooltip
                        trigger={
                            <Link
                                href={`/block/${blockNumber + 1}`}
                                className={styles.next}
                                data-disabled={!block.number || +blockNumber >= +tipBlockNumber}
                            >
                                <LeftArrow />
                            </Link>
                        }
                    >
                        {t('block.view_next_block')}
                    </Tooltip>
                </div>
            ),
        },
        {
            key: 'transactions',
            label: t('transaction.transactions'),
            tooltip: t('glossary.transactions'),
            content: <span className="font-menlo">{localeNumberString(block.transactionsCount)}</span>,
        },
        ...(block.size
            ? [
                {
                    key: 'size',
                    label: t('block.size'),
                    // tooltip: t('glossary.size'),
                    content: block.size ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div className='flex gap-[8px]'>
                                <span className='font-menlo'>{`${block.size.toLocaleString('en')}`}</span>
                                <span className='font-medium'>Bytes</span>
                            </div>
                            {/* {`${block.size.toLocaleString('en')} Bytes`} */}
                            {
                                !!block.largestBlockInEpoch || !!block.largestBlock && (
                                    <ComparedToMaxTooltip
                                        numerator={block.size}
                                        maxInEpoch={block.largestBlockInEpoch ?? null}
                                        maxInChain={block.largestBlock ?? null}
                                        titleInEpoch={t('block.compared_to_the_max_size_in_epoch')}
                                        titleInChain={t('block.compared_to_the_max_size_in_chain')}
                                        unit="Bytes"
                                    />
                                )
                            }

                        </div>
                    ) : (
                        '-'
                    ),
                },
            ]
            : []),
        {
            key: 'cycles',
            label: t('block.cycles'),
            // tooltip: t('glossary.cycles'),
            content: block.cycles ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    className='font-menlo'
                >
                    {`${block.cycles.toLocaleString('en')}`}
                    <ComparedToMaxTooltip
                        numerator={block.cycles}
                        maxInEpoch={block.maxCyclesInEpoch ?? null}
                        maxInChain={block.maxCycles ?? null}
                        titleInEpoch={t('block.compared_to_the_max_cycles_in_epoch')}
                        titleInChain={t('block.compared_to_the_max_cycles_in_chain')}
                    />
                </div>
            ) : (
                '-'
            ),
        },
        {
            key: 'proposal_transactions',
            label: t('block.proposal_transactions'),
            // tooltip: t('glossary.proposal_transactions'),
            content: <span className="font-menlo">{block.proposalsCount ? localeNumberString(block.proposalsCount) : 0}</span>,
        },
        ...(block.minerReward
            ? [
                {
                    key: 'miner_reward',
                    label: t('block.miner_reward'),
                    // tooltip: t('glossary.miner_reward'),
                    content: (
                        <BlockMinerReward
                            value={rewardPending ? t('block.pending') : <Capacity capacity={shannonToCkb(block.minerReward)} />}
                            tooltip={rewardPending ? t('block.pending_tip') : t('block.reward_sent_tip')}
                            sentBlockNumber={sentBlockNumber}
                        />
                    ),
                },
            ]
            : []),
        {
            key: 'difficulty',
            label: t('block.difficulty'),
            // tooltip: t('glossary.difficulty'),
            content: <span className="font-menlo">{handleDifficulty(block.difficulty)}</span>,
        },
        {
            key: 'nonce',
            label: t('block.nonce'),
            // tooltip: t('glossary.nonce'),
            content: <div className='w-[200px]'> <TextEllipsis text={`0x${block.nonce}`} ellipsis="address" /></div>
        },
        {
            key: 'uncle_count',
            label: t('block.uncle_count'),
            // tooltip: (
            //   <Trans
            //     i18nKey="glossary.uncle_count"
            //     components={{

            //       link1: <a href="https://docs.nervos.org/docs/basics/glossary/#uncle" target="_blank" rel="noreferrer" />,
            //     }}
            //   />
            // ),
            content: `${block.unclesCount}`,
        },
        // right
        {
            key: 'miner',
            label: t('block.miner'),
            show: true,
            // tooltip: t('glossary.miner'),
            content: <BlockMiner miner={block.minerHash} />,
        },
        ...(block.minerMessage
            ? [
                {
                    key: 'miner_message',
                    label: t('block.miner_message'),
                    // tooltip: t('glossary.miner_message'),
                    content: <BlockMinerMessage minerMessage={block.minerMessage ?? t('common.none')} />,
                },
            ]
            : []),
        {
            key: 'epoch',
            label: t('block.epoch'),
            // tooltip: t('glossary.epoch'),
            content: (
                <span className="flex items-center gap-1 font-menlo">
                    {isNumber(Number(block.epoch)) ? localeNumberString(block.epoch) : '-'}
                    <EpochInfoTooltip />
                </span>
            ),
        },
        {
            key: 'epoch_start_number',
            label: t('block.epoch_start_number'),
            // tooltip: t('glossary.epoch_start_number'),
            content: (
                <OutLink href={`/block/${epochStartNumber}`} className="underline">
                    <TextEllipsis text={localeNumberString(epochStartNumber)} ellipsis="address" />
                </OutLink>
            ),
        },
        {
            key: 'block_index',
            label: t('block.block_index'),
            // tooltip: t('glossary.block_index'),
            content: (
                <span className="flex items-center gap-1 font-menlo">
                    {numberToOrdinal(Number(block.blockIndexInEpoch) + 1)} of the {block.length}
                    <EpochInfoTooltip />
                </span>
            ),
        },
        {
            key: 'timestamp',
            label: t('block.timestamp'),
            // tooltip: t('glossary.timestamp'),
            content: <span className="font-menlo">{dayjs(+block.timestamp).format("YYYY/MM/DD HH:mm:ssZZ")}</span>,
        },
    ]

    const rootInfoItem: Field[] = [
        {
            key: 'transactions_root',
            label: t('block.transactions_root'),
            // tooltip: t('glossary.transactions_root'),
            content: (
                <Tooltip
                    asChild
                    trigger={<div className="truncate font-menlo">{block.transactionsRoot}</div>}
                >
                    <CopyTooltipText content={block.transactionsRoot} />
                </Tooltip>
            ),
        }
    ]

    return (
        <Card className="flex flex-col gap-[16px] p-[12px] md:p-[24px]">
            <DescPanel fields={overviewItems} />
            {!isMobile && <DescPanelSingle fields={rootInfoItem} textDirection="right" />}
        </Card>
    )
}

export default BlockOverviewCard