import { DependencyList, useEffect, useRef } from 'react';

/**
 * similar as {@link useEffect} but the first time effect will never execute
 */
export function useEffectWithoutFirstTime(
  effect: any,
  clearFunc?: any,
  inputs?: DependencyList
) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      effect();
      if (clearFunc !== undefined) {
        return clearFunc;
      }
    } else {
      didMountRef.current = true;
    }
  }, inputs); //eslint-disable-line react-hooks/exhaustive-deps
}
