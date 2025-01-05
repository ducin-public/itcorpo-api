const round = (prec: number) =>
    (v: number) => {
        let power = 10 ** prec;
        return Math.round(power * v) / power;
    }

export const roundTo2 = round(2)
export const roundTo3 = round(3)
export const roundTo4 = round(4)

export const upperRoundTo2 = round(-2)
export const upperRoundTo3 = round(-3)
export const upperRoundTo4 = round(-4)

export const probability = (n: number) => Math.random() < n
