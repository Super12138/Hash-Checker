const myStorage: Storage = localStorage;

/**
 * 将指定的键值对存储到本地存储中
 * 
 * @param {string} key - 存储项的键
 * @param {string} value - 存储项的值
 */
export function setStorageItem(key: string, value: any) {
    myStorage.setItem(key, value.toString());
}

/**
 * 从本地存储中获取指定键的值
 * 
 * @param {string} key - 要获取的存储项的键
 * @param {string} defaultValue - 键不存在时返回的默认值
 * @returns {string} - 指定存储项的值（不存在时返回默认值）
 */
export function getStorageItem(key: string, defaultValue: any): string {
    return myStorage.getItem(key) || defaultValue.toString();
}

/**
 * 从本地存储中删除指定的键
 * 
 * @param {string} key - 要删除的存储项的键
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
    setStorageItem("firstUse", false);
    setStorageItem("cacheSize", 2048);
    setStorageItem("lengthSuggest", true);
    setStorageItem("systemNotification", false);
    if (VARIANT === 'desktop') setStorageItem("autoUpdate", true);
}