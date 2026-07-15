import os
import re

src_dir = 'src'
# Match something like `from "lucide-react@0.487.0"` or `import "class-variance-authority@0.7.1"`
pattern = re.compile(r'(from\s+[\'"]|import\s+[\'"])(.+?)@[0-9]+(?:\.[0-9]+)*(?:-[a-zA-Z0-9]+)?([\'"])')

for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.js', '.jsx')):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = pattern.sub(r'\1\2\3', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Fixed {filepath}")
