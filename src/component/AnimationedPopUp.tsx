import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

export type RefActions = {
  displayComponent: () => void;
  dismissComponent: () => void;
};

function AnimationedPopUp(
  props: { children: any; style?: StyleProp<ViewStyle> },
  ref: Ref<RefActions>
) {
  const opaqueAnimationValue = useRef<Animated.Value>(
    new Animated.Value(0)
  ).current;
  const opaquePlusAnimationRef = useRef<Animated.CompositeAnimation>(
    Animated.timing(opaqueAnimationValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).current;
  const opaqueReduceAnimationRef = useRef<Animated.CompositeAnimation>(
    Animated.timing(opaqueAnimationValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).current;

  const [display, setDisplay] = useState<boolean>(false);

  function displayComponent() {
    setDisplay(true);
    opaquePlusAnimationRef.start();
  }
  function dismissComponent() {
    opaqueReduceAnimationRef.start();
    setTimeout(() => {
      setDisplay(false);
    });
  }

  useImperativeHandle<RefActions, RefActions>(
    // Parameter 1: the ref that is exposed to the parent
    ref,
    // Parameter 2: a function that returns the value of the ref's current property,
    // an object containing the things we're trying to expose (in this case, just
    // one function)
    () => {
      return {
        displayComponent: displayComponent,
        dismissComponent: dismissComponent,
      };
    }
  );

  return display ? (
    <Animated.View
      style={[
        {
          opacity: opaqueAnimationValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
          }),
        },
        props.style,
      ]}
    >
      {props.children}
    </Animated.View>
  ) : null;
}

export const RefedAnimationPopUp = React.forwardRef(AnimationedPopUp);
