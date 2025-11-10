import UDTDetail from "./page.client";


export default async function UDTDetailPage({ params }: { params: Promise<{ udtTypeHash: string }> }) {
  const { udtTypeHash } = await params;

  return (
    <>
      <UDTDetail udtTypeHash={udtTypeHash} />
    </>
  )
}