import { HTTPError } from "./HTTPError";

export type PaginationParams = {
    _page?: number;
    _pageSize?: number;
    MAX_PAGE_SIZE: number;
}

export const getPaginationValues = ({ _page, _pageSize, MAX_PAGE_SIZE }: PaginationParams) => {
    // Handle page size first
    let pageSize: number;
    
    if (_pageSize === undefined) {
        pageSize = MAX_PAGE_SIZE;
    } else {
        pageSize = Number(_pageSize);
        if (!Number.isInteger(pageSize) || pageSize < 1) {
            throw new HTTPError({
                message: `Invalid _pageSize value: must be an integer between 1 and ${MAX_PAGE_SIZE}`,
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
    const page = _page === undefined ? 1 : Number(_page);
    if (!Number.isInteger(page) || page < 1) {
        throw new HTTPError({
            message: 'Invalid _page value: must be an integer greater than 0',
            status: 400
        });
    }

    return { page, pageSize };
}
