import { HTTPError } from "./HTTPError";

export type PaginationParams = {
    page?: number;
    pageSize?: number;
    MAX_PAGE_SIZE: number;
}

export const getPaginationValues = ({ page: qPage, pageSize: qPageSize, MAX_PAGE_SIZE }: PaginationParams) => {
    // Handle page size first
    let pageSize: number;
    
    if (!qPageSize) {
        pageSize = MAX_PAGE_SIZE;
    } else {
        pageSize = Number(qPageSize);
        if (!Number.isInteger(pageSize) || pageSize < 1) {
            throw new HTTPError({
                message: `Invalid pageSize value: must be an integer between 1 and ${MAX_PAGE_SIZE}`,
                status: 400
            });
        }
        if (pageSize > MAX_PAGE_SIZE) {
            throw new HTTPError({
                message: `Page size cannot exceed ${MAX_PAGE_SIZE}`,
                status: 400
            });
        }
    }

    // Handle page number
    const page = !qPage ? 1 : Number(qPage);
    if (!Number.isInteger(page) || page < 1) {
        throw new HTTPError({
            message: 'Invalid _page value: must be an integer greater than 0',
            status: 400
        });
    }

    return { page, pageSize };
}
