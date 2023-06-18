export function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return ""
}

export function setCookie(name, value, expdate) {
    document.cookie = `${name}=${value}; expires=${expdate}; path=/`;
}

export function deleteCookie() {
    document.cookie.split(';').forEach(function (c) {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/');
    });
}