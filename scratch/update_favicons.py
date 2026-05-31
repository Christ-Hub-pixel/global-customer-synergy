import glob
import re
import os

new_favicons = """    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/favicon.png">"""

# Cherche tous les fichiers HTML dans le répertoire principal
html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Supprimer les anciens liens de favicons et apple-touch-icon
    content = re.sub(r'<link[^>]*rel=["\'](?:shortcut )?icon["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link[^>]*rel=["\']apple-touch-icon["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)

    # Injecter les nouveaux liens juste avant la balise de fermeture </head>
    content = re.sub(r'(</head>)', f'{new_favicons}\n</head>', content, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated favicons in {filepath}")