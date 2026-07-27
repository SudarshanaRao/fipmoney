with open('src/app/components/SettingsPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'activeSubTab === "profile"' in l:
        print(f"Profile start: {i}")
    if 'activeSubTab === "bank"' in l:
        print(f"Bank start: {i}")
    if 'activeSubTab === "nominee"' in l:
        print(f"Nominee start: {i}")
    if 'activeSubTab === "security"' in l:
        print(f"Security start: {i}")
