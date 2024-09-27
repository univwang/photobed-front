export const API_URL = "https://bed.wangqianyv.eu.org/photo-bed/";
export const APP_NAME = "https://bed.wangqianyv.eu.org/photo-bed/";

// 如果需要更复杂的类型定义，可以这样做
interface AppConfig {
  apiUrl: string;
  appName: string;
}

const appConfig: AppConfig = {
  apiUrl: API_URL,
  appName: APP_NAME,
};

export default appConfig;
