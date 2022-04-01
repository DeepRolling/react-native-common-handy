export function omitStringByLength(value: string, limitLength: number) {
  return value.length > limitLength
    ? value.substr(0, limitLength) + '...'
    : value;
}

const chinesePattern = new RegExp('[\u4E00-\u9FA5]+');

/**
 * 判断是否含有中文字符
 * @param value
 */
export function isHaveChineseChars(value: string) {
  return chinesePattern.test(value);
}

const specialCharPatternOne = /[`~!@#$%^&*()_+\-<>?:"{},.\/\\;'[\]]/im;
const specialCharPatternTwo = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
/**
 * 判断是否含有特殊字符
 * @param value
 */
export function isHaveSpecialChars(value: string) {
  return specialCharPatternOne.test(value) || specialCharPatternTwo.test(value);
}

/**
 * determine a string if have blank char.
 * ref : https://www.w3school.com.cn/jsref/jsref_regexp_whitespace_non.asp
 * https://stackoverflow.com/questions/17616624/detect-if-string-contains-any-spaces
 * @param value
 */
export function hasBlankChar(value: string) {
  if (value.length === 0) {
    return false;
  }
  console.log('each judge string is : ' + value);
  return /\s/.test(value);
}

/**
 * 判断一个东西是不是一个json
 * @param something
 */
export function isJSON(something: any) {
  //some test
  // console.log('test1' + isJSON('fubdsvyubabiu{fsdbfuei'));//malformed json
  // console.log('test2' + isJSON(JSON.stringify({a: 3, b: [{name: '1'}]})));//valid json object
  // console.log('test2' + isJSON(JSON.stringify([{name: '1'}])));//valid json array
  // console.log('test3' + isJSON({a: 3, b: [{name: '1'}]}));//valid object
  if (typeof something === 'string') {
    try {
      let obj = JSON.parse(something);
      //这里解析出来可能是一个object也可能是一个array，都是合法的json形式
      return !!((typeof obj === 'object' && obj) || Array.isArray(obj));
    } catch (e) {
      return false;
    }
  } else {
    //针对传入的json已经是一个对象...对象永远都是string,所以只需要判断是否是null和undefined
    return something !== null && something !== undefined;
  }
}

/**
 * place the replaceString in parent center and let other char in parentString blank
 * @param parentString
 * @param replaceString
 */
export function replaceStringInCenter(
  parentString: string,
  replaceString: string
) {
  console.log(replaceString);
  let subStringArray = parentString.split('');
  let replaceStringArray = replaceString.split('');
  let startPosition = (subStringArray.length - replaceStringArray.length) / 2;
  for (let i = 0; i < startPosition; i++) {
    subStringArray[i] = ' ';
  }
  replaceStringArray.forEach((value) => {
    subStringArray[startPosition] = value;
    startPosition += 1;
  });
  for (let i = startPosition; i < subStringArray.length; i++) {
    subStringArray[i] = ' ';
  }
  return subStringArray.join('');
}

/**
 * 检测传入的东西是否是合格的字符串，长度大于0且不为null
 * @param someString 需要检测的string
 */
export function checkString(someString: string | undefined | null) {
  if (someString === undefined || someString === null) {
    return false;
  }
  someString = someString.trim();
  return someString && someString.length > 0;
}

/**
 * 带长度限制的字符串合格性检查
 * @param someString
 * @param minLength
 * @param maxLength
 */
export function checkStringWithLimit(
  someString: string,
  minLength: number,
  maxLength: number
) {
  if (someString === undefined || someString === null) {
    return false;
  }
  someString = someString.trim();
  return someString.length >= minLength && someString.length <= maxLength;
}

const letter = new RegExp('[A-Za-z]+');

/**
 * 如果被检查的字符属于其中一种，那么是有效的
 * 一般用于判断搜索字符串是否合法（是否包含特殊字符）
 * @param value
 */
export function checkChCharLetterDigit(value: string) {
  if (value.length > 1) {
    throw Error('invalid char');
  }
  let digit = /[0-9]/;
  return isHaveChineseChars(value) || letter.test(value) || digit.test(value);
}

export function hasEnglishChars(value: string) {
  return letter.test(value);
}

/**
 * 10进制数组转换成16进制字符串
 * @param {*} arr
 */
export function bytes2HexString(arr: any[]) {
  let str = '';
  let _arr = arr;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < _arr.length; i++) {
    let hex = _arr[i].toString(16).toUpperCase();
    if (hex.length === 1) {
      hex = '0' + hex;
    }
    str += hex;
  }
  return str;
}

/**
 * 将字符串转换成Uint8Array
 * @param {*} str
 */
export function str2Uint8Array(str: string) {
  if (str.length % 2 !== 0) {
    console.log('字符串必须是2的倍数');
    return '';
  }
  const len = str.length / 2;
  const u8array = new Uint8Array(len);
  for (let i = 0, j = 0; i < str.length; i = i + 2, j += 1) {
    u8array[j] = parseInt(str.substr(i, 2), 16);
  }
  return u8array;
}
