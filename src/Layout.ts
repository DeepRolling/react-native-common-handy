import {
  ModalProps,
  NativeModules,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

/**
 * handy when you need calculate item width in flex-wrap layout
 * @param countOfEachRow how many item you want to place on each row
 * @param itemMargin the distance between two item
 * @param eachRowWidth width of each row
 * usage : calculateFlexWrapItemWidth(4, getRealWidth(20), getRealWidth(76) * 2)
 */
export function calculateFlexWrapItemWidth(
  countOfEachRow: number,
  itemMargin: number,
  eachRowWidth: number
) {
  return eachRowWidth - ((countOfEachRow - 1) * itemMargin) / countOfEachRow;
}

export const STATUSBAR_PADDING_FOR_NEED =
  Platform.OS === 'ios'
    ? getStatusBarHeight()
    : NativeModules.StatusBarManager.HEIGHT;
/**
 * 全局弹出Modal的样式，为了统一风格，沉浸式状态栏
 */
export const globalModalStyle: ModalProps = {
  transparent: true,
  statusBarTranslucent: true,
  animationType: 'fade',
};
/**
 * handy style let view row center
 */
export const horizontalCenter: StyleProp<ViewStyle> = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
/**
 * handy style let view vertical center
 */
export const verticalCenter: StyleProp<ViewStyle> = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
