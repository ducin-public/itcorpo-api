export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))