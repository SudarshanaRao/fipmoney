import tokenize
import io

with open("src/app/components/DigitalGoldSilver.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Since it's TSX and we don't have a full parser, let's just strip block comments and string literals naively.
import re

# Strip block comments
content = re.sub(r'/\\*.*?\\*/', '', content, flags=re.DOTALL)
# Strip line comments
content = re.sub(r'//.*', '', content)
# Strip string literals (simple)
content = re.sub(r'"(?:\\\\.|[^"\\\\])*"', '""', content)
content = re.sub(r"'(?:\\\\.|[^'\\\\])*'", "''", content)
content = re.sub(r"`(?:\\\\.|[^`\\\\])*`", "``", content)

stack = []
lines = content.split('\\n')
for i, line in enumerate(lines):
    for char in line:
        if char in '{(': 
            stack.append((char, i+1))
        elif char in '})':
            if not stack:
                print(f"Extra closing {char} at line {i+1}")
                exit(1)
            top, top_line = stack.pop()
            expected = '}' if top == '{' else ')'
            if char != expected:
                print(f"Mismatched closing {char} at line {i+1}, expected {expected} to close {top} from line {top_line}")
                exit(1)

if stack:
    print("Unclosed brackets:")
    for char, line in stack:
        print(f"  {char} at line {line}")
else:
    print("All brackets match")
