import { Change, diffChars } from "diff";

export function compareHash(userHash: string, genHash: string): HTMLSpanElement {
    const differences: Change[] = diffChars(userHash, genHash);
    const virtualDOM: HTMLSpanElement = document.createElement("span");

    differences.forEach((part: Change) => {
        const span: HTMLSpanElement = document.createElement('span');
        if (part.added) {
            span.style.color = 'red';
        }
        if (part.removed) {
            span.style.textDecoration = 'line-through';
        }
        span.appendChild(document.createTextNode(part.value));
        virtualDOM.appendChild(span);
    });
    return virtualDOM;
}

export function string2Boolean(str: string | null): boolean {
    if (str === null) {
        return true;
    } else {
        switch (str.toLowerCase()) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return true;
        }
    }
}
