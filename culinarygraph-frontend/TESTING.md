# Frontend Testing

## Quick Start

```bash
cd culinarygraph-frontend
npm install
npm test
```

## Commands

| Command | Description |
|---|---|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run in watch mode (re-runs on file save) |

## Test Structure

```
src/
├── test/
│   └── setup.ts                          # Global test setup (@testing-library/jest-dom)
├── App.test.tsx                          # Route rendering (13 tests)
├── shared/
│   ├── components/RelationPicker.test.tsx  # Tag picker component (7 tests)
│   └── hooks/useCatalogIndex.test.ts       # Name→ID lookup hook (5 tests)
└── features/
    ├── catalog/
    │   ├── IngredientListPage.test.tsx     # Filter + auth button (9 tests)
    │   └── TechniqueListPage.test.tsx      # Filter behavior (7 tests)
    └── recipe/
        ├── RecipeListPage.test.tsx         # Filter + duration slider (9 tests)
        └── RecipeFormPage.test.tsx         # Dynamic inputs + submit (15 tests)
```

**Total: 7 test files, 66 tests**

## Stack

- **[Vitest](https://vitest.dev/)** — test runner
- **[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)** — component rendering
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** — user interaction simulation
- **[jsdom](https://github.com/jsdom/jsdom)** — browser environment