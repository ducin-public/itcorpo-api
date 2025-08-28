## Solution Plan: Fix Failing Employees Data Operations & Router Tests

### Problem Summary

- Multiple test failures in:
  - `resources/employees-data-operations.spec.ts` (mergeWithDepartment)
  - `resources/employees.router.spec.ts` (pagination and validation logic)
- Failures affect both data merging and API pagination/validation scenarios.

---

### Root Cause Analysis

#### 1. **employees-data-operations.spec.ts**
- **Failing Test:** `mergeWithDepartment should merge employee with department data`
- **Likely Cause:**  
  - The `mergeWithDepartment` function does not correctly assign the department name to the merged employee object.
  - Possible issues:
    - Department lookup by `departmentId` fails (e.g., mismatch, missing, or wrong property).
    - The merged result does not include a `department` property or assigns it incorrectly.

#### 2. **employees.router.spec.ts**
- **Failing Tests:** All pagination/validation edge cases except the default.
- **Likely Causes:**
  - The route handler for `GET /employees` does not correctly handle query parameters for pagination:
    - Uses wrong parameter names (`page`, `pageSize` vs. `_page`, `_pageSize`).
    - Does not validate or reject invalid values (negative, NaN, exceeding max).
    - Always returns default page/size, so edge cases do not trigger expected errors.
  - The implementation may not match the contract or test expectations for error handling.

---

### Impacted Components & Dependencies

- `resources/employees-data-operations.ts` (merge logic)
- `resources/employees.router.ts` (route handler, pagination, validation)
- Possibly: contract types, zod schemas, database mock data
- Tests: `employees-data-operations.spec.ts`, `employees.router.spec.ts`

---

### Suggested Refactor Steps

#### 1. **Fix mergeWithDepartment Logic**
- Review and update `mergeWithDepartment` to:
  - Correctly find the department by `departmentId`.
  - Assign the department name to the merged employee object as `department`.
  - Add/adjust unit tests for edge cases (missing department, invalid id).

#### 2. **Align Pagination Parameter Handling**
- In `employees.router.ts`:
  - Accept both `_page`/`_pageSize` and `page`/`pageSize` for query params (for compatibility).
  - Use fallback logic:
    ```typescript
    const page = req.query.page ?? req.query._page ?? 1;
    const pageSize = req.query.pageSize ?? req.query._pageSize ?? DEFAULT_PAGE_SIZE;
    ```
  - Validate values:
    - Reject negative, zero, NaN, or exceeding max page size with 400.
    - Return empty array for out-of-range pages.

#### 3. **Improve Error Handling**
- Ensure all invalid input cases return 400 with a clear error message.
- Use the error logging pattern from project conventions.

#### 4. **Update Tests if Needed**
- If parameter names are changed, update tests to match.
- Add tests for both naming conventions if supporting both.

#### 5. **Review Contract & Types**
- Check OpenAPI contract and zod schemas for expected parameter names and validation.
- Update documentation and types for clarity.

#### 6. **Re-run Tests**
- After refactor, run all tests to confirm fixes.

---

### Open Questions / Clarifications Needed

- Should both `_page`/`_pageSize` and `page`/`pageSize` be supported, or only one?
- Is there a contract or frontend dependency on parameter naming?
- Should missing departments in merge logic throw, warn, or assign a default value?

---

### Risk Analysis

- **Low risk** for internal refactor if only logic and tests are updated.
- **Medium risk** if API contract or external clients depend on current parameter names.
- **Mitigation:** Support both conventions, communicate changes, update contract if needed.

---

## Summary Table

| Area                        | Issue                                   | Solution Step                |
|-----------------------------|-----------------------------------------|------------------------------|
| Data merge                  | Department not assigned correctly       | Fix mergeWithDepartment      |
| Pagination                  | Wrong/ignored query param names         | Accept both param styles     |
| Validation                  | Invalid values not rejected             | Add validation, error logic  |
| Tests                       | Failures due to above issues            | Update logic/tests           |
| Contract/types              | Possible mismatch                       | Review & update as needed    |

---

**Next Steps:**  
- Refactor merge logic and pagination handling as above.
- Validate against contract/types.
- Confirm with stakeholders on parameter naming.
- Re-run and verify all tests.
