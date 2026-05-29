import glob

html_files = glob.glob('*.html')
html_files.remove('index.html') # Already done

top_bar_html = """
    <!-- Top Bar Promotionnelle -->
    <div class="promo-topbar" id="promo-topbar">
        <div class="container promo-topbar-content">
            <span class="promo-text"><i class="fas fa-gift"></i> <strong>Offre Spéciale :</strong> -15% sur votre première installation d'alarme ou de vidéosurveillance ce mois-ci !</span>
            <button class="promo-close" id="promo-close" aria-label="Fermer la bannière"><i class="fas fa-times"></i></button>
        </div>
    </div>
"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "promo-topbar" not in content:
        # Insert after <body>
        content = content.replace('<body>', '<body>\n' + top_bar_html, 1)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Top bar added to all pages.")
