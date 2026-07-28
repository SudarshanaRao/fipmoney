import sys

file_path = 'src/app/components/Dashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add ComingSoon import
if 'import ComingSoon' not in content:
    content = content.replace(
        'import SettingsPage from "./SettingsPage";',
        'import SettingsPage from "./SettingsPage";\nimport ComingSoon from "./ComingSoon";'
    )

# Update the render logic
old_logic = '''        ) : tab === "history" ? (
          <HistoryPage />
        ) : (
          <MainDashboard />
        )}'''

new_logic = '''        ) : tab === "history" ? (
          <HistoryPage />
        ) : ["banking", "offers", "help"].includes(tab) ? (
          <ComingSoon tab={tab} />
        ) : (
          <MainDashboard />
        )}'''
content = content.replace(old_logic, new_logic)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard.tsx updated successfully!")
