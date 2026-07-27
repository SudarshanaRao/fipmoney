with open('rewrite_digitalsilver.cjs', 'r', encoding='utf8') as f:
    content = f.read()
    
content = content.replace(
    "if (lines[i].includes('return (') && lines[i].trim() === 'return (') {", 
    "if (lines[i].trim().startsWith('return (') && lines[i].trim().length < 15) {"
)

with open('rewrite_digitalsilver.cjs', 'w', encoding='utf8') as f:
    f.write(content)
