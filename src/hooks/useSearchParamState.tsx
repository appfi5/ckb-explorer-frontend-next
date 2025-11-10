import { useRouter, useSearchParams } from "next/navigation";



type Opt = {
  clearOthers?: boolean;
}


export default function useSearchParamState<T extends string>(key: string, defaultValue: string, config?: Opt) {
  const params = useSearchParams();
  const value = (params.get(key) || defaultValue || "") as T;
  const router = useRouter();
  const setter = (newValue: string) => {
    const newParams = config?.clearOthers ? new URLSearchParams() : new URLSearchParams(params);
    if (newValue) {
      newParams.set(key, newValue);
    } else {
      newParams.delete(key);
    }
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  return [value, setter] as const;
}