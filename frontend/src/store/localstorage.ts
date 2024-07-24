const myStorage: Storage = localStorage;

export function setStorageItem(key: string, value: string) {
    myStorage.setItem(key, value);
}

export function getStorageItem(key: string): string | null {
    return myStorage.getItem(key);
}

export function removeStorageItem(key: string) {
    myStorage.removeItem(key);
}

export function clearStorage() {
    myStorage.clear();
}

export function resetStorage() {
    myStorage.clear();
    setStorageItem("mbUnit", "1024");
    setStorageItem("cacheSize", "2048");
    setStorageItem("systemNotification", "false");
}