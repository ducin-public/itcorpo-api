import { randomUUID } from "crypto"

export const getErrorGUID = () => {
    return randomUUID();
}
