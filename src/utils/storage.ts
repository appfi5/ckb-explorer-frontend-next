const clientRun = <T extends (...args: any[]) => any>(f: T) => {
  if (typeof window !== "undefined") {
    return f;
  }
  return (() => {}) as unknown as T;
};

const storage = {
  key: clientRun((index: number) => {
    return window.localStorage.key(index);
  }),
  getItem: clientRun((key: string) => {
    return window.localStorage.getItem(key);
  }),
  setItem: clientRun((key: string, value: string) => {
    return window.localStorage.setItem(key, value);
  }),
  removeItem: clientRun((key: string) => {
    return window.localStorage.removeItem(key);
  }),
  clear: clientRun(() => {
    return window.localStorage.clear();
  }),
};

export default storage;
