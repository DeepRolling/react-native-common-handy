import {isHaveChineseChars} from '../string';


export const determineValidPhoneEmail = (phoneEmail: string) => {
  return checkPhoneEmail(phoneEmail)[1] as boolean;
};

/**
 * 校验手机号和邮箱
 * @param {string} account, 手机号或邮箱
 * @return [accountType, isLegal]
 */
export default function checkPhoneEmail(account: string) {
    // const phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
    let phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (account.indexOf('@') === -1) {
        if (phoneReg.test(account)) {
            return ['phone', true];
        } else {
            return ['phone', false];
        }
    } else {
        if (emailReg.test(account)) {
            return ['email', true];
        } else {
            return ['email', false];
        }
    }
}

/**
 * 校验手机号是否合法
 * @param phone 手机号
 */
export function checkPhoneNumber(phone: string) {
    //验证电话号码手机号码，包含至今所有号段? ?
    let regex = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    return regex.test(phone) && !isHaveChineseChars(phone);
}

/**
 * 校验验证码是否合法,只能是4位0-9
 * @param verifyCode 验证码
 */
export function checkVerifyCode(verifyCode: string | undefined) {
    if (verifyCode === undefined) {
        return false;
    }
    //验证电话号码手机号码，包含至今所有号段? ?
    let regex = /^[0-9]{4}$/;
    return regex.test(verifyCode) && !isHaveChineseChars(verifyCode);
}

export const INVALID_NEW_PASSWORD_NOTICE = '新密码长度须在8-16位，且至少包含数字和字母两种字符';
export const INVALID_NEW_PASSWORD_EXCEED = '新密码长度须在8-16位，且不能包含中文字符与特殊字符';
export const INVALID_PASSWORD_INPUT = '密码不能包含中文字符';

/**
 * 检查设置的新密码合法性
 * @param password
 */
export function checkNewPassword(password: string | undefined) {
    return password && password.length >= 8 && password.length <= 16 && !isHaveChineseChars(password) && hasLetter(password) && hasDigit(password);
}

const letter = new RegExp('[A-Za-z]+');

export function hasLetter(value: string) {
    return letter.test(value);
}

const digit = /[0-9]/;

export function hasDigit(value: string) {
    return digit.test(value);
}

/**
 * 脱敏手机号
 * @param phone
 */
export function desensitizationPhoneNumber(phone: string) {
    if (phone === undefined) {
        return '';
    }
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4);
}
