"""提交规模业务规则。"""

from pathlib import Path
import sys
from typing import List, Tuple


HOOKS_DIR = Path(__file__).resolve().parent.parent
if str(HOOKS_DIR) not in sys.path:
    sys.path.insert(0, str(HOOKS_DIR))

from functions import (
    staged_change_line_count,
    staged_file_line_count,
    staged_file_size,
    staged_paths,
    staged_text_paths,
)


MAX_CHANGED_FILE_LINES = 500
MAX_COMMIT_CHANGED_LINES = 3000
MAX_STAGED_FILE_BYTES = 50 * 1024 * 1024


def oversized_staged_files(paths: List[str]) -> List[Tuple[str, int]]:
    """返回暂存区版本超过单文件长度限制的文件。"""
    violations = []
    for path in paths:
        line_count = staged_file_line_count(path)
        if line_count > MAX_CHANGED_FILE_LINES:
            violations.append((path, line_count))
    return violations


def oversized_staged_file_sizes(paths: List[str]) -> List[Tuple[str, int]]:
    """返回暂存区版本超过文件大小限制的文件。"""
    violations = []
    for path in paths:
        size = staged_file_size(path)
        if size > MAX_STAGED_FILE_BYTES:
            violations.append((path, size))
    return violations


def format_size(size: int) -> str:
    return f"{size / 1024 / 1024:.1f} MiB"


def main(args: List[str]) -> int:
    if args:
        print("Usage: commit_size_limitation/main.py", file=sys.stderr)
        return 2

    oversized_files = oversized_staged_files(staged_text_paths())
    if oversized_files:
        print(f"Staged files may not exceed {MAX_CHANGED_FILE_LINES} lines:", file=sys.stderr)
        for path, line_count in oversized_files:
            print(f"  {path} ({line_count} lines)", file=sys.stderr)
        print(
            "\nSplit the file, reduce its responsibilities, or use git commit --no-verify when justified.",
            file=sys.stderr,
        )
        return 1

    oversized_files_by_size = oversized_staged_file_sizes(staged_paths())
    if oversized_files_by_size:
        print(f"Staged files may not exceed {format_size(MAX_STAGED_FILE_BYTES)}:", file=sys.stderr)
        for path, size in oversized_files_by_size:
            print(f"  {path} ({format_size(size)})", file=sys.stderr)
        print(
            "\nCompress the asset, use external storage, or use git commit --no-verify when justified.",
            file=sys.stderr,
        )
        return 1

    change_line_count = staged_change_line_count()
    if change_line_count > MAX_COMMIT_CHANGED_LINES:
        print(
            f"Commit is too large: {change_line_count} added and deleted lines; "
            f"the limit is {MAX_COMMIT_CHANGED_LINES}.",
            file=sys.stderr,
        )
        print("\nSplit the changes into smaller commits or use git commit --no-verify when justified.", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
