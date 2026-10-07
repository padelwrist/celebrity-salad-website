#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SITEMAP = PUBLIC / "sitemap.xml"
HOST = "celebrity-salad.com"
CANONICAL_RE = re.compile(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', re.I)
ROBOTS_RE = re.compile(r'<meta\s+[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']+)["\']', re.I)


def git_lastmod(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", rel],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    value = result.stdout.strip()
    if not value:
        raise RuntimeError(f"No git modification date found for {rel}")
    return value


def canonical_for(path: Path) -> str | None:
    html = path.read_text(encoding="utf-8")
    robots = ROBOTS_RE.search(html)
    if robots and "noindex" in robots.group(1).lower():
        return None
    match = CANONICAL_RE.search(html)
    if not match:
        return None
    url = match.group(1).strip()
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.netloc != HOST:
        raise RuntimeError(f"Unexpected canonical in {path.relative_to(ROOT)}: {url}")
    return url


def sort_key(item: tuple[str, Path]) -> tuple[int, str]:
    url, _ = item
    if url == f"https://{HOST}/":
        return (0, url)
    if url == f"https://{HOST}/guides/":
        return (1, url)
    return (2, url)


def main() -> None:
    pages: list[tuple[str, Path]] = []
    for path in sorted(PUBLIC.rglob("index.html")):
        url = canonical_for(path)
        if url:
            pages.append((url, path))

    if len({url for url, _ in pages}) != len(pages):
        raise RuntimeError("Duplicate canonical URLs found while generating sitemap")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, path in sorted(pages, key=sort_key):
        lines.append(
            f"  <url><loc>{escape(url)}</loc><lastmod>{git_lastmod(path)}</lastmod></url>"
        )
    lines.append("</urlset>")
    SITEMAP.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {SITEMAP.relative_to(ROOT)} with {len(pages)} canonical URLs")


if __name__ == "__main__":
    main()
