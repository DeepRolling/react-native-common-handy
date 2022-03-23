import {
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { horizontalCenter } from '../Layout';

export type DarkCancelableContainerProps = {
  onDismiss: () => void;
  children: any;
  containerStyle?: StyleProp<ViewStyle>;
  withoutContainerClickable?: boolean;
  backgroundColor?: string;
};

/**
 * cancelable container with dark background , can used with non-clickable container
 */
export function DarkCancelableContainer(props: DarkCancelableContainerProps) {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor:
          props.backgroundColor !== undefined
            ? props.backgroundColor
            : 'rgba(0,0,0,0.8)',
      }}
    >
      {props.withoutContainerClickable ? (
        <View
          style={[
            horizontalCenter,
            { flex: 1, width: '100%', height: '100%' },
            props.containerStyle,
          ]}
        >
          {props.children}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={props.onDismiss}>
          <View style={[horizontalCenter, { flex: 1 }, props.containerStyle]}>
            {props.children}
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
