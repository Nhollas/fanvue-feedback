# @fanvue/ui — Library Feedback

Consumer feedback from building [fanvue-feedback](https://fanvue-feedback.vercel.app) with the `@fanvue/ui` component library. Intended to help the library team prioritise improvements.

---

## Accessibility

### CardTitle hardcodes `<h3>` with no way to change the rendered element

`CardTitle` always renders an `<h3>`. There is no `as` prop or polymorphic pattern to control the heading level. This makes it impossible to build a correct heading hierarchy — for example, card titles in a list page should be `<h2>` (after the page `<h1>`), while on a detail page the card title _is_ the `<h1>`.

**Impact:** Lighthouse flags `heading-order` violations (headings skip levels). Consumers must stop using `CardTitle` entirely and manually recreate it with the correct heading level and the internal classes (`typography-semibold-body-lg text-content-primary`).

**Suggestion:** Accept an `as` prop (defaulting to `"h3"` for backwards compatibility):

```tsx
<CardTitle as="h2">My title</CardTitle>
```

### Tabs used without TabsContent produce invalid `aria-controls`

Radix `TabsTrigger` automatically sets `aria-controls` pointing to a corresponding `TabsContent` panel. When Tabs are used as a filter/toggle (a very common pattern), there are no content panels, so `aria-controls` references IDs that don't exist in the DOM.

**Impact:** Lighthouse flags `aria-valid-attr-value` — screen readers announce a relationship to a panel that isn't there.

**Suggestion:** Either document the workaround (render hidden `<TabsContent forceMount hidden />` elements), or consider exposing a variant/prop that suppresses `aria-controls` for filter-style usage. Alternatively, a dedicated `ToggleGroup` component would be a better semantic fit for this pattern.

---

## Styling / Customisation

### Button icon sizing requires arbitrary selector overrides

The `Button` component doesn't expose a way to control the size of slotted SVG icons independently of the button size. Consumers end up using Tailwind arbitrary selectors like `[&_svg]:size-6!` to override.

**Suggestion:** Consider size-aware icon defaults, or an `iconSize` prop.

### Select focus ring requires deep child selector overrides

The `Select` component's internal `<button>` needs custom focus-visible styles in some layouts. Consumers must target it with `[&_button]:focus-visible:shadow-focus-ring [&_button]:focus-visible:outline-none`, which is brittle and couples to internal DOM structure.

**Suggestion:** Accept `className` or a dedicated prop that applies to the trigger button, or ensure the default focus ring works well across common background colours.

### Button `leftIcon` / `rightIcon` props are ignored when using `asChild`

When `asChild` is used on `Button`, the `leftIcon` and `rightIcon` props are silently dropped — they never render. The workaround is to place the icons directly inside the child element:

```tsx
{/* ❌ Icons don't render */}
<Button leftIcon={<MessageIcon />} rightIcon={<ChevronRightIcon />} asChild>
  <Link href="/feedback/123">Dark mode for messaging</Link>
</Button>

{/* ✅ Workaround — icons as children */}
<Button asChild>
  <Link href="/feedback/123">
    <MessageIcon />
    Dark mode for messaging
    <ChevronRightIcon />
  </Link>
</Button>
```

**Impact:** Easy to miss since there's no warning — the button just renders without icons. Consumers have to discover this by trial and error.

**Suggestion:** Either forward `leftIcon` / `rightIcon` into the composed child via Radix's `Slot` mechanism, or document this limitation clearly and warn in dev mode when both `asChild` and icon props are provided.

