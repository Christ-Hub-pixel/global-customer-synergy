import os
import glob

replacement = """    <link rel="icon" href="favicon.ico" sizes="any">
    <link rel="icon" href="favicon-48x48.png" type="image/png" sizes="48x48">
    <link rel="icon" href="favicon-192x192.png" type="image/png" sizes="192x192">
    <link rel="apple-touch-icon" href="favicon-192x192.png">"""

target = '    <link rel="icon" href="assets/logo_cercle.webp">'

for file in glob.glob("*.html"):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if target in content:
        content = content.replace(target, replacement)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
