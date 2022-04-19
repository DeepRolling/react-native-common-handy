import {
  CommonActions,
  StackActions,
  DrawerActions,
} from '@react-navigation/native';
import { Keyboard, BackHandler, Platform } from 'react-native';
import React from 'react';

class NavigationHelper {
  private navigator: any;
  private _pushing: boolean;
  private _replacing: boolean;
  private _backTwice: boolean;

  private readonly _backActionMap: {
    [key: string]: () => void;
  };

  public constructor() {
    this._pushing = false;
    this._backTwice = false;
    this._replacing = false;
    this._backActionMap = {};

  }

  public setNavigator(ref: any) {
    this.navigator = ref;
  }

  public toggleDrawer = () => {
    const {dispatch} = this.navigator;
    dispatch(DrawerActions.toggleDrawer());
  };

  /**
   * 导航到另一条路由
   * @param name
   * @param params
   */
  public navigate = (name: string, params?: any) => {
      const {dispatch} = this.navigator;
      dispatch(CommonActions.navigate({name, params}));
  };

  /**
   * 重置路由
   * @param routeName 如果不指定,默认重置回首页, routeName可以是栈中的路由也可以是新的, reset会重新创建该页面
   * @param params 设置参数
   */
  public reset = (routeName = 'home', params?: any) => {
    this.navigator.reset({
      index: 0,
      routes: [{ name: routeName, params: params }],
    });
  };

  /**
   * 返回上一个路由
   */
  public goBack = () => {
    Keyboard.dismiss();
    if (this.navigator.canGoBack) {
      this.navigator.goBack();
    }
  };

  /**
   * 给定路由设置参数
   * @param params
   */
  public setParams = (params: any) => {
    this.navigator.setParams(params);
  };

  /**
   * 替换指定路由
   * @param routeName
   * @param params
   */
  public replace = (routeName: string, params?: any) => {
    if (!this._replacing) {
      this._replacing = true;
      const timer = setTimeout(() => {
        this._replacing = false;
        clearTimeout(timer);
      }, 500);
      Keyboard.dismiss();
      const { dispatch } = this.navigator;
      dispatch(StackActions.replace(routeName, params));
    }
  };

  /**
   * 获取路由里的params
   * @template T
   * @param {*} countBackward index of route you want to get params , count backward , default is one
   * @returns
   * @memberof Navigation
   */
  public getParams = <T = any>(countBackward?: number) => {
    let params;
    const { routes } = this.navigator.getRootState();
    if (routes && routes.length > 0) {
      params =
        routes[
          routes.length - (countBackward !== undefined ? countBackward : 1)
        ].params;
    }
    return params as T;
  };

  /**
   * push进一个新页面
   * @param routeName
   * @param params
   */
  public push = (routeName: string, params?: any) => {
    if (!this._pushing) {
      this._pushing = true;
      const timer = setTimeout(() => {
        this._pushing = false;
        clearTimeout(timer);
      }, 500);
      Keyboard.dismiss();
      const { dispatch } = this.navigator;
      dispatch(StackActions.push(routeName, params));
    }
  };

  /**
   * push a page to stack without timer
   * @param routeName
   * @param params
   */
  public forcePush = (routeName: string, params?: any) => {
    Keyboard.dismiss();
    const { dispatch } = this.navigator;
    dispatch(StackActions.push(routeName, params));
  };

  /**
   * pop退回前n个页面
   */
  public pop = (n = 1) => {
    Keyboard.dismiss();
    const { dispatch } = this.navigator;
    dispatch(StackActions.pop(n));
  };

  /**
   * 退回路由顶层
   */
  public popToTop = () => {
    const { dispatch } = this.navigator;
    dispatch(StackActions.popToTop());
  };

  /**
   * 路由堆栈:popTo
   * @param {string} [routeName='index']
   * @memberof Navigation
   */
  public popTo = (routeName = 'index') => {
    const { index, routes } = this.navigator.getRootState();
    let popNumber;
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.name === routeName) {
        popNumber = index - i;
        break;
      }
    }
    if (popNumber) {
      this.pop(popNumber);
    } else {
      console.warn(`堆栈中没有 ${routeName} 页面`);
      this.navigate(routeName);
    }
  };

  /**
   * 传递自定义返回键处理的方法
   * @param {() => void} action
   */
  public backHandle = (action: () => void) => {
    const { index, routes } = this.navigator.getRootState();
    const routeName = routes[index].name;
    this._backActionMap[routeName] = action;
  };

  /**
   * 返回键处理
   * @returns {boolean}
   */
  public backAction = (): boolean => {
    const { index, routes } = this.navigator.getRootState();
    const routeName = routes[routes.length - 1].name;

    if (index !== 0) {
      // 非最顶层
      if (this._backActionMap[routeName] instanceof Function) {
        Keyboard.dismiss();
        this._backActionMap[routeName]();
      } else {
        this.pop();
      }
      return true;
    } else if (Platform.OS === 'android') {
      if (!this._backTwice) {
        twicePressActionRef.current?.();
        this._backTwice = true;
        const timer = setTimeout(() => {
          this._backTwice = false;
          clearTimeout(timer);
        }, 2000);
        return true;
      } else {
        this._backTwice = false;
        BackHandler.exitApp();
        return false;
      }
    } else {
      this.pop();
    }
    return true;
  };
}

const twicePressActionRef: React.MutableRefObject<(() => void) | null> =
  React.createRef<() => void>();

export function injectTwicePressAction(twicePressAction: () => void) {
  twicePressActionRef.current = twicePressAction;
}
const navigationHelperObject = new NavigationHelper();
export const navigationHelper = navigationHelperObject;
