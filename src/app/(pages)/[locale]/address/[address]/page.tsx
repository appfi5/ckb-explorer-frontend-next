// import SearchFailView from "@/components/SearchFailView";
// import { isChainTypeError } from "@/utils/chain";
// import AddressDetailOld from "./deprecated/AddressDetail";
import AddressDetail from "./page.client";


export default async function AddressDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;

  // if(isChainTypeError(address)) {
  //   return <SearchFailView address={address} />
  // }

  return (
    <>
      <AddressDetail address={address} />
      {/* <AddressDetailOld address={address} /> */}
    </>
  )
}