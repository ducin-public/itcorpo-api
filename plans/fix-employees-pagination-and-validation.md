# Fix `/employees` Pagination and Validation

## Problem Summary
Three tests for the `/employees` endpoint are failing due to incorrect handling of pagination and validation logic:
1. Requesting a page beyond available data (e.g., `page=100`) should return `200 OK` with an empty array.
2. Requesting a page size greater than the allowed maximum (e.g., `pageSize=100`, max allowed is 50) should return `400 Bad Request`.
3. Requesting a negative page (e.g., `page=-1`) should return `400 Bad Request`.

## Root Cause Analysis
- The route implementation does not properly validate `page` and `pageSize` query parameters.
- Requests with invalid values (negative page, too large pageSize) are not rejected with `400 Bad Request`.
- Requests for pages beyond available data do not return an empty array as expected.

## Impacted Components
- `resources/employees.router.ts` (main route handler for `/employees`)
- Any shared pagination utility or validation middleware (if used)

## Dependencies
- Contract types for request/response validation (from `contract-types/data-contracts.ts`)
- Employee data source (likely from `database/employees.json` or similar)

## Suggested Refactor Steps
1. **Locate the `/employees` route handler** in `employees.router.ts`.
2. **Add validation logic** for `page` and `pageSize`:
   - If `page < 1` or not a number, respond with `400 Bad Request`.
   - If `pageSize > 50` or not a number, respond with `400 Bad Request`.
3. **Handle requests for pages beyond available data**:
   - If the requested page is valid but there are no results, return `200 OK` with an empty array.
4. **Ensure error responses use the standard error handler** (`handleRouterError`), as per project conventions.
5. **Test the implementation** by running the affected tests to confirm all pass.

## Open Questions / Clarifications
- Is there a shared validation middleware for query parameters, or should validation be done inline in the route handler?
- Should the error response body follow a specific contract (e.g., include an error code/message)?

## Risk Analysis
- Low risk: Changes are isolated to query parameter validation and pagination logic.
- Ensure no regression for other pagination scenarios (e.g., default page/pageSize).

# Notes

use MAX_PAGE_SIZE instead of hardcoded 50.