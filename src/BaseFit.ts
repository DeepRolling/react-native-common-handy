import { Dimensions, PixelRatio } from 'react-native';

let logEnable = false;
let logName = 'react-native-common-handy:BaseFit';
function toggleBaseFitChangeLog(enable: boolean) {
  logEnable = enable;
}

// 设计稿宽/高度，单位 px
let uiWidthPx = 750;
let uiHeightPx = 1334;

let uiWidthPxRecord = 750;
let uiHeightPxRecord = 1334;

/**
 * inject custom resolve resolution so that this util can calculate with by this value
 * generally speak , this value you will copies from design picture
 * @param width resolve resolution with
 * @param height resolve resolution height
 */
function injectCustomResolveResolution(width: number, height: number) {
  uiWidthPx = width;
  uiHeightPx = height;
  uiWidthPxRecord = width;
  uiHeightPxRecord = height;
}

/**
 * change resolve strategy to portrait , only useful when user change screen orientation
 */
function changeResolveStrategyToPortrait() {
  uiWidthPx = uiWidthPxRecord;
  uiHeightPx = uiHeightPxRecord;
  if (logEnable) {
    console.log(
      logName +
        `screen Dimensions(changeResolveStrategyToPortrait) : width is${uiWidthPx}  : height is ${uiHeightPx}`
    );
  }
}

/**
 * change resolve strategy to landscape , only useful when user change screen orientation
 */
function changeResolveStrategyToLandscape() {
  uiWidthPx = uiHeightPxRecord;
  uiHeightPx = uiWidthPxRecord;
  if (logEnable) {
    console.log(
      logName +
        `screen Dimensions(changeResolveStrategyToLandscape) : width is${uiWidthPx}  : height is ${uiHeightPx}`
    );
  }
}

// 设备宽度，单位 dp
let deviceWidthDp = Dimensions.get('window').width;
let deviceHeightDp = Dimensions.get('window').height;
/**
 * refresh current device resolution , this function only useful when user change screen orientation
 */
function calculateDeviceWidthAndHeight() {
  deviceWidthDp = Dimensions.get('window').width;
  deviceHeightDp = Dimensions.get('window').height;
  if (logEnable) {
    console.log(
      logName +
        `screen Dimensions(calculateDeviceWidthAndHeight) : screenWidth is${deviceWidthDp}  : screenHeight is ${deviceHeightDp}`
    );
  }
}

/**
 * px 转 dp（设计稿中的 px 转 rn 中的 dp）
 * @param uiElePx
 */
function getRealWidth(uiElePx: any) {
  return (uiElePx * deviceWidthDp) / uiWidthPx;
}

/**
 * px 转 dp（设计稿中的 px 转 rn 中的 dp）
 * @param uiElePx
 */
function getRealHeight(uiElePx: any) {
  return (uiElePx * deviceHeightDp) / uiHeightPx;
}

function getRealDP(designPx: any) {
  return (designPx * deviceWidthDp) / uiWidthPx;
}

/**
 * 字体大小适配，例如我的设计稿字体大小是17px，那么使用就是：getRealFontsize(17)
 * @param number
 */
function getRealFontsize(number: any) {
  number = Math.round(
    ((number *
      Math.min(deviceHeightDp / uiHeightPx, deviceWidthDp / uiWidthPx) +
      0.5) *
      PixelRatio.get()) /
      PixelRatio.getFontScale()
  );
  return number / PixelRatio.get();
}

export {
  toggleBaseFitChangeLog,
  getRealWidth,
  getRealHeight,
  getRealFontsize,
  getRealDP,
  injectCustomResolveResolution,
  changeResolveStrategyToPortrait,
  changeResolveStrategyToLandscape,
  calculateDeviceWidthAndHeight,
  deviceWidthDp,
  deviceHeightDp,
};
