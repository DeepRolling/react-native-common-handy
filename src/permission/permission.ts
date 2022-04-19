import {
    request,
    RESULTS,
    Permission,
    PERMISSIONS,
    checkNotifications,
    checkLocationAccuracy,
    requestLocationAccuracy,
} from 'react-native-permissions';
import {isAndroid} from "react-native-common-handy";


export function requestCameraPermission(fun: () => void, onNeedManualOpen: () => void) {
    requestPermission(isAndroid ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA, fun, onNeedManualOpen);
}

export function requestLocationPermission(fun: () => void, onNeedManualOpen: () => void) {
    requestPermission(isAndroid ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, fun, onNeedManualOpen);
}

export function requestNotificationPermission(fun: () => void, onNeedManualOpen: () => void) {
    checkNotifications().then(value => {
        if (value.status === RESULTS.BLOCKED) {
            onNeedManualOpen();
        } else {
            fun();
        }
    });
}

export function checkNotificationPermission() {
    return new Promise<boolean>(resolve => {
        checkNotifications().then(value => {
            resolve(value.status !== RESULTS.BLOCKED);
        });
    });
}

export function checkFullAccuracyLocationPermission() {
    return new Promise<boolean>((resolve, reject) => {
        checkLocationAccuracy()
            .then(value => {
                resolve(value === 'full');
            })
            .catch(reason => {
                reject(reason);
            });
    });
}

export function requestFullAccuracyLocationPermission() {
    return new Promise<boolean>((resolve, reject) => {
        requestLocationAccuracy({
            purposeKey: 'getssid',
        })
            .then(value => {
                resolve(value === 'full');
            })
            .catch(reason => {
                reject(reason);
            });
    });
}

export function requestPhotoPermission(fun: () => void, onNeedManualOpen: () => void, iosLimitOperate?: () => void) {
    if (isAndroid) {
        requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, fun, onNeedManualOpen);
    } else {
        requestPermission(PERMISSIONS.IOS.PHOTO_LIBRARY, fun, onNeedManualOpen, iosLimitOperate);
    }
}

export function requestPermission(permission: Permission, success: () => void, onNeedManualOpen: () => void, iosLimitOperate?: () => void) {
    if (isAndroid) {
        request(permission).then(result => {
            if (result === 'denied') {
                //represent user refuse the permission
                onNeedManualOpen();
            } else if (result === 'blocked') {
                //represent user block the permission
                onNeedManualOpen();
            } else {
                success();
            }
        });
    } else {
        checkIOSPermission(
            permission,
            _ => {
                onNeedManualOpen();
            },
            success,
            () => {
                onNeedManualOpen();
            },
            () => {
                iosLimitOperate?.();
            },
        );
    }
}

export function checkIOSPermission(
    permission: Permission,
    onMessage: (info: string) => void,
    onGranted: () => void,
    onBlocked: () => void,
    iosLimitOperate: () => void,
) {
    request(permission)
        .then(result => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    onMessage('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    onMessage('The permission has not been requested / is denied but requestable');
                    break;
                case RESULTS.LIMITED:
                    iosLimitOperate();
                    break;
                case RESULTS.GRANTED:
                    onGranted();
                    break;
                case RESULTS.BLOCKED:
                    onBlocked();
                    break;
            }
        })
        .catch(error => {
            onMessage(error);
        });
}
