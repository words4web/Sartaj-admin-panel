# Sartaj Foods Admin Panel Context

## Developer Constraints

- **Build / Verification Warning**: Do NOT run Next.js production builds (`pnpm build`) or TypeScript type checks (`pnpm run type-check`) automatically after updating components or code. Wait for the user to explicitly instruct if either operation is required.

## Recent Changes & Cleanup

- **Website Active Theme Settings Page**:
  - Implemented an admin active theme settings dashboard page (`/dashboard/settings/theme`).
  - Displays available themes in a cards grid with live swatch gradient previews and particle layout indicators from local static metadata configurations.
  - Integrates the reusable `ConfirmModal` dialog to confirm options before making the theme change live for all website visitors.
- **Checkout Free Gift — Product Form & Order View**:
  - **Product form** (`ProductFormBasicTab.tsx`): Added an "Eligible checkout gift" toggle switch in the Restrictions & Gift Status section (Step 1 of the product creation/edit form). The `isGiftItem` boolean is wired through `productForm.state.ts` and included in the create/update mutation payload.
  - **Product types** (`product.types.ts`): Added `isGiftItem?: boolean` to the admin `IProduct` interface.
  - **Order detail page** (`order/[id]/page.tsx`): Added an emerald-themed "Free Checkout Gift" display card that appears when `order.giftProduct` is present. Shows the gift product's image, name (localized), and SKU.
  - **Order types** (`order.types.ts`): Added optional `giftProduct` subdocument (with `productId`, `name`, `sku`, `image`) to the admin `Order` interface.
  - **Important**: The `isGiftItem` field must be present in the backend Yup validation (`admin.product.validation.ts`) — without it the field is stripped before the service layer. This bug was fixed: `isGiftItem` is now declared in both `productBodyFields` (create) and `updateAdminProductSchema` (update).
