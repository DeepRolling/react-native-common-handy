import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import React from 'react';
// @ts-ignore
import customIconConfig from '@assets/selection.json';
import type { IconProps } from 'react-native-vector-icons/Icon';
const IconComponent = createIconSetFromIcoMoon(customIconConfig);

export const IconFont = (props: IconProps) => {
  return <IconComponent {...props} suppressHighlighting={true} />;
};
export const Button = IconComponent.Button;
export const TabBarItem = IconComponent.TabBarItem;
export const TabBarItemIOS = IconComponent.TabBarItemIOS;
export const ToolbarAndroid = IconComponent.ToolbarAndroid;
export const getImageSource = IconComponent.getImageSource;
