### Repo overview

- This is an Expo + React Native app using Expo Router (file-based routing). Main app code lives in the `app/` folder. Key entry points:
  - `App.tsx` and `app/_layout.tsx` — root layout and router stack.
  - `app/(tabs)/_layout.tsx` — tab layout that registers `index`, `categories`, `search`, `cart`, `profile` tabs.
  - Screens are plain React components under `app/` (e.g. `app/cart.tsx`, `app/product/[id].tsx`, `app/checkout.tsx`).

### Big-picture architecture

- File-based routing: create a file under `app/` to add a route. Files inside `app/(tabs)/` become tab screens; other top-level files are stack screens. See `app/(tabs)/_layout.tsx` for Tab configuration and `App.tsx` for the root Stack.
- Styling: uses inline StyleSheet objects (React Native `StyleSheet.create`). Follow existing file patterns (e.g. `app/cart.tsx`) for layout and colors.
- State: most screens use local component state (useState). There is no global store in the starter — add context or Redux/MobX if you need cross-screen cart persistence.

### Navigation and routes (important)

- Use `expo-router`'s `useRouter()` and `useLocalSearchParams()` where needed. Navigation is file-path based: e.g. `router.push('/cart')` goes to `app/cart.tsx`.
- Generated router types may lag until the packager restarts. If TypeScript complains about a path (e.g. `/checkout`) you can:
  - Add the target screen file under `app/` (we added `app/checkout.tsx`), or
  - Temporarily cast the path to any: `router.push('/checkout' as any)` to bypass generated typing until types regenerate.

Examples from repo:

- Add to cart: `app/product/[id].tsx` calls `router.push('/cart' as any)` after adding an item.
- Checkout navigation: `app/cart.tsx` navigates to checkout with `router.push('/checkout')` (or cast to `any` when types are stale).

### Developer workflows (commands)

- Install dependencies: `npm install`
- Start Metro/Expo dev server: `npm start` (alias `npx expo start`)
- Platform quick runs:
  - Android emulator: `npm run android`
  - iOS simulator: `npm run ios`
  - Web: `npm run web`
- Reset starter template: `npm run reset-project` (moves starter code to `app-example` and creates a fresh `app/`).

### Project-specific conventions

- File-based routing: use `app/` structure and group platform features into folders. For tab screens, use `app/(tabs)/`.
- Keep screens as default exports. Example: `export default function CartScreen() { ... }` in `app/cart.tsx`.
- Use `Ionicons` from `@expo/vector-icons` for icons (see `app/cart.tsx` and `app/product/[id].tsx`).
- Styling: prefer compact StyleSheet objects defined at the bottom of each screen file.
- Type definitions: `types/navigation.ts` declares `RootStackParamList` but `expo-router` also generates `.expo/types/router.d.ts`. When adding new top-level routes, expect generated router types to update only after a packager restart.

### Integration points & external deps

- Expo packages are used widely (see `package.json`): `expo-router`, `@expo/vector-icons`, `expo-image`, `expo-linking`, etc.
- No backend integration is included in the starter — hooks in `app/product/[id].tsx` are placeholder data. Persist cart across screens by adding context or a global store.

### Common pitfalls and quick fixes

- "Navigation type" TypeScript errors after adding a route: restart the dev server so `expo-router` regenerates types. Temporary workaround: cast the route string to `any` when calling `router.push()`.
- Unused imports / linter warnings: run `npm run lint` (uses `expo lint`) and follow suggestions. Many files follow strict linting rules (avoid unused setters or index keys in lists).

### When you add features

- For cross-screen state like cart contents, add a simple React Context under `app/context/` or a `store/` directory. Wire it into `app/_layout.tsx` or `App.tsx` so it's available app-wide.
- If you add new top-level routes, create files under `app/` and restart the dev server to update router types.

If anything here is unclear or you want more examples (tests, global store wiring, or CI scripts), tell me which area to expand and I will update this file.
