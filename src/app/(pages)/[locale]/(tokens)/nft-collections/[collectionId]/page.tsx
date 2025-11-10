import NFTCollectionDetail from "./page.client";




export default async function NFTCollectionInfoPage({ params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params;
  return <NFTCollectionDetail collectionId={collectionId} />
}