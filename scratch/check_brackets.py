import sys

with open("src/app/components/DigitalGoldSilver.tsx", "r", encoding="utf-8") as f:
    content = f.read()

open_braces = 0
open_parens = 0
for i, char in enumerate(content):
    if char == '{': open_braces += 1
    elif char == '}': open_braces -= 1
    elif char == '(': open_parens += 1
    elif char == ')': open_parens -= 1
    
    if open_braces < 0 or open_parens < 0:
        print(f"Error at index {i}: line {content[:i].count('\\n') + 1}, char {char}")
        sys.exit(1)

print(f"Final state: braces={open_braces}, parens={open_parens}")
