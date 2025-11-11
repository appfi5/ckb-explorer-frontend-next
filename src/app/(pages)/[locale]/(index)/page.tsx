"use client";
import Content from "@/components/Content";
import Banner from "./components/Banner";
import HomeSearch from "./components/Search";
import RuntimeInfos from "./components/RuntimeInfos";
import LatestBlocks from "./components/List/LatestBlocks";
import LatestTransactions from "./components/List/LatestTransactions";


export default function HomePage() {

  return (
    <Content>
      <Banner />
      <div className="container flex flex-col items-stretch gap-4 sm:gap-5">
        <HomeSearch />
        <RuntimeInfos />
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-[20px] mb-[34px]">
          <LatestBlocks />
          <LatestTransactions />
        </div>
      </div>
    </Content>
  );
};
