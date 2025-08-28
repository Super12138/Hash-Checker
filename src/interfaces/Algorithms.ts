export enum Algorithms {
    Unselected,
    MD5,
    SHA1,
    SHA3,
    SHA256,
    SHA384,
    SHA512,
}

export function toAlgorithm(algo: string): Algorithms {
    switch (algo) {
        case "Unselected":
            return Algorithms.Unselected;
        case "MD5":
            return Algorithms.MD5;
        case "SHA1":
            return Algorithms.SHA1;
        case "SHA3":
            return Algorithms.SHA3;
        case "SHA256":
            return Algorithms.SHA256;
        case "SHA384":
            return Algorithms.SHA384;
        case "SHA512":
            return Algorithms.SHA512;
        default:
            return Algorithms.Unselected;
    }
}
