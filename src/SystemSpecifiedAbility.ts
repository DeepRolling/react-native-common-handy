import { ActionSheetIOS, Linking, Platform } from 'react-native';
import Toast from 'react-native-simple-toast';
import AndroidOpenSettings from 'react-native-android-open-settings';
// @ts-ignore
import DeepToastAndroid from 'react-native-deep-toast-android';

/**
 * indicate current running platform
 */
export const isAndroid = Platform.OS === 'android';

/**
 * display ios-style action sheet
 * @param optionTextArray such : ['从相册选择','拍摄']
 * @param onClickItem invoke when user click option with clicked index
 * @param cancelText as the name
 */
export function displayIosNativeActionSheet(
  optionTextArray: string[],
  onClickItem: (buttonIndex: number) => void,
  cancelText?: string
) {
  let totalCancelText = cancelText === undefined ? '取消' : cancelText;
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: [totalCancelText, ...optionTextArray],
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      onClickItem(buttonIndex);
    }
  );
}

/**
 * display toast in different platform , the implementation is different
 * toast in android platform can be overwrite
 * @param message which message you want to display
 * @param durationSecond showing duration of the message
 */
export function showToast(message: string, durationSecond?: number) {
  if (typeof message !== 'string') {
    //todo send message to my email
    return;
  }
  if (isAndroid) {
    console.log('each showToast : ' + JSON.stringify(message));
    DeepToastAndroid.hide();
    DeepToastAndroid.show({
      message,
      duration: durationSecond === undefined ? 'short' : 'long',
      position: 'center',
    });
  } else {
    Toast.showWithGravity(
      message,
      durationSecond === undefined ? 0.5 : durationSecond,
      Toast.CENTER
    );
  }
}

/**
 * use this function open system setting and jump to correspond application
 */
export function jumpToApplicationSetting() {
  if (isAndroid) {
    AndroidOpenSettings.appDetailsSettings();
  } else {
    Linking.openURL('app-settings:').catch((err) => console.log('error', err));
  }
}
