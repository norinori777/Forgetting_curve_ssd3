# Design Tokens Guide

## Files

- Base extracted theme: [nori-theme.json](../nori-theme.json)
- CSS Variables: [design/nori-theme.css](design/nori-theme.css)
- Tailwind config preset: [design/tailwind.nori-theme.cjs](design/tailwind.nori-theme.cjs)
- Modernized app theme: [design/forgetting-curve-theme.modern.json](design/forgetting-curve-theme.modern.json)

## Intent

- `nori-theme.json` preserves observed values from nori.
- `design/nori-theme.css` is a direct reusable token layer.
- `design/tailwind.nori-theme.cjs` maps the same values into Tailwind theme keys.
- `design/forgetting-curve-theme.modern.json` is a product-oriented adaptation for a forgetting-curve app.

## Token Mapping (Base)

### Color

- Brand primary: `#117ec6`
- Brand accent: `#e9606d`
- Brand success: `#12c74b`
- Surface subtle: `#f9f9f9`
- Text body: `#666666`
- Border default: `#dddddd`

### Typography

- Root font size: `62.5%`
- Body range: `1.1rem` to `1.3rem`
- Title range: `1.3rem` to `2rem`
- Emphasis: buttons and titles use bold

### Spacing and Radius

- Base unit: `4px`
- Common spacing: `8px`, `12px`, `16px`, `24px`
- Primary radius: `4px`

### Layout

- Content max width: `1168px`
- Header height: `50px` desktop, `48px` mobile
- Representative responsive points: `600px`, `839px`, `1167px`, `1380px`

## How To Use

### CSS Variables

1. Import [design/nori-theme.css](design/nori-theme.css) once at app entry.
2. Reference variables in components.

```css
.review-card {
  background: var(--color-surface-panel);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
}
```

### Tailwind

1. Merge exports from [design/tailwind.nori-theme.cjs](design/tailwind.nori-theme.cjs) into your `tailwind.config`.
2. Use semantic classes.

```tsx
<button className="bg-brand-primary text-text-inverse rounded-md min-h-11 px-3">
  Review Now
</button>
```

## Modernized Variant Guidance

- Use [design/forgetting-curve-theme.modern.json](design/forgetting-curve-theme.modern.json) when you want a less corporate and more learning-focused tone.
- Key differences from base:
  - calmer teal primary (`#0f766e`) instead of saturated blue
  - warm page background (`#f7f7f2`) for reduced eye fatigue
  - larger default corner radius and softer depth
  - simplified breakpoints (`640/768/1024/1280`)

## Recommended Rollout

1. Start with base tokens for parity.
2. Apply modernized tokens to learning flow screens first.
3. Track readability and completion metrics before full rollout.
