import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # contact.html
    content = content.replace('''onmouseover="this.style.color='#E63946'" onmouseout="this.style.color='inherit'"''', 'class="hover-red"')
    content = content.replace('onsubmit="return false;"', '')
    
    # about.html & catalogue.html
    content = content.replace('''onmouseover="this.style.color='var(--primary-blue)'"\n                                onmouseout="this.style.color='inherit'"''', 'class="hover-primary-blue"')
    content = content.replace('''onmouseover="this.style.color='var(--color-primary)'"\n                                    onmouseout="this.style.color='inherit'"''', 'class="hover-color-primary"')
    content = content.replace('''onmouseover="this.style.color='var(--color-primary)'"\n                            onmouseout="this.style.color='inherit'"''', 'class="hover-color-primary"')
    
    # onerror
    content = content.replace('''onerror="this.src='assets/hero-image.png'"''', 'class="fallback-img"')

    # onclick in catalogue
    content = content.replace('''onclick="document.querySelector('[data-subcategory=\\'chaussures-de-securite\\']').click(); return false;"''', 'class="trigger-subcategory" data-target="chaussures-de-securite"')
    content = content.replace('''onclick="document.querySelector('[data-subcategory=\\'vetements-de-travail\\']').click(); return false;"''', 'class="trigger-subcategory" data-target="vetements-de-travail"')
    content = content.replace('''onclick="document.querySelector('[data-subcategory=\\'casques-de-securite\\']').click(); return false;"''', 'class="trigger-subcategory" data-target="casques-de-securite"')
    content = content.replace('''onclick="document.querySelector('[data-subcategory=\\'protection-respiratoire\\']').click(); return false;"''', 'class="trigger-subcategory" data-target="protection-respiratoire"')
    content = content.replace('''onclick="document.querySelector('[data-subcategory=\\'extincteurs\\']').click(); return false;"''', 'class="trigger-subcategory" data-target="extincteurs"')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Inline JS removed.")
