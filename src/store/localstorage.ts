import { BuildVariant, STORAGE_AUTO_UPDATE, STORAGE_AUTO_UPDATE_DEFAULT, STORAGE_CACHE_SIZE, STORAGE_CACHE_SIZE_DEFAULT, STORAGE_DYNAMIC_COLOR, STORAGE_DYNAMIC_COLOR_DEFAULT, STORAGE_FIRST_USE, STORAGE_FIRST_USE_DEFAULT, STORAGE_LENGTH_SUGGEST, STORAGE_LENGTH_SUGGEST_DEFAULT, STORAGE_SYSTEM_NOTIFICATION, STORAGE_SYSTEM_NOTIFICATION_DEFAULT } from "../constants";

const myStorage: Storage = localStorage;

/**
 * 将指定的键值对存储到本地存储中
 * 
 * @param key - 存储项的键
 * @param value - 存储项的值
 */
export function setStorageItem(key: string, value: string | number | boolean) {
    myStorage.setItem(key, value.toString());
}

/**
 * 从本地存储中获取指定键的值
 * 
 * @param key - 要获取的存储项的键
 * @param defaultValue - 键不存在时返回的默认值
 * @returns - 指定存储项的值（不存在时返回默认值）
 */
export function getStorageItem(key: string, defaultValue: string | boolean | number): string {
    return myStorage.getItem(key) || defaultValue.toString();
}

/**
 * 从本地存储中删除指定的键
 * 
 * @param key - 要删除的存储项的键
 */
export function removeStorageItem(key: string) {
    myStorage.removeItem(key);
}

/**
 * 清空本地存储中所有的键值对
 */
export function clearStorage() {
    myStorage.clear();
}

/**
 * 初始化本地存储
 */
export function setUpStorage() {
    setStorageItem(STORAGE_FIRST_USE, STORAGE_FIRST_USE_DEFAULT);
    setStorageItem(STORAGE_CACHE_SIZE, STORAGE_CACHE_SIZE_DEFAULT);
    setStorageItem(STORAGE_LENGTH_SUGGEST, STORAGE_LENGTH_SUGGEST_DEFAULT);
    setStorageItem(STORAGE_SYSTEM_NOTIFICATION, STORAGE_SYSTEM_NOTIFICATION_DEFAULT);
    setStorageItem(STORAGE_DYNAMIC_COLOR, STORAGE_DYNAMIC_COLOR_DEFAULT);
    if (VARIANT === BuildVariant.Desktop) setStorageItem(STORAGE_AUTO_UPDATE, STORAGE_AUTO_UPDATE_DEFAULT);
}