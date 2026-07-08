# Sartaj Foods Admin Panel Context

## Developer Constraints

- **Build / Verification Warning**: Do NOT run Next.js production builds (`pnpm build`) or TypeScript type checks (`pnpm run type-check`) automatically after updating components or code. Wait for the user to explicitly instruct if either operation is required.

## Recent Changes & Cleanup

- **Website Active Theme Settings Page**:
  - Implemented an admin active theme settings dashboard page (`/dashboard/settings/theme`).
  - Displays available themes in a cards grid with live swatch gradient previews and particle layout indicators from local static metadata configurations.
  - Integrates the reusable `ConfirmModal` dialog to confirm options before making the theme change live for all website visitors.
