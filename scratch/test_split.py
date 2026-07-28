import sys
content = open('src/app/components/DigitalGoldSilver.tsx', encoding='utf-8').read()
idx = content.find('  return (\n    <div className="flex-1 h-screen')
print(idx)
