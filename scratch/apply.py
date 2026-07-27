import sys

try:
    with open('rewrite_digitalsilver.cjs', 'r', encoding='utf-8') as f:
        content = f.read()

    start = content.find('const newJsx = `') + len('const newJsx = `')
    end = content.rfind('`;')
    new_jsx = content[start:end]

    with open('src/app/components/DigitalGoldSilver.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    return_idx = -1
    for i in range(300, len(lines)):
        if 'return (' in lines[i] and len(lines[i].strip()) < 15:
            return_idx = i
            break

    if return_idx == -1:
        print('Failed to find return in target file')
        sys.exit(1)

    import_idx = -1
    for i, line in enumerate(lines):
        if '} from "lucide-react"' in line:
            import_idx = i
            break
            
    if import_idx != -1:
        import_block = ''.join(lines[:import_idx+1])
        if 'ArrowRight' not in import_block:
            lines[import_idx-1] = lines[import_idx-1].rstrip('\\n') + ', ArrowRight\\n'

    new_lines = lines[:return_idx]
    new_lines.append(new_jsx + '\\n')

    with open('src/app/components/DigitalGoldSilver.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

    print('Successfully applied!')
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
