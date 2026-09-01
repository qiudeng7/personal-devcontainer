"""提交信息格式业务规则。"""

from pathlib import Path
import re
import sys
from typing import List


FORMAT = re.compile(r"^[A-Za-z-]+\([A-Za-z0-9/-]+\): (.*)$")


def contains_chinese(text: str) -> bool:
    """识别常用及扩展区的中日韩统一表意文字。"""
    return any(
        "\u3400" <= char <= "\u4dbf"
        or "\u4e00" <= char <= "\u9fff"
        or "\uf900" <= char <= "\ufaff"
        or "\U00020000" <= char <= "\U0002ebef"
        or "\U00030000" <= char <= "\U000323af"
        for char in text
    )


def is_valid_first_line(first_line: str) -> bool:
    match = FORMAT.fullmatch(first_line)
    return bool(match and contains_chinese(match.group(1)))


def main(args: List[str]) -> int:
    if len(args) != 1:
        print("Usage: commit_message_validator/main.py <message-file>", file=sys.stderr)
        return 2

    message_path = Path(args[0])
    message = message_path.read_text(encoding="utf-8", errors="replace")
    first_line = message.splitlines()[0] if message.splitlines() else ""

    if is_valid_first_line(first_line):
        return 0

    print(
        "Invalid commit message first line.\n\n"
        "Required: type(domain): Chinese message\n"
        "  type    may contain only letters and hyphens (-)\n"
        "  domain  may contain only letters, digits, hyphens (-), and slashes (/)\n"
        "  message must contain at least one Chinese character\n"
        "  additional lines are unrestricted\n\n"
        "Example: feat(git-hooks): 添加提交信息校验",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
