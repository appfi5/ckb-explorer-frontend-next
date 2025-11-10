import BlockDetail from "./BlockDetail";


export default async function BlockDetailPage({ params }: { params: Promise<{ blockIndex: string }> }) {
  const { blockIndex } = await params;

  return <BlockDetail blockIndex={blockIndex} />
}