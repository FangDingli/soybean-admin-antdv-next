import { theme } from 'antdv-next';
import type { ThemeConfig } from 'antdv-next';

/**
 * Create antdv-next theme config from soybean theme state.
 *
 * antdv-next derives hover/active palettes from the seed colors via its own
 * algorithm, so only seed tokens need mapping here (see soybean-admin v3 docs §7.2,
 * "ant-design-vue adapter": theme token -> ConfigProvider theme).
 *
 * @param colors Theme colors
 * @param themeRadius Border radius from theme settings
 * @param darkMode Is dark mode
 */
export function createAntdvThemeConfig(
  colors: App.Theme.ThemeColor,
  themeRadius: number,
  darkMode: boolean
): ThemeConfig {
  return {
    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primary,
      colorInfo: colors.info,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,
      borderRadius: themeRadius
    }
  };
}
