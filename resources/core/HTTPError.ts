type HTTPErrorParams = {
    message: string;
    status: number;
}

export class HTTPError extends Error {
    readonly status: number;

    constructor({ message, status }: HTTPErrorParams) {
        super(message);
        this.status = status;
    }
}
