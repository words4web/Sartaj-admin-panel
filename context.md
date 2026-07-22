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
- **Shipping Rule Configuration**:
  - Exposing the dynamic weight-based frozen shipping threshold from the app configuration database allows other portals to render active shipping thresholds accurately.
- **Product Form Header Back Exit & Save Confirmation Modals**:
  - Updated `PageHeader` component with an optional `onBackClick` callback to override default router transitions.
  - Added reusable `ConfirmModal` triggers:
    - Main Header Back button: Always prompts the user with a discard changes confirmation modal when exiting, irrespective of whether any fields have been modified. Managed at the page level (`new/page.tsx` and `edit/page.tsx`).
    - Save/Update button: Confirms before submitting the product creation or update mutation to the backend. Managed inside `ProductForm`.
- **Conditional Pricing Input Auto-Focus**:
  - Implemented `justToggledId` state hook inside `ProductFormPricingSection` to track which business segment the user explicitly turned on.
  - Dynamically binds `autoFocus={justToggledId === sc?._id}` to the pricing inputs to focus them on toggle-on, while preventing focus on initial page mount (e.g. edit page loading).
- **Name Input Auto-Focus on Translation Tab Change & Page Entry**:
  - Passed `inputRef` prop to `FormInput` inside `TranslationInput` for the first translation field (Name).
  - Configured a `useEffect` hook listening to `activeTab` to automatically call `input.focus()` on the corresponding language's Name field when switching tabs.
  - Triggers name input focusing on initial load when the user enters the edit page (defaulting to the English Name tab).
- **Product Listing URL State Synchronization**:
  - Replaced local states `page` and `categoryId` with direct queries to `useSearchParams()`.
  - Added debounced query string sync for `searchInput` to reflect updates in the URL `?search=<term>&page=1` without lagging the typing response.
  - Intercepted all filter modifications (pagination clicks, category selection, filter resets) to perform navigation updates via `router.push`, persisting the exact filter state on refresh or backward navigation.
