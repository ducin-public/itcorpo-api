## Refactor Plan: Pagination Logic & Tests

### Problem Summary

- **All but one test in `pagination.spec.ts` fail.**
- Failures affect both valid and invalid test cases.
- The root cause is a mismatch between the test input parameter names (`_page`, `_pageSize`) and the implementation (`page`, `pageSize`).

### Root Cause Analysis

- **Implementation (`pagination.ts`):**
	- Expects `page` and `pageSize` in `PaginationParams`.
	- Uses destructuring: `{ page: qPage, pageSize: qPageSize, MAX_PAGE_SIZE }`.
- **Tests (`pagination.spec.ts`):**
	- Passes `_page` and `_pageSize` in test cases.
	- The implementation ignores these, so `qPage` and `qPageSize` are always `undefined`.
	- As a result, defaults are always used (`page: 1`, `pageSize: MAX_PAGE_SIZE`), causing all valid test cases except the default to fail.
	- Invalid cases do not trigger errors, as the values are not passed to the logic.

### Impacted Components & Dependencies

- **Files:**
	- `resources/core/pagination.ts` (core logic)
	- `resources/core/pagination.spec.ts` (tests)
- **Dependencies:**
	- Any code using `getPaginationValues` with `_page`/`_pageSize` (potentially other routes/utilities).
	- Type definitions for pagination parameters.

### Suggested Refactor Steps

#### 1. **Align Parameter Naming**

- Decide on a single naming convention for pagination parameters:
	- Option A: Use `page` and `pageSize` everywhere (recommended for consistency).
	- Option B: Support both `page`/`pageSize` and `_page`/`_pageSize` (for backward compatibility).

#### 2. **Update Implementation**

- Refactor `getPaginationValues` to accept both naming conventions, or update to match the test input.
- Example: 
	```typescript
	const page = params.page ?? params._page ?? 1;
	const pageSize = params.pageSize ?? params._pageSize ?? MAX_PAGE_SIZE;
	```
- Update type definitions accordingly.

#### 3. **Update Tests**

- Ensure test cases use the correct parameter names matching the implementation.
- If supporting both conventions, add tests for both.

#### 4. **Review Usage Across Codebase**

- Search for all usages of `getPaginationValues` and ensure parameter names are consistent.
- Update route handlers, utilities, and any other consumers.

#### 5. **Improve Error Handling**

- Ensure all edge cases (negative, zero, non-integer, exceeding max) are covered and tested.

#### 6. **Documentation**

- Update JSDoc and README to clarify expected parameter names and behavior.

#### 7. **Re-run Tests**

- After refactor, run all tests to confirm correctness.

### Open Questions / Clarifications Needed

- Should backward compatibility with `_page`/`_pageSize` be maintained?
- Are there external consumers (e.g., frontend, API clients) relying on the old naming?
- Is there a contract (OpenAPI) specifying parameter names?

### Risk Analysis

- **Low risk** if only internal usage and tests are updated.
- **Medium risk** if external clients rely on `_page`/`_pageSize`—may require API contract update and communication.
- **Mitigation:** Add support for both naming conventions if unsure, then deprecate old names after migration.

---

**Summary:**  
The main issue is a parameter naming mismatch between tests and implementation. The plan is to standardize parameter names, update logic and tests, review all usages, and document the changes. Confirm with stakeholders if backward compatibility is required.
