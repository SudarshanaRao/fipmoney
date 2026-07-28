import re

with open('src/app/components/DigitalGoldSilver.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# find return block
match = re.search(r'  return \(\s*<div.*?>(.*?)</>\s*\);\s*\}', content, re.DOTALL)
if match:
    print(f"Found return block of length {len(match.group(1))}")
    # print first 500 chars
    print(match.group(1)[:500])
else:
    print("Could not find return block")
