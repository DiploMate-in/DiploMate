# Refactor Notes

## Changes

### Tooling
- Updated `eslint.config.js` to enable `@typescript-eslint/no-unused-vars` with warnings.
- Updated `package.json` with project name `diplomate`, version `0.1.0`, and added `typecheck` and `lint:fix` scripts.

### Admin Auth
- Centralized role checking in `src/services/roles.ts`.
- Updated `AdminLogin` and `AdminLayout` to use the centralized `hasRole` function.
- This ensures consistent role verification using the database function `has_role` where possible.

### Auth Context
- Fixed `refreshUserData` typing in `AppContext`.
- Removed `setTimeout` in `onAuthStateChange` to avoid race conditions.
- Implemented deterministic auth flow with error handling for wishlist and purchases.
- Updated `isAuthenticated` check to be strictly `!!session?.user`.

### Routing
- Implemented a centralized route configuration in `src/routing/routes.tsx`.
- Added route guards in `src/routing/guards.tsx` for `RequireAuth` and `RequireAdmin`.
- Updated `App.tsx` to use the new routing structure and `Suspense` for lazy loading.

### Database & RLS
- Added migration to allow admins to view all `wishlist` and `purchases` records.

## How to Run

1.  Install dependencies: `npm install`
2.  Run development server: `npm run dev`
3.  Run type check: `npm run typecheck`
4.  Run build: `npm run build`

## Admin Auth

Admin authentication is now handled via `src/services/roles.ts`. The `hasRole` function checks if the user has the 'admin' role. It prioritizes using the `has_role` RPC function from Supabase but falls back to a direct query if needed.

## Verification

- Try accessing `/admin` without being logged in -> Redirects to `/admin/login`.
- Try accessing `/admin` as a regular user -> Redirects to `/admin/login` (or shows access denied).
- Wishlist and purchases are protected by RLS.
- `npm run typecheck` passed.
- `npm run build` passed.
