# Caseware Design System

UI/UX design language used for Caseware Cloud web tools. Based on the internal Caseware design system conventions.

## Typography

- **Font family**: Lato (Google Fonts)
- **Weights**: 300 (light), 400 (regular), 700 (bold), 900 (black), plus 400 italic
- **Import**: `https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap`

### Type Scale

| Element | Size | Line height | Weight | Notes |
|---------|------|-------------|--------|-------|
| Body | 14px | 20px | 400 | Base text |
| Label | 14px | 20px | 700 | 0.25px letter-spacing, color `rgba(0,0,0,0.82)` |
| H1 | 24px | 36px | 400 | Page title |
| H2 | 18px | 26px | 400 | Card/section heading |
| Helper text | 12px | 16px | 400 | Below inputs, color `rgba(0,0,0,0.60)` |

## Color Palette

### CSS Custom Properties

```css
:root {
    --cw-primary:       #0971AA;    /* Main action blue */
    --cw-primary-hover:  #1289C7;    /* Button hover state */
    --cw-primary-bg:     #EDF4FA;    /* Light blue background (status areas) */

    --cw-text:           #333333;    /* Primary text */
    --cw-text-secondary: #666666;    /* Secondary/muted text */
    --cw-text-disabled:  #AAAAAA;    /* Disabled state text */

    --cw-border:         #D4D9DE;    /* Input/form borders */
    --cw-card-border:    #E5E5E5;    /* Card borders (lighter) */
    --cw-surface:        #F5F5F5;    /* Page background */
    --cw-white:          #FFFFFF;    /* Card/input backgrounds */

    --cw-error:          #B81414;    /* Error text and borders */
    --cw-error-bg:       #FAEAEA;    /* Error message background */
    --cw-success:        #439D43;    /* Success text and borders */
    --cw-success-bg:     #DBF1DB;    /* Success message background */
}
```

Additional colors used directly:
- **Focus ring**: `#BBE2F7` at 15% opacity (`rgba(9,113,170,0.15)`)
- **Disabled button background**: `#CCCCCC`
- **Success message text**: `#0C390C` (dark green for contrast on success-bg)

## Spacing, Radius & Shadows

### Border Radius

| Token | Value |
|-------|-------|
| `--cw-radius-sm` | 2px |
| `--cw-radius-md` | 4px |
| `--cw-radius-lg` | 8px |

### Box Shadows

| Token | Value |
|-------|-------|
| `--cw-shadow-sm` | `0 1px 2px rgba(0,0,0,0.08)` |
| `--cw-shadow-md` | `0 2px 6px rgba(0,0,0,0.16)` |

## Layout

```css
.page-container {
    max-width: 640px;
    margin: 0 auto;
    padding: 48px 24px;
}
```

- Min viewport width: 480px
- Surface background (`#F5F5F5`) on body

## Component Patterns

### Page Header

```
h1 (24px, weight 400) + subtitle p (14px, secondary color, 4px top margin)
Bottom margin: 24px
```

### Card

```css
background: white;
border: 1px solid var(--cw-card-border);  /* #E5E5E5 */
border-radius: var(--cw-radius-md);       /* 4px */
padding: 24px;
box-shadow: var(--cw-shadow-sm);
```

### Text Input

```css
height: 36px;
padding: 8px 12px;
font: 14px/20px Lato;
border: 1px solid var(--cw-border);       /* #D4D9DE */
border-radius: var(--cw-radius-md);       /* 4px */
transition: border-color 200ms;
```

**States:**
- **Placeholder**: italic, `rgba(0,0,0,0.60)` opacity
- **Focus**: border becomes `--cw-primary`, add `0 0 0 2px rgba(9,113,170,0.15)` ring
- **Error**: border becomes `--cw-error` at 2px width; adjust padding to `7px 11px` to compensate for the extra border pixel

### Primary Button

```css
height: 36px;
padding: 8px 16px;
font: 14px Lato, uppercase, 0.5px letter-spacing;
color: white;
background: var(--cw-primary);
border-radius: var(--cw-radius-md);
transition: background 200ms;
```

**States:**
- **Hover**: background becomes `--cw-primary-hover`
- **Focus-visible**: `2px solid #BBE2F7` outline with `2px` offset
- **Disabled**: background `#CCCCCC`, text `--cw-text-disabled`, `cursor: not-allowed`

### Status Area (Loading)

```css
display: flex;
align-items: center;
gap: 12px;
padding: 12px 16px;
background: var(--cw-primary-bg);         /* #EDF4FA */
border-radius: var(--cw-radius-md);
color: var(--cw-primary);
```

**Spinner**: 20px circle, 3px border, `border-top-color` in primary, 0.8s linear infinite rotation.

### Messages

**Error message:**
```css
padding: 12px 16px;
background: var(--cw-error-bg);           /* #FAEAEA */
border-left: 3px solid var(--cw-error);   /* #B81414 */
border-radius: var(--cw-radius-md);
color: var(--cw-error);
```

**Success message:**
```css
padding: 12px 16px;
background: var(--cw-success-bg);         /* #DBF1DB */
border-left: 3px solid var(--cw-success); /* #439D43 */
border-radius: var(--cw-radius-md);
color: #0C390C;
```

### Form Layout

- **Form groups**: 16px margin-bottom between inputs
- **Last form group**: 24px bottom margin (before button)
- **Actions row**: flex, `justify-content: flex-end`

## Interaction Patterns

- Transitions on border and background changes: **200ms**
- Input placeholder: italic at 60% opacity
- URL paste triggers auto-extract parsing with success feedback
- Loading state: status area with spinner + message, toggled via `hidden` attribute
- Downloads triggered automatically on successful API response
- Use `[hidden] { display: none !important; }` for hide/show toggling

## Excel Report Formatting

When generating Excel output from Caseware data:

| Element | Style |
|---------|-------|
| Header row | Background `#1F3864` (dark navy), white bold text |
| Data rows | Alternating white and `#D9E1F2` (light blue) per content group |
| Frozen panes | Header row frozen at A2 |
| Auto-filter | Enabled on header row |
| Cell alignment | Text wrap enabled, vertical align top |
