export const isValidJson = (json: string) => {
    try {
        JSON.parse(json);
        return true
    } catch {
        return false;
    }
};

export const jsonEquals = (first: string, second: string) => {
    return (
        isValidJson(first) &&
        isValidJson(second) &&
        JSON.stringify(JSON.parse(first)) === JSON.stringify(JSON.parse(second))
    );
};

export const formatJson = (json: string): string => {
    return JSON.stringify(JSON.parse(json), null, 2)
}

export const toFormattedJson = (value: object): string => {
    return JSON.stringify(value, null, 2);
}
