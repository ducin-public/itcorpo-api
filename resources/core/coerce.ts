// string numnber | undefined to number | undefined
export const strToNum = (value: string | undefined): number | undefined => {
    return value ? Number(value) : undefined;
}
