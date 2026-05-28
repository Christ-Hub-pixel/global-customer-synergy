import re

with open('catalogue.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD SIDEBAR LAYOUT
# Replace `<div class="product-grid">` with the sidebar and layout wrappers
sidebar_html = """
            <div class="catalogue-main-layout">
                <aside class="catalogue-sidebar">
                    <div class="sidebar-block theme-epi">
                        <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-hard-hat"></i> Expertise EPI</h3>
                        <ul class="sidebar-nav-list">
                            <li><button class="sidebar-filter-btn" data-category="epi" data-subcategory="casques-de-securite"><i class="fas fa-angle-right"></i> Casques de sécurité</button></li>
                        </ul>
                    </div>
                    <div class="sidebar-block theme-incendie" style="margin-top: 2rem;">
                        <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-fire-extinguisher"></i> Expertise Incendie</h3>
                        <ul class="sidebar-nav-list">
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="cablage-incendie"><i class="fas fa-angle-right"></i> Câblage incendie</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="detection-adressable"><i class="fas fa-angle-right"></i> Détection adressable</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="detection-conventionnelle"><i class="fas fa-angle-right"></i> Détection conventionnelle</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="sirenes-incendie"><i class="fas fa-angle-right"></i> Sirènes incendie</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="declencheurs-manuels"><i class="fas fa-angle-right"></i> Déclencheurs manuels</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="centrales-incendie"><i class="fas fa-angle-right"></i> Centrales incendie</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="extincteurs"><i class="fas fa-angle-right"></i> Extincteurs</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="unites-mobiles"><i class="fas fa-angle-right"></i> Unités mobiles</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="ria"><i class="fas fa-angle-right"></i> RIA & Tuyaux</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="bouches-incendie"><i class="fas fa-angle-right"></i> Bouches d'incendie</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="equipements-pompiers"><i class="fas fa-angle-right"></i> Équipements pompiers</button></li>
                            <li><button class="sidebar-filter-btn" data-category="incendie" data-subcategory="emulseurs"><i class="fas fa-angle-right"></i> Émulseurs</button></li>
                        </ul>
                    </div>
                    <div class="sidebar-block theme-video" style="margin-top: 2rem;">
                        <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-video"></i> Expertise Vidéo</h3>
                        <ul class="sidebar-nav-list">
                            <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="classiques"><i class="fas fa-angle-right"></i> Caméras Classiques</button></li>
                            <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="discretes"><i class="fas fa-angle-right"></i> Caméras Discrètes</button></li>
                            <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="intelligentes"><i class="fas fa-angle-right"></i> Intelligentes & Thermiques</button></li>
                            <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="specifiques"><i class="fas fa-angle-right"></i> Industrielles & Spécifiques</button></li>
                        </ul>
                    </div>
                </aside>
                <div class="catalogue-content">
                    <div class="product-grid">
"""
if '<div class="catalogue-main-layout">' not in html:
    html = html.replace('<div class="product-grid">', sidebar_html)

# Add closing divs before </section>
if '</div>\n                </div>\n            </div>\n        </div>\n    </section>' not in html:
    # `catalogue.html` has `</div>\n        </div>\n    </section>` currently for the container and section.
    # We need to add `</div></div>` for catalogue-content and catalogue-main-layout.
    html = html.replace('</div>\n        </div>\n    </section>', '</div>\n                </div>\n            </div>\n        </div>\n    </section>')

# 2. EXTRACT ACCORDIONS AND CONVERT TO PRODUCT CARDS
# The accordion starts with `<div class="accordion-item">` and ends before `<!-- === SECOURS === -->` or `<!-- Floating Cart Widget -->`
def parse_accordions(html_text):
    accordions = []
    items = re.findall(r'<div class="accordion-item">(.*?)</div>\s*(?:<!--|<div class="accordion-item"|</section>)', html_text, re.DOTALL)
    for item in items:
        # Title
        title_match = re.search(r'<span class="accordion-title">(.*?)</span>', item)
        if not title_match: continue
        title = title_match.group(1).strip()
        
        # Determine category and slug based on title
        category = 'incendie'
        if 'câblage' in title.lower(): slug = 'cablage-incendie'
        elif 'adressable' in title.lower(): slug = 'detection-adressable'
        elif 'conventionnelle' in title.lower(): slug = 'detection-conventionnelle'
        elif 'sirènes' in title.lower(): slug = 'sirenes-incendie'
        elif 'déclencheurs' in title.lower(): slug = 'declencheurs-manuels'
        elif 'centrales' in title.lower(): slug = 'centrales-incendie'
        else: slug = title.lower().replace(' ', '-')
        
        products = []
        lis = re.findall(r'<li>(.*?)</li>', item, re.DOTALL)
        for li in lis:
            img_match = re.search(r'<img src="(.*?)" alt="(.*?)"', li)
            name_match = re.search(r'<strong>(.*?)</strong>', li)
            if img_match and name_match:
                products.append({
                    'img_src': img_match.group(1),
                    'name': name_match.group(1).strip()
                })
        
        accordions.append({'slug': slug, 'category': category, 'products': products})
    return accordions

acc_data = parse_accordions(html)

acc_cards = ""
for acc in acc_data:
    for prod in acc['products']:
        acc_cards += f"""
                <div class="product-card" data-category="{acc['category']}" data-subcategory="{acc['slug']}">
                    <div class="product-image">
                        <img src="{prod['img_src']}" alt="{prod['name']}">
                    </div>
                    <div class="product-info">
                        <h3>{prod['name']}</h3>
                        <p>Équipement de qualité professionnelle pour votre sécurité.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="{prod['name']}">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>
"""

# Now REMOVE ALL ACCORDIONS from html
html = re.sub(r'<div class="accordion-item">.*?</ul>\s*</div>\s*</div>\s*</div>', '', html, flags=re.DOTALL)

# Insert the acc_cards just before <!-- === SECOURS === -->
html = html.replace('<!-- === SECOURS === -->', acc_cards + '\n                <!-- === SECOURS === -->')

# 3. ADD MISSING SUBCATEGORIES TO INCENDIE PRODUCTS
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/extincteur_a_eau.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/extincteur_a_eau.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/Extincteur à eau + additif.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/Extincteur à eau + additif.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/Extincteur a poudre.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/Extincteur a poudre.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/poudreBC.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/poudreBC.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/extincteurCO2.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/extincteurCO2.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/extincteur_a_mousse.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/extincteur_a_mousse.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/extincteurD.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/extincteurD.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/extincteurF.png"', '<div class="product-card" data-category="incendie" data-subcategory="extincteurs">\n                    <div class="product-image">\n                        <img src="assets/extincteurF.png"')

html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/RIA.png"', '<div class="product-card" data-category="incendie" data-subcategory="ria">\n                    <div class="product-image">\n                        <img src="assets/RIA.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/tuyaudincendi.png"', '<div class="product-card" data-category="incendie" data-subcategory="ria">\n                    <div class="product-image">\n                        <img src="assets/tuyaudincendi.png"')

html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/bouches_incendie.png"', '<div class="product-card" data-category="incendie" data-subcategory="bouches-incendie">\n                    <div class="product-image">\n                        <img src="assets/bouches_incendie.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/equipements_pompiers.png"', '<div class="product-card" data-category="incendie" data-subcategory="equipements-pompiers">\n                    <div class="product-image">\n                        <img src="assets/equipements_pompiers.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/emulseurs.png"', '<div class="product-card" data-category="incendie" data-subcategory="emulseurs">\n                    <div class="product-image">\n                        <img src="assets/emulseurs.png"')
html = html.replace('<div class="product-card" data-category="incendie">\n                    <div class="product-image">\n                        <img src="assets/unites_mobiles_incendie.png"', '<div class="product-card" data-category="incendie" data-subcategory="unites-mobiles">\n                    <div class="product-image">\n                        <img src="assets/unites_mobiles_incendie.png"')

# Remove old generic detectors that are replaced by the new cards
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/detecteur_fumee\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/detecteur_chaleur\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/detecteur_flamme\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/sirene_incendie\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/declencheur_manuel\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/alarme_adressable\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/alarme_conventionnelle\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="product-card" data-category="incendie">\s*<div class="product-image">\s*<img src="assets/centrale_incendie\.png".*?</div>\s*</div>', '', html, flags=re.DOTALL)

# Add missing top filter "video"
if 'data-filter="video"' not in html:
    html = html.replace('<button class="filter-btn" data-filter="secours">Secours & Signalisation</button>', '<button class="filter-btn" data-filter="secours">Secours & Signalisation</button>\n                <button class="filter-btn" data-filter="video">Vidéosurveillance & Sécurité</button>')

# 4. ADD CASQUES EPI (from the lost work)
casques_html = """
                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque electrique isolant.png" alt="Casque électrique isolant">
                    </div>
                    <div class="product-info">
                        <h3>Casque électrique isolant</h3>
                        <p>Protection contre les risques électriques jusqu'à 1000V. Idéal pour les électriciens.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque électrique isolant">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>

                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque avec protection auditive.png" alt="Casque avec protection auditive">
                    </div>
                    <div class="product-info">
                        <h3>Casque avec protection auditive</h3>
                        <p>Casque intégré avec coquilles anti-bruit pour environnements industriels bruyants.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque avec protection auditive">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>

                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque avec protection auditive2.png" alt="Casque avec protection auditive (Modèle 2)">
                    </div>
                    <div class="product-info">
                        <h3>Casque forestier avec visière</h3>
                        <p>Protection complète avec visière grillagée et anti-bruit pour les travaux forestiers.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque forestier">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>

                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque pour travailleur en hauteur.png" alt="Casque pour travailleur en hauteur">
                    </div>
                    <div class="product-info">
                        <h3>Casque travailleur en hauteur</h3>
                        <p>Conception légère sans visière avec jugulaire 4 points pour éviter la perte en cas de chute.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque travailleur en hauteur">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>

                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque de pompier.png" alt="Casque de pompier F1/F2">
                    </div>
                    <div class="product-info">
                        <h3>Casque de pompier</h3>
                        <p>Casque d'intervention résistant aux flammes et aux températures extrêmes.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque de pompier">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>

                <div class="product-card" data-category="epi" data-subcategory="casques-de-securite">
                    <div class="product-image">
                        <img src="assets/casque mineur.png" alt="Casque de mineur">
                    </div>
                    <div class="product-info">
                        <h3>Casque de mineur</h3>
                        <p>Casque renforcé avec fixation pour lampe frontale, conçu pour l'industrie minière.</p>
                        <button class="btn btn-outline btn-add-quote" data-product="Casque de mineur">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>
"""
# Ensure the existing casque also gets the subcategory
html = html.replace('<div class="product-card" data-category="epi">\n                    <div class="product-image">\n                        <img src="assets/casque_chantier.png"', '<div class="product-card" data-category="epi" data-subcategory="casques-de-securite">\n                    <div class="product-image">\n                        <img src="assets/casque_chantier.png"')
html = html.replace('<!-- === EPI === -->', '<!-- === EPI === -->\n' + casques_html)

# 5. ADD THE 40 CAMERAS (Use generate_cameras.py array)
# I will just run generate_cameras.py after this script executes! Wait, `generate_cameras.py` is in the scratch folder, it reads catalogue.html and appends cameras.
# Let's save this restored html and then execute `generate_cameras.py` again.

with open('catalogue.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Restored layout successfully.")
