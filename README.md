# react-native-common-handy

Handy code encapsulation in react-native project.

The gist of this library is collect the handy code to offer some useful ability to your application .

We offer following ability :

* application foreground and background change hook
* some handy hooks (such useEffectWithoutFirstTime...)
* ui distance calculate (expose handy function to calculate ui distance by design picture)
* theme system
* Icon component use react-native-vector-icons library
* some platform(android/ios) specification functions

## Installation

```sh
yarn add react-native-common-handy
```

This project depends on others packages, so you need install them to make this library work :
```sh
yarn add react-native-status-bar-height@2.6.0 react-native-simple-toast@1.1.3 react-native-android-open-settings@@1.3.0 react-native-vector-icons@7.1.0
```

## Usage(TypeScript)

### Theme

step1 : define your own design system(/theme/index.ts)

```typescript
import {getRealFontsize, getRealWidth, injectColorThemeProfile} from 'react-native-common-handy';

//notice : you can offer more detail type for your theme system
//there only use "any" make code as brife as possible!
type ThemeProfile = {
  ui: any;
  textColor: any;
  chartColor: any;
  fontSize: any;
};
const customTheme: {[x: string]: ThemeProfile} = {
    lightMode: {
        ui: {
          waring: '#EA504E',
          ...otherStyle
        },
        textColor: {
            title: '#333333',
            ...otherStyle
        },
        chartColor: {
            green: '#54CD87',
            ...otherStyle
        },
        fontSize: {
            hugeTitle: getRealFontsize(36),
            ...otherFontSize
        },
    },
    darkMode: {
        //theme of dark mode, smilar to light theme
    },
};


let Theme = injectColorThemeProfile<ThemeProfile>(customTheme['lightMode']);
export const ColorThemeContext = Theme[0];
export const ColorThemeProvider = Theme[1];
export const useColorTheme = Theme[2];
```

step2 : wrapper your HOC with ThemeProvider
```tsx
import {ColorThemeProvider} from '@theme/index';
export function App() {
    return (
        <ColorThemeProvider>
            <View style={{flex: 1}}>
              {/*{rest of your content}*/}
            </View>
        </ColorThemeProvider>
    );
}
```

step3 : use theme in component

```tsx
//useage1 : use with native style

import {View} from "react-native";

const StandaloneBackButton = (props: any) => {
  const {colorTheme} = useColorTheme()!!;
  const standaloneBackButtonStyle = useMemo(() => wrapperWithColorTheme(standaloneBackButtonStyles, colorTheme), [colorTheme]);

  return (
    <TouchableOpacity style={standaloneBackButtonStyle.backButtonContainer}>
      {/*{rest of your content}*/}
    </TouchableOpacity>
  );
};

const standaloneBackButtonStyles = (colorTheme: ThemeProfile) => {
  const {ui,textColor,fontSize} = colorTheme;
  return StyleSheet.create<{
    backButtonContainer: ViewStyle
  }>({
    backButtonContainer: {
      width: getRealWidth(100),
      backgroundColor: ui.primary,
      ...(horizontalCenter as {}),
    }
  });
};
export default React.memo(StandaloneBackButton);

//useage2 : use standalone

export function TestComponent(props: any) {
  const {
    colorTheme: {ui,textColor,fontSize},
  } = useColorTheme()!!;
  return <View
    style={{
      width: '100%',
      height: getRealHeight(100),
      backgroundColor:ui.someColor
    }}>
    {/*{rest of your content}*/}
  </View>
}


//useage3 : change global theme
export function GlobalThemeChangeButton(props: any) {
  const {setColors} = useColorTheme()!!;
  return <Button title={'change theme'} onPress={() => {
    setColors(customThemeStyleSheet['darkmode'])
  }} />;
}
```

### Listen Application state change(from foreground to background，vice versa)
```tsx
//step1 : enable feature in entry of your application
export default function App() {
  useApplicationStateChangeAbility();
  return <View/>;
}
//step2 : listen application state change in component
export default function Component() {
  useAppForegroundAndBackgroundChangeListener('whyYouWantListen', foreground => {
    if (foreground) {
      //do want you want to do
    }
  });
  return <View/>;
}

```

### Dimensions
```typescript
//step1 : inject baseline design dimension to application
injectCustomResolveResolution(750,1334)

//step2 : if screen orientation change, make library relative to orientation of screen
changeResolveStrategyToPortrait()
changeResolveStrategyToLandscape()
//always refresh system dimension after screen orientation change
calculateDeviceWidthAndHeight();

//step3 : calculate the right dimension base on design picture
const rightWith = getRealWidth(32)
const rightHeight = getRealHeight(32)
const rightDp = getRealDP(32)
const rightFontSize = getRealFontsize(32)
```

### Layout
```typescript
//sometimes you need get the certain width of each item you tiled evenly to a row
calculateFlexWrapItemWidth(4, getRealWidth(20), getRealWidth(76) * 2)
//height of status bar in current device(whatever the os are)
STATUSBAR_PADDING_FOR_NEED
//flex layout wrapper
horizontalCenter,verticalCenter
```

### System Specification feature
```typescript

//display IOS style action sheet:
//https://developer.apple.com/design/human-interface-guidelines/ios/views/action-sheets/
displayIosNativeActionSheet(["拍照","从相册选择"],(buttonIndex: number)=>{
    //do you want to do
})

//display Toast in device
showToast('LOL')
showToast('LOL',3)//3 second

//jump to application setting
jumpToApplicationSetting()
```

### Handy hooks
```typescript
//sometimes you want to ignore the first execution of useEffect
useEffectWithoutFirstTime()
```

### Component

**RootContainer** : root wrapper with handled padding of status bar,
you want wrap it again with default background color
```tsx
import React from 'react';
import {RootContainerProps, RootContainer as RootContainerImpl} from 'react-native-common-handy';
import {useColorTheme} from '@theme/index';

export function RootContainer(props: RootContainerProps) {
    const {
        colorTheme: {ui, text, fonts},
    } = useColorTheme()!!!!;
    return <RootContainerImpl backgroundColor={ui.backgroundColor} {...props} />;
}
```

**DarkCancelableContainer** : wrapper with translucence background of black

**AnimationedPopUp** : PopUp component with animation integration.
notice this component is location uncorrelated, you should locate the component by yourself.


### Font Icon
```tsx
<IconFont
  name={'zoo'}
  color={'purple'}
  size={getRealFontsize(38)}
/>
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.


## Development

This project is created by react-native-builder-bob. This library intercept the yarn execution and
instructs yarn to refer to bootstrap script under "/scripts" folder.

So if you just want to install dependencies for development, run "yarn install" install of "yarn" in root.


## License

MIT
