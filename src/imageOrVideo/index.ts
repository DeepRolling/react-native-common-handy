import ImagePicker, {Image, ImageOrVideo, Options, Video} from 'react-native-image-crop-picker';
import {isAndroid, showToast} from "react-native-common-handy";
// @ts-ignore
import * as R from 'ramda';


export function stripIosImagePickerResultPath(result: ImageOrVideo | Image) {
    if (!isAndroid) {
        let localPath = result.path;
        if (result.mime && result.mime.toLowerCase().indexOf('video/') !== -1) {
            localPath = localPath.replace('file://', '');
        }
        result.path = localPath;
    }
    return result;
}

export type OpenCameraParams = {
    cropSize?: {width: number; height: number};
    maxMb?: number;
};
/**
 * open camera and select a picture
 * for custom localization text : https://github.com/ivpusic/react-native-image-crop-picker/issues/813
 * @param params
 */
export function openCamera(params: OpenCameraParams) {
    const {cropSize, maxMb} = params;
    return new Promise<Image>((resolve, reject) => {
        let cameraOpenOptions: Options = {
            mediaType: 'photo',
            includeBase64: true,
            forceJpg: true,
            cropperChooseText: '确定',
            cropperCancelText: '取消',
            loadingLabelText: '加载中',
        };
        if (cropSize !== undefined) {
            cameraOpenOptions.cropping = true;
            cameraOpenOptions.width = cropSize.width;
            cameraOpenOptions.height = cropSize.height;
        }
        ImagePicker.openCamera(cameraOpenOptions)
            .then((image: ImageOrVideo) => {
                image = stripIosImagePickerResultPath(image);
                if (maxMb !== undefined) {
                    if (generateByteOverFunction(maxMb)(image.size)) {
                        showOverSizeToast(image, maxMb.toString());
                        reject();
                        return;
                    }
                } else {
                    if (bytesOver10M(image.size)) {
                        showOverSizeToast(image, '10');
                        reject();
                        return;
                    }
                }
                resolve(image);
            })
            .catch(() => {
                //Error: User cancelled image selection
                // console.log('open camera error : ' + message);
            });
    });
}

export type OpenAlbumParams = {
    cropSize?: {width: number; height: number};
    multiple?: boolean;
    /**
     * max size(unit mb) of selected image (only useful in no-multiple mode)
     */
    maxMb?: number;
    /**
     * media type user want to select
     */
    mediaType?: 'any' | 'video' | 'photo';
};

/**
 * open album and select a picture
 * @param params
 */
export function openAlbum(params: OpenAlbumParams) {
    const {cropSize, maxMb, mediaType, multiple} = params;
    return new Promise<Image | Image[] | ImageOrVideo | ImageOrVideo[]>((resolve, reject) => {
        let cameraOpenOptions: Options = {
            mediaType: 'photo',
            includeBase64: true,
            forceJpg: true,
            cropperChooseText: '确定',
            cropperCancelText: '取消',
            loadingLabelText: '加载中',
        };
        if (mediaType !== undefined) {
            // @ts-ignore
            cameraOpenOptions.mediaType = mediaType;
        }
        if (cropSize !== undefined) {
            cameraOpenOptions.cropping = true;
            cameraOpenOptions.width = cropSize.width;
            cameraOpenOptions.height = cropSize.height;
        }
        if (multiple !== undefined) {
            cameraOpenOptions.multiple = multiple;
        }
        ImagePicker.openPicker(cameraOpenOptions)
            .then((image: any) => {
                if (multiple) {
                    // @ts-ignore
                    image = (image as ImageOrVideo[]).map(value => {
                        value = stripIosImagePickerResultPath(value);
                        return value;
                    });
                } else {
                    image = stripIosImagePickerResultPath(image);
                }
                if (!multiple) {
                    //if not multiple (only one picture) , determine file size
                    if (maxMb !== undefined) {
                        if (generateByteOverFunction(maxMb)(image.size)) {
                            showOverSizeToast(image, maxMb.toString());
                            reject();
                            return;
                        }
                    } else {
                        if (bytesOver10M(image.size)) {
                            showOverSizeToast(image, '10');
                            reject();
                            return;
                        }
                    }
                }
                resolve(image);
            })
            .catch(() => {
                //Error: User cancelled image selection
                // console.log('open camera error : ' + message);
            });
    });
}

function byteOverSize(limitBytes: number, size: number) {
    return size > limitBytes;
}

export const curriedByteOverSize = R.curry<(limitBytes: number, size: number) => boolean>(byteOverSize);

/**
 * the biggest size is 10 mb(ps : 过大加载base64的时候会在android上引发异常)
 */
export const bytesOver10M = curriedByteOverSize(10 * 1000000);

export function generateByteOverFunction(maxMb: number) {
    return curriedByteOverSize(maxMb * 1000000);
}

/**
 * the biggest size is 500 mb
 */
export const bytesOver500M = curriedByteOverSize(500 * 1000000);

export function showOverSizeToast(imageOrVideoValue: ImageOrVideo, sizeInM: string) {
    showToast(readableNameOfMedia(imageOrVideoValue) + '体积不能超过' + sizeInM + 'M');
}

export function readableNameOfMedia(imageOrVideoValue: ImageOrVideo) {
    return isAndroid
        ? normallyExtractFileNameFromUri(imageOrVideoValue.path)
        : imageOrVideoValue.filename === null
        ? normallyExtractFileNameFromUri(imageOrVideoValue.path)
        : imageOrVideoValue.filename;
}

/**
 * determine two media if is same one
 * @param firstMedia
 * @param secondMedia
 */
export function sameMedia(firstMedia: ImageOrVideo, secondMedia: ImageOrVideo) {
    return mediaIdentify(firstMedia) === mediaIdentify(secondMedia);
}

/**
 * generate current media identify
 * @param media
 */
export function mediaIdentify(media: ImageOrVideo) {
    return isAndroid ? media.path : media.localIdentifier;
}

/**
 * strip suffix form file name and return file name striped
 * @param fileName
 */
export function stripSuffix(fileName: string) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
}

/**
 * return the suffix of file name (include dot)
 * @param fileName
 */
export function truncateSuffix(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.'));
}

/**
 * get the base64 format with this image , used to display in Image component
 * @param image
 */
export const imageLoadUri = (image: Image) => {
    return `data:${image.mime};base64,${image.data}`;
};

/**
 * determine current object if a video
 * @param imageOrVideo
 */
export function isVideo(imageOrVideo: ImageOrVideo) {
    return typeof (imageOrVideo as Video).duration === 'number';
}

/**
 * 该函数用于从uri中截取文件名 , simple :
 * from : file:///data/user/0/com.dianvo.ykd.app/cache/react-native-image-crop-picker/Screenshot_2020-10-20-00-14-12-600_com.taobao.taobao.jpg
 * result : Screenshot_2020-10-20-00-14-12-600_com.taobao.taobao.jpg
 */
export function normallyExtractFileNameFromUri(url: string): string {
    let splitArray = url.split('/');
    return splitArray[splitArray.length - 1];
}

/**
 * 该函数用于从url中截取文件名 , simple :
 * from : https://res.yikeduo.com/DOC/5/23/368051540618514432_0.pdf?md5hash=2be59bca9c09d1413052683222e93c18×tamp=1602490018
 * result : 368051540618514432_0.pdf
 */
export function normallyExtractFileNameFromUrl(url: string): string {
    let splitArray = url.split('/');
    let fileName = splitArray[splitArray.length - 1];
    if (!fileName.includes('?')) {
        return fileName;
    }
    let fileNameArray = fileName.split('?');
    return fileNameArray[0];
}
