#!/usr/bin/env python3
"""Verify Channel Talk scripts are present on key pages."""

from pathlib import Path
import urllib.request

BASE = "http://127.0.0.1:8765"
PAGES = [
    "/index.html",
    "/faq/",
    "/policy/",
    "/guide/",
    "/mobile-payment-cashout/",
    "/cases/",
    "/limit/",
]

REQUIRED = ("channel-config.js", "channel-talk-loader.js", "main.js")


def check(path: str) -> tuple[bool, str]:
    url = BASE + path
    with urllib.request.urlopen(url, timeout=10) as res:
        html = res.read().decode("utf-8", errors="replace")
    missing = [name for name in REQUIRED if name not in html]
    if missing:
        return False, f"missing {', '.join(missing)}"
    return True, "ok"


def main() -> None:
    results = []
    for page in PAGES:
        try:
            ok, msg = check(page)
        except Exception as exc:  # noqa: BLE001
            ok, msg = False, str(exc)
        results.append((page, ok, msg))
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {page} - {msg}")

    if not all(ok for _, ok, _ in results):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
