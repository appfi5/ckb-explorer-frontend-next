
import { useQuery } from '@tanstack/react-query';
import styles from './index.module.scss'
import { getEnvChainNodes } from '@/utils/envVarHelper';
import { getKnowledgeSize } from '../utils';
import Link from 'next/link';
import { NumberTicker } from '@/components/ui/NumberTicker';
import classNames from 'classnames';


export default function KnowledgeSize() {
  const backupNodes = getEnvChainNodes();
  const { data: size } = useQuery({
    queryKey: ["backnode_tip_header"],
    refetchInterval: 12 * 1000,
    queryFn: async () => {
      try {
        if (backupNodes.length === 0) return null;

        const size = await Promise.race(backupNodes.map(getKnowledgeSize));

        return size;
      } catch {
        return null;
      }
    },
  });

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h3 className='text-[24px] font-medium'>Knowledge Size</h3>
        <div className={classNames("text-[28px] md:text-[40px] font-bold", styles.ticker)}>
          <NumberTicker className='font-menlo' value={size ? +size : null} />
          <span className='ml-5'>CKBytes</span>
        </div>
      </div>
    </div>
  )
}