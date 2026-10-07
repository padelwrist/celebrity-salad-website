#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
HOST = "celebrity-salad.com"
ENDPOINT = "https://api.indexnow.org/indexnow"
SITEMAP = PUBLIC / "sitemap.xml"
CANONICAL_RE = re.compile(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', re.I)


def find_key() -> tuple[str, str]:
    for path in PUBLIC.glob("*.txt"):
        key = path.stem
        if not re.fullmatch(r"[A-Za-z0-9-]{8,128}", key):
            continue
        if path.read_text(encoding="utf-8").strip() == key:
            return key, f"https://{HOST}/{path.name}"
    raise RuntimeError("No self-verifying IndexNow key file found in public/")


def sitemap_urls() -> list[str]:
    root = ElementTree.parse(SITEMAP).getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in root.findall("s:url/s:loc", ns) if node.text]
    return sorted(dict.fromkeys(urls))


def canonical_from_file(path: Path) -> str | None:
    if not path.exists():
        return None
    match = CANONICAL_RE.search(path.read_text(encoding="utf-8"))
    if not match:
        return None
    url = match.group(1).strip()
    parsed = urlparse(url)
    if parsed.scheme == "https" and parsed.netloc == HOST:
        return url
    return None


def url_from_deleted_path(rel: str) -> str | None:
    if rel == "public/index.html":
        return f"https://{HOST}/"
    if rel.startswith("public/") and rel.endswith("/index.html"):
        slug = rel[len("public/") : -len("index.html")]
        return f"https://{HOST}/{slug}"
    return None


def valid_commit(ref: str | None) -> bool:
    if not ref or set(ref) == {"0"}:
        return False
    result = subprocess.run(
        ["git", "cat-file", "-e", f"{ref}^{{commit}}"],
        cwd=ROOT,
        check=False,
        capture_output=True,
    )
    return result.returncode == 0


def changed_urls(before: str, after: str) -> list[str]:
    result = subprocess.run(
        ["git", "diff", "--name-status", "--find-renames", before, after, "--", "public"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    urls: set[str] = set()
    for raw in result.stdout.splitlines():
        if not raw.strip():
            continue
        parts = raw.split("\t")
        status = parts[0]
        paths = parts[1:]
        if status.startswith("R") and len(paths) == 2:
            old_url = url_from_deleted_path(paths[0])
            if old_url:
                urls.add(old_url)
            new_path = ROOT / paths[1]
            new_url = canonical_from_file(new_path)
            if new_url:
                urls.add(new_url)
            continue

        rel = paths[-1]
        if not rel.endswith(".html"):
            continue
        if status.startswith("D"):
            url = url_from_deleted_path(rel)
        else:
            url = canonical_from_file(ROOT / rel)
        if url:
            urls.add(url)

    return sorted(urls)


def submit(urls: list[str]) -> None:
    if not urls:
        print("No changed canonical HTML URLs to submit to IndexNow.")
        return

    key, key_location = find_key()
    payload = {
        "host": HOST,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls,
    }
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "CelebritySalad-IndexNow/1.0"},
        method="POST",
    )
    print(f"Submitting {len(urls)} URL(s) to IndexNow:")
    for url in urls:
        print(f"  {url}")

    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
            response_body = response.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        response_body = exc.read().decode("utf-8", errors="replace")
        print(f"IndexNow HTTP {exc.code}: {response_body}", file=sys.stderr)
        raise
    except URLError as exc:
        print(f"IndexNow network error: {exc}", file=sys.stderr)
        raise

    print(f"IndexNow HTTP {status}: {response_body or 'accepted'}")
    if status not in (200, 202):
        raise RuntimeError(f"Unexpected IndexNow response: HTTP {status}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="Submit every canonical URL from the sitemap")
    parser.add_argument("--before", help="Git commit before the change")
    parser.add_argument("--after", default="HEAD", help="Git commit after the change")
    args = parser.parse_args()

    if args.all:
        urls = sitemap_urls()
    elif valid_commit(args.before) and valid_commit(args.after):
        urls = changed_urls(args.before, args.after)
    else:
        print("Git range unavailable; falling back to all sitemap URLs.")
        urls = sitemap_urls()

    submit(urls)


if __name__ == "__main__":
    main()
