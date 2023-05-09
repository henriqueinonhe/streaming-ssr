export const isServer = typeof window === "undefined";
export const isClient = !isServer;

export const sleep = (ms) => {
  const start = performance.now();
  while (performance.now() - start < ms);
};
