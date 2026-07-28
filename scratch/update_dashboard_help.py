import sys

file_path = 'src/app/components/Dashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Import HelpSupportPage
if 'import HelpSupportPage' not in content:
    content = content.replace(
        'import ComingSoon from "./ComingSoon";',
        'import ComingSoon from "./ComingSoon";\nimport HelpSupportPage from "./HelpSupportPage";'
    )

# Update logic
old_logic = '''        ) : ["banking", "offers", "help"].includes(tab) ? (
          <ComingSoon tab={tab} />
        ) : ('''

new_logic = '''        ) : tab === "help" ? (
          <HelpSupportPage />
        ) : ["banking", "offers"].includes(tab) ? (
          <ComingSoon tab={tab} />
        ) : ('''

content = content.replace(old_logic, new_logic)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard.tsx updated to render HelpSupportPage.")
