"""Render a sketch fragment to a PNG at twice the pixel density, and fail when it is wider than the width.

The fragment's screen-reader description is hidden in the picture, because the text beside the
sketch carries it. Needs Playwright's Chromium:
    uv run --with playwright playwright install chromium
    uv run --with playwright python render.py sketch.html sketch.png --width 360 --dark
"""

import argparse
import pathlib
import sys

from playwright.sync_api import sync_playwright

PAPER = {"light": "#fbf7ee", "dark": "#262521"}


def page_html(fragment, width, scheme):
    return (
        '<!doctype html><html><head><meta charset="utf-8">'
        "<style>.vis-sr-only{display:none!important}</style></head>"
        f'<body style="margin:0;background:{PAPER[scheme]}">'
        f'<div style="width:{width}px">{fragment}</div></body></html>'
    )


def overflow_after_shooting(page, html, out, width):
    page.set_content(html)
    sketch = page.locator("body > div > div").first
    sketch.screenshot(path=out)
    scroll_width = page.evaluate("document.documentElement.scrollWidth")
    return scroll_width - width


def render(fragment, out, width, scheme):
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": 800}, device_scale_factor=2, color_scheme=scheme)
        html = page_html(fragment, width, scheme)
        overflow = overflow_after_shooting(page, html, out, width)
        browser.close()
    return overflow


def arguments():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("sketch", type=pathlib.Path)
    parser.add_argument("out")
    parser.add_argument("--width", type=int, default=736)
    parser.add_argument("--dark", action="store_true")
    return parser.parse_args()


def exit_code(overflow, args):
    if overflow > 0:
        print(f"{args.out}: {overflow}px wider than {args.width}px", file=sys.stderr)
        return 1
    print(f"{args.out}: fits {args.width}px")
    return 0


def main():
    args = arguments()
    fragment = args.sketch.read_text()
    scheme = "dark" if args.dark else "light"
    overflow = render(fragment, args.out, args.width, scheme)
    return exit_code(overflow, args)


if __name__ == "__main__":
    sys.exit(main())
