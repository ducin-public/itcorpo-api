# Copilot Instructions for ITCorpo API

## File Locations
- OpenAPI Contract: [`contract/openapi.yaml`][openapi-file]
- Server: [`server.ts`][server-file]
- Database: [`database.json`][database-file]
- Config: [`config.json`][config-file]
- Routes: [`routes.json`][routes-file]
- Contract Types: [`contract-types/data-contracts.ts`][data-contracts-file]

## Contract Updates

- When updating [`openapi.yaml`][openapi-file], Copilot will suggest related files that may need updates
- Pay special attention to:
  - Express router files that implement the endpoints (`*.router.ts`)
  - Request/Response type definitions (`*.types.ts`)
  - Validation middleware (`*.middleware.ts`)
- When modifying the contract, check corresponding router files to ensure implementation and documentation are in sync
- Copilot will prompt for confirmation before proceeding with suggested updates
- Review all suggested changes before implementation

## The `package.json` file
- Do not add new dependencies unless explicitly required
- Do not modify npm scripts unless explicitly required

## TypeScript Types
- Do not create new TypeScript types unless explicitly required
- Try to use types from the contracts types file when possible
- When creating functions that process complex logic, add JSDoc `@see {@link <TYPE>}` (e.g. `@see {@link BenefitsSearchCriteria}`), especially when they come from contract types or database

## Express Routes
- Each route handler should be preceded by a comment indicating the HTTP method and path
- Route handler types should use the generated contract types for Request/Response
- Example comment and types:
  ```typescript
  // GET /benefits/services
  router.get('/services', async (
      req: Request<
          Benefits.GetBenefitServices.RequestParams,
          Benefits.GetBenefitServices.ResponseBody,
          Benefits.GetBenefitServices.RequestBody,
          Benefits.GetBenefitServices.RequestQuery
      >,
      res: Response<Benefits.GetBenefitServices.ResponseBody | ErrorResponse>
  ) => {
  ```

## Error logging

In express routes, follow this approach to error logging:

```ts
try {
  ...
} catch (error) {
  handleRouterError({
    error, req, res,
    publicError: 'Failed to ________',
  });
}
  
```

## Tests

- `npm run test:run` runs all Vitest tests in the project. Make sure you DON'T run `npm t` as it runs in watch mode and the agent would hang.
- After making any changes, always run the tests to verify correctness.
- Ensure all tests pass before considering a change complete.

## Conventions

- Separate imports from `node_modules` with local imports with a blank line
- favor `for..of` loop over `[].forEach`
