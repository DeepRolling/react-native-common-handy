import { View } from 'react-native';
import React from 'react';
import { STATUSBAR_PADDING_FOR_NEED } from '../Layout';

export type RootContainerProps = {
  children: any;
  backgroundColor?: string;
  needAutoPadding?: boolean;
};

/**
 * 全屏带沉浸式状态栏的页面容器，已经自动处理好状态栏的高度
 * 所以子组件用该容器写页面按照设计图上不要加状态栏高度
 * @param props 当前页面的背景色，该背景色会被用于沉浸式状态栏,是否需要padding
 * @constructor
 */
export function RootContainer(props: RootContainerProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.backgroundColor,
        paddingTop: props.needAutoPadding ? STATUSBAR_PADDING_FOR_NEED : 0,
      }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: props.backgroundColor,
        }}
      >
        {props.children}
      </View>
    </View>
  );
}

RootContainer.defaultProps = {
  needAutoPadding: false,
  backgroundColor: '#ffffff',
};
