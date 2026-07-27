import re

with open("src/app/components/DigitalGoldSilver.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

def check(lines):
    stack = []
    for i, line in enumerate(lines):
        for char in line:
            if char in '{(': 
                stack.append((char, i+1))
            elif char in '})':
                if not stack:
                    print(f"Extra closing {char} at line {i+1}")
                    return
                top, top_line = stack.pop()
                expected = '}' if top == '{' else ')'
                if char != expected:
                    print(f"Mismatched closing {char} at line {i+1}, expected {expected} to close {top} from line {top_line}")
                    return

    if stack:
        print("Unclosed brackets:")
        for char, line in stack:
            print(f"  {char} at line {line}")

check(lines)
