import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

export type ContextType<T> =
  | {
      colorTheme: T;
      setColors: Dispatch<SetStateAction<T>>;
    }
  | undefined;

export function injectColorThemeProfile<T>(
  defaultColorValue: T
): [
  React.Context<ContextType<T>>,
  (props: { children: any }) => ReactElement | null,
  () => ContextType<T>
] {
  const ColorThemeContext = createContext<ContextType<T>>(undefined);

  const ColorThemeProvider = function (props: { children: any }) {
    const [colorTheme, setColors] = useState<T>(defaultColorValue); //setting light theme as default

    const value = useMemo(
      () => ({
        colorTheme,
        setColors,
      }),
      [colorTheme, setColors]
    );

    return (
      <ColorThemeContext.Provider value={value}>
        {props.children}
      </ColorThemeContext.Provider>
    );
  };

  const useColorTheme = () => React.useContext(ColorThemeContext)!!;
  return [ColorThemeContext, ColorThemeProvider, useColorTheme];
}
