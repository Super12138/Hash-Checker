let tempText;
let totalTime;

export function sendText(text, only) {
    if (only === "true") {
        totalTime = text;
    } else {
        tempText = text;
    }
}

export function getText(only) {
    return (only === "true") ? totalTime : tempText;
}