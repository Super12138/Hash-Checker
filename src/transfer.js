let temptext
let totalTime

export function sendtext(text, only) {
    if (only == "true") {
        totalTime = text
    } else {
        temptext = ""
        temptext = text
    }
}

export function gettext(only) {
    if (only == "true") {
        return totalTime
    } else {
        return temptext
    }
}