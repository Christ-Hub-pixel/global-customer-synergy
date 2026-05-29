with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find the start and end of the bad block
start_idx = -1
for i, line in enumerate(lines):
    if "/* Utilitaires ajoutés pour remplacer les styles et événements inline (Sécurité) */" in line:
        start_idx = i
        break

if start_idx != -1:
    end_idx = start_idx + 9 # it's 9 lines long including the empty line
    bad_block = lines[start_idx:end_idx]
    del lines[start_idx:end_idx]
    
    # append to end
    lines.extend(['\n'] + bad_block)
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Fixed style.css")
