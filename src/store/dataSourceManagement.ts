const LOCAL_KEY = 'DATA_SOURCE_MANAGEMENT_ITEMS';

export interface DataSourceItem {
  id?: string;
  serverIp?: string;
  serverName?: string;
  port?: string;
  type?: string;
  extra?: string;
}

export const getDataSourceList = () => {
  return new Promise<DataSourceItem[]>((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) {
        resolve([]);
        return;
      }
      try {
        const result = JSON.parse(raw);
        resolve(result);
      } catch (err) {
        resolve([]);
      }
    }, Math.random() * 1000 + 300);
  });
};

export const setDataSourceList = (data: DataSourceItem[]) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      resolve();
    }, Math.random() * 1000 + 300);
  });
};
