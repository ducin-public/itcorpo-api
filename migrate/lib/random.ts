export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

export const randomFromArray = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

// [0.2] -> [0.2, 0.45] -> [0.2, 0.45, 0.73] -> [0.2, 0.45, 0.73, 1]
const progressiveSum = (list: number[]) => list
  .reduce(({sum, items}, item) =>
    ({ sum: sum + item, items: [...items, sum + item] }), { sum: 0, items: [] as number[] })
  .items

type WeightedRandomMap = {
  [value: string]: number;
}
export const weightedRandom = (randomMap: WeightedRandomMap) => {
  const pSum = progressiveSum(Object.values(randomMap))
  const totalSum = pSum[pSum.length - 1]
  return () => {
    const rand = Math.random() * totalSum
    const idx = pSum.findIndex(partialSum => rand <= partialSum)
    return Object.keys(randomMap)[idx]
  }
}