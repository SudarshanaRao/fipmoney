import sys

with open('src/app/components/DigitalGoldSilver.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace \` with `
content = content.replace('\\\\`', '`')
# Replace \$ with $
content = content.replace('\\\\$', '$')

with open('src/app/components/DigitalGoldSilver.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed escapes!")
