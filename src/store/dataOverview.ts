const LOCAL_KEY = 'DATA_OVERVIEW_DELETE_KEYS';

export const getDataOverviewDeleteKeys = () =>
  new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(localStorage.getItem(LOCAL_KEY)?.split(',') || []);
    }, Math.random() * 1000 + 300);
  });

export const setDataOverviewDeleteKeys = (keys: string[]) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      localStorage.setItem(LOCAL_KEY, keys.join(','));
      resolve();
    }, Math.random() * 1000 + 300);
  });

(window as any).initDataOverview = () => {
  localStorage.removeItem(LOCAL_KEY);
};
