"use client"
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Content from '@/components/Content'
import { ListOnDesktop, ListOnMobile, isTxFilterType } from './List'
import Pagination from '@/components/Pagination'
import { udtSubmitEmail } from '@/utils/util'
import { useSearchParams,useMediaQuery,usePaginationParamsInListPage } from '@/hooks'
import styles from './styles.module.scss'
import { useNFTCollectionsSortParam } from './util'
import server from '@/server';

const submitTokenInfoUrl = udtSubmitEmail()

const NftCollections = () => {
  const isMobile = useMediaQuery(`(max-width: 900px)`);
  const { t } = useTranslation()
  const { page = '1', type, tags, standard } = useSearchParams('page', 'type', 'tags','standard')
  const { sort } = useNFTCollectionsSortParam()
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()

  const isValidFilter = isTxFilterType(type) && type !== 'all'

  const query = useQuery({
    queryKey: ['nft-collections', currentPage,pageSize, sort, type, tags, 'true', standard],
    // queryFn: () =>
    //   explorerService.api.fetchNFTCollections(page, sort, isValidFilter ? type : undefined, tags, 'true'),
    queryFn: async () => {
      const res = await server.explorer("GET /nft/collections", { page: currentPage, pageSize: pageSize, sort: sort ?? '',  tags: tags ?? '',standard: standard ?? '' })
      return {
        nftData: res?.records ?? [],
        total: res?.total ?? 0,
      }
    }
  })


  const { data, isLoading } = query
  const nftData = data?.nftData ?? []
  const total = data?.total ?? 0

  return (
    <Content>
      <div className={`${styles.nftListPanel} container`}>
        <div className={styles.header}>
          <span>{t('nft.nft_collection')}</span>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={submitTokenInfoUrl}
            style={{
              color: "var(--color-primary)",
            }}
          >
            {t('udt.submit_token_info')}
          </a>
        </div>

        {
          isMobile ? <ListOnMobile isLoading={isLoading} list={nftData} />:<ListOnDesktop isLoading={isLoading} list={nftData} />
        }

        <Pagination
          currentPage={currentPage}
          total={total}
          onChange={setPage}
          paginationType="list"
          setPageSize={setPageSize}
          pageSize={pageSize}
        />
      </div>
    </Content>
  )
}

export default NftCollections
