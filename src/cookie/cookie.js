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