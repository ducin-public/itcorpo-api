import { HTTPError } from "./HTTPError";


export type PaginationParams = {
    page?: number;
    pageSize?: number;
    MAX_PAGE_SIZE: number;
}


export const getPaginationValues = (params: PaginationParams) => {
    const { page, pageSize, MAX_PAGE_SIZE } = params;

    // Coerce to number if string
    const pageNum = page !== undefined ? Number(page) : undefined;
    const pageSizeNum = pageSize !== undefined ? Number(pageSize) : undefined;

    // Determine page size
    let resolvedPageSize: number;
    if (pageSizeNum == null) {
        resolvedPageSize = MAX_PAGE_SIZE;
    } else {
        if (!Number.isInteger(pageSizeNum) || pageSizeNum < 1) {
            throw new HTTPError({
                message: `Invalid pageSize value: must be an integer between 1 and ${MAX_PAGE_SIZE}`,
                status: 400
            });
        }
        if (pageSizeNum > MAX_PAGE_SIZE) {
            throw new HTTPError({
                message: `Page size cannot exceed ${MAX_PAGE_SIZE}`,
                status: 400
            });
        }
        resolvedPageSize = pageSizeNum;
    }

    // Determine page number
    let resolvedPage: number;
    if (pageNum == null) {
        resolvedPage = 1;
    } else {
        if (!Number.isInteger(pageNum) || pageNum < 1) {
            throw new HTTPError({
                message: 'Invalid page value: must be an integer greater than 0',
                status: 400
            });
        }
        resolvedPage = pageNum;
    }

    return { page: resolvedPage, pageSize: resolvedPageSize };
}
