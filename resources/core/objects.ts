export const stripObjectProps = <TObject extends object, TKey extends keyof TObject>(obj: TObject, key: TKey[]): Omit<TObject, TKey> => {
    const copy = { ...obj };
    key.forEach(k => delete copy[k]);
    return copy;
}
