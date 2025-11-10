import { useEffect, useRef } from "react";
import Loading from "../Loading";



export default function LoadMore({ onLoadMore }: { onLoadMore: () => void }) {

  const ref = useRef(null);
  const cbRef = useRef<() => void>(null);
  cbRef.current = onLoadMore;
  useEffect(() => {
    if (!ref.current) return;
    const listener: IntersectionObserverCallback = ([entry]) => {
      if (entry?.isIntersecting) {
        cbRef.current?.();
      }
    }
    const target = new IntersectionObserver(listener);
    target.observe(ref.current)
    return () => {
      target.disconnect();
    }

  }, [])

  return (
    <div ref={ref}>
      <Loading />
    </div>
  )
}