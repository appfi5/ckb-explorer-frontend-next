"use client"
import { KBarProvider } from "kbar";
import type { PropsWithChildren } from "react";




export default function ClientKBarProvider({ children }: PropsWithChildren<{}>) {
  return (
    <KBarProvider
      options={{
        enableHistory: false,
        callbacks: {
          onOpen: () => {
            // console.log("onOpen");
            document.body.classList.add("pointer-events-none");
          },
          onClose: () => {
            // console.log("onClose");
            document.body.classList.remove("pointer-events-none");
            // setOpenCount((prev) => prev + 1);
          },
          // onQueryChange() {
            // console.log("onQueryChange");
          // },
          onSelectAction() {
            // console.log("onSelectAction");
            document.body.classList.remove("pointer-events-none");
          }
        },
      }}
    >
      {children}
    </KBarProvider>
  )
}