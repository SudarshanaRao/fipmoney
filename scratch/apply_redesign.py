import sys

with open('src/app/components/DigitalGoldSilver.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

return_idx = -1
for i in range(300, len(lines)):
    if 'return (' in lines[i] and len(lines[i].strip()) < 15:
        return_idx = i
        break

if return_idx == -1:
    print("Could not find return")
    sys.exit(1)

with open('rewrite_digitalsilver.cjs', 'r', encoding='utf-8') as f:
    cjs_content = f.read()

# Extract newJsx from rewrite_digitalsilver.cjs
import re
match = re.search(r'const newJsx = `(.*?)`;\\n\\nlines\\.splice', cjs_content, re.DOTALL)
if not match:
    print("Could not extract newJsx")
    sys.exit(1)

new_jsx = match.group(1)

# Ensure ArrowRight is imported
import_idx = -1
for i, line in enumerate(lines):
    if '} from "lucide-react"' in line:
        import_idx = i
        break

if import_idx != -1:
    import_block = "".join(lines[:import_idx+1])
    if "ArrowRight" not in import_block:
        lines[import_idx-1] = lines[import_idx-1].rstrip('\\n') + ', ArrowRight\\n'

new_lines = lines[:return_idx]
new_lines.append(new_jsx + "\\n")

with open('src/app/components/DigitalGoldSilver.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully replaced with Python")
