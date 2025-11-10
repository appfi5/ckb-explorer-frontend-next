import NFTDetail from "./page.client";



export default async function NFTDetailPage({ params }: { params: Promise<{ collectionId: string, tokenId: string }> }) {
  const { collectionId, tokenId } = await params;
  return <NFTDetail collectionId={collectionId} tokenId={tokenId} />
}