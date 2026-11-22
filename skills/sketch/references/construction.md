# Constructing a sketch

How the drawing is built. The examples' style block implements all of it; this file says what each part is for and what the CSS cannot show.

## The fragment

One HTML fragment of plain HTML boxes, so text wraps at narrow widths. SVG only for arrows and symbols, each with `aria-hidden="true"`.

- Root: a unique id, `container-type:inline-size; color-scheme:light dark`, paper background, 20px padding, 6px radius, and a flex column with 30px between sections.
- Colours, as variables on the root, each a `light-dark()` pair so the sketch follows the reader's theme:

  ```css
  --paper:light-dark(#fbf7ee,#262521); --ink:light-dark(#2a2a2a,#ece7db); --soft:light-dark(#5f5f5f,#b3ada2);
  --red:light-dark(#b8322a,#ff8a7c); --blue:light-dark(#1d5bb8,#8cb8ff);
  ```

- Font: `"Bradley Hand","Marker Felt","Segoe Print","Comic Sans MS",cursive`. The `vis-sr-only` description gets a system sans-serif at 15px instead, because it shows as plain text when the file is opened outside the chat.
- Sizes: section title 21px, subtitle 15px in grey, screen heading 16px, screen text and buttons 14px, captions and boxes 15px, sub-labels in boxes 13px, data sheets 12px with a 13px heading.
- Characters: ASCII only, anything else as an entity (`&rarr;`, `&middot;`). A fragment declares no encoding, and a browser that falls back to Windows-1252 shows a UTF-8 arrow as three junk characters.

## Wobbly lines

2px solid ink borders with an asymmetric `border-radius`, never a plain rectangle.

| Element | Class | `border-radius` |
|---|---|---|
| Service, step, question, answer | `box` (`hot` thicker, `q` dashed, `new` blue, `bad` red) | `255px 18px 225px 18px/18px 225px 18px 255px` |
| Phone: 150px wide, at least 196px tall, a grey notch bar | `phone` (`gone` red) | `20px 14px 22px 12px/14px 22px 12px 20px` |
| Button: `solid` is an ink fill with paper text | `btn` | `255px 15px 225px 15px/15px 225px 15px 255px` |
| New note on a screen, 2px dashed blue | `note` | `12px 18px 10px 16px/16px 10px 18px 12px` |
| Frame around steps that run together | `frame` | `14px 24px 12px 22px/22px 12px 24px 14px` |
| Ledger: double left border for the spine, ruled rows | `ledger` (`new` blue, `old` grey text) | `4px 14px 6px 12px/12px 6px 14px 4px` |

Scrawled notes (`scrawl`) are rotated -4 degrees.

## Arrows

A slightly bent stroke with an open head: `stroke="currentColor" stroke-width="2" stroke-linecap="round"`.

- Right (`sk-arrow`, 42 by 24): `M3 13 C 13 9, 24 15, 36 12` with head `M29 6 L37 12 L29 18`. Add `back` to point it left.
- Down (`down`, 24 by 30): `M12 2 C 10 10, 14 18, 12 26` with head `M6 20 L12 27 L18 20`.
- Tail (`tail`, 16 by 24, no head): `M1 12 C 6 11, 11 13, 16 12`, the stub that runs into a data sheet from the box it leaves.

## Data on an arrow

```html
<div class="pipe"><div class="lane">TAIL<div class="doc"><div class="dt">create</div><div class="f">description</div><div class="f">keywords [ ]</div></div>RIGHT-ARROW</div></div>
```

`doc` cuts its top-right corner with `clip-path` and draws the fold with a gradient on `::after`. For data going both ways, put two `lane`s in one `pipe`, the second with a `back` arrow before the sheet and the tail after it. Mark a field a step adds with `class="f new"`.

## Symbols

Stick figure, database, screen and envelope, each about the size of a caption block, with the caption under it in a `sym` column:

```html
<svg width="40" height="64" viewBox="0 0 40 64"><circle cx="20" cy="10" r="8"/><path d="M20 18 C 19 26, 21 32, 20 40"/><path d="M5 29 C 12 26, 28 27, 35 25"/><path d="M20 40 L9 61 M20 40 L31 61"/></svg>
<svg width="70" height="84" viewBox="0 0 70 84"><ellipse cx="35" cy="12" rx="30" ry="9"/><path d="M5 12 C 4 30, 6 52, 5 70 C 5 82, 65 82, 65 70 C 66 52, 64 30, 65 12"/><path d="M5 31 C 5 43, 65 43, 65 31 M5 50 C 5 62, 65 62, 65 50"/></svg>
<svg width="70" height="60" viewBox="0 0 70 60"><path d="M5 5 C 25 3, 47 6, 65 4 C 66 18, 64 32, 66 44 C 46 46, 24 43, 4 45 C 5 31, 3 17, 5 5 Z"/><path d="M35 45 L35 54 M22 56 C 30 54, 40 57, 48 55"/></svg>
<div class="env"><svg viewBox="0 0 120 80"><path d="M4 6 L60 46 L116 6"/></svg></div>
```

Every path takes the arrow's stroke attributes and `fill="none"`. The envelope takes `new` to turn blue.

## Narrow widths

Container queries, never media queries, because the sketch's width is the chat column's, not the window's.

- Below 600px, rows stack vertically, arrows and tails rotate 90 degrees to point down (`back` arrows point up), and the two lanes of a two-way link sit side by side.
- Below 420px, decision branches stack.
- Check at 736px and at 320 to 360px.
