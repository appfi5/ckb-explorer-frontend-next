import TransactionDetail from "./page.client";



export default async function TransactionDetailPage({ params }: { params: Promise<{ txHash: string }> }) {
  const { txHash } = await params;

  return <TransactionDetail txHash={txHash} />
}