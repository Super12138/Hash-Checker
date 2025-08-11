export enum Modes {
    Unselected,
    Check,
    Generate,
}

export function toMode(mode: string): Modes {
    switch (mode) {
        case "Check":
            return Modes.Check;

        case "Generate":
            return Modes.Generate;

        default:
            return Modes.Unselected;
    }
}
