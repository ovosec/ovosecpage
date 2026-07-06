import re

with open('d:/phpstudy_pro/WWW/ovobase.com/css/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's remove the rules for #simple-list-item-1 img and #simple-list-item-1 img:hover
pattern1 = r'#simple-list-item-1\s+img\s*\{[^}]*\}'
pattern2 = r'#simple-list-item-1\s+img:hover\s*\{[^}]*\}'

content = re.sub(pattern1, '', content)
content = re.sub(pattern2, '', content)

with open('d:/phpstudy_pro/WWW/ovobase.com/css/style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('style.css cleaned')
