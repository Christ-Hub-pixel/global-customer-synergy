import glob

old_text = """                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;"><i class="fas fa-envelope" style="color: var(--primary);"></i> <a href="mailto:Contact@globalcustomersynergy.com" style="color: #cbd5e1; text-decoration: none; word-break: break-word;">Contact@globalcustomersynergy.com</a></li>"""
new_text = """                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;"><i class="fas fa-envelope" style="color: var(--primary);"></i> <a href="mailto:Contact@globalcustomersynergy.com" style="color: #cbd5e1; text-decoration: none; word-break: break-word;">Contact@globalcustomersynergy.com</a></li>
                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;"><i class="fas fa-envelope" style="color: var(--primary); visibility: hidden;"></i> <a href="mailto:globalcustomersynergy@gmail.com" style="color: #cbd5e1; text-decoration: none; word-break: break-word;">globalcustomersynergy@gmail.com</a></li>"""

for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    if old_text in content:
        with open(file, "w") as f:
            f.write(content.replace(old_text, new_text))
        print(f"Updated {file}")
