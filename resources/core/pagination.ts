type PaginationParams = {
    _page?: number;
    _pageSize?: number;
    MAX_PAGE_SIZE: number;
}

export const getPaginationValues = ({ _page, _pageSize, MAX_PAGE_SIZE }: PaginationParams) => {
    const pageSize = Math.min(Number(_pageSize) || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
    if (pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
        throw new Error(`Invalid _pageSize value: must be between 1 and ${MAX_PAGE_SIZE}`);
    }

    const page = _page ? Number(_page) : 1;
    if (page < 1) {
        throw new Error('Invalid _page value: must be greater than 0');
    }

    return { page, pageSize };
}
