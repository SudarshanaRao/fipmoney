import sys

file_path = 'src/app/components/Navigation.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Tab type
content = content.replace(
    'export type Tab = "home" | "portfolio" | "sip" | "bills" | "history" | "settings";',
    'export type Tab = "home" | "portfolio" | "sip" | "bills" | "history" | "settings" | "banking" | "offers" | "help";'
)

# Update navItems
content = content.replace(
    '{ id: "settings",  Icon: Landmark,   label: "Banking Services"   }, // Dummy redirect to settings or just label change',
    '{ id: "banking",   Icon: Landmark,   label: "Banking Services"   },'
)

# Update dummy items
old_dummy = '''      {/* Dummy Visual Items to match screenshot */}
      {[
        { label: "Offers & Rewards", Icon: Gift },
        { label: "Settings", Icon: Settings, isSettings: true },
        { label: "Help & Support", Icon: HelpCircle },
      ].map((item, i) => {
        const active = item.isSettings && activeTab === "settings";
        return (
          <button key={i} onClick={() => item.isSettings && onTabChange("settings")}'''

new_dummy = '''      {/* Secondary Items */}
      {[
        { id: "offers", label: "Offers & Rewards", Icon: Gift },
        { id: "settings", label: "Settings", Icon: Settings },
        { id: "help", label: "Help & Support", Icon: HelpCircle },
      ].map((item, i) => {
        const active = activeTab === item.id;
        return (
          <button key={i} onClick={() => onTabChange(item.id as Tab)}'''
content = content.replace(old_dummy, new_dummy)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Navigation.tsx updated successfully!")
