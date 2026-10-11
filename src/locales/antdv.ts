import type { Locale } from 'antdv-next/dist/locale';
import enUS from 'antdv-next/dist/locale/en_US';
import zhCN from 'antdv-next/dist/locale/zh_CN';

export const antdvLocales: Record<App.I18n.LangType, Locale> = {
  'zh-CN': zhCN,
  'en-US': enUS
};
