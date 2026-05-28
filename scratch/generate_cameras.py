import re

# Data for the 40 cameras
cameras = [
    ("Caméra Dome", "classiques", "Caméra dôme standard pour surveillance en intérieur, offrant une vision à 360° et un design discret."),
    ("Caméra Bullet", "classiques", "Caméra de forme cylindrique très visible, idéale pour dissuader les intrus en extérieur avec vision infrarouge."),
    ("Caméra PTZ (Pan Tilt Zoom)", "classiques", "Caméra motorisée permettant des mouvements panoramiques, d'inclinaison et un zoom optique puissant."),
    ("Caméra IP", "classiques", "Caméra réseau haute définition se connectant directement à votre infrastructure IP pour une transmission sécurisée."),
    ("Caméra Analogique", "classiques", "Caméra traditionnelle fiable et économique, compatible avec les enregistreurs DVR standards."),
    ("Caméra Infrarouge (IR)", "specifiques", "Caméra dotée de LED infrarouges pour une vision nocturne parfaite même dans l'obscurité totale."),
    ("Caméra Wi-Fi", "classiques", "Caméra sans fil facilitant l'installation dans des zones difficiles d'accès sans câblage réseau."),
    ("Caméra Cachée", "discretes", "Caméra miniature dissimulée pour une surveillance ultra-discrète sans alerter les personnes présentes."),
    ("Caméra Thermique", "intelligentes", "Détecte la chaleur émise par les objets et les personnes, idéale pour la surveillance périmétrique de nuit ou dans le brouillard."),
    ("Caméra Fisheye 360°", "specifiques", "Objectif ultra grand-angle offrant une vue panoramique complète sans angle mort pour les grands espaces."),
    ("Caméra Speed Dome", "specifiques", "Dôme motorisé très haute vitesse pour un suivi rapide et précis des sujets en mouvement."),
    ("Caméra Mini Dôme", "discretes", "Version ultra-compacte de la caméra dôme, conçue pour s'intégrer discrètement dans les espaces restreints."),
    ("Caméra Box", "specifiques", "Caméra professionnelle à objectif interchangeable, parfaite pour des besoins spécifiques en qualité d'image."),
    ("Caméra Tourelle (Turret)", "specifiques", "Caméra sans dôme de protection en verre pour éviter les reflets IR, idéale pour l'extérieur."),
    ("Caméra Anti-vandale", "specifiques", "Protégée par un boîtier IK10 résistant aux chocs et aux tentatives de destruction intentionnelles."),
    ("Caméra Solaire", "specifiques", "Alimentée par panneau solaire, parfaite pour les sites isolés sans raccordement électrique."),
    ("Caméra 4G / SIM", "specifiques", "Transmet les images via le réseau mobile, idéale pour les chantiers et les zones blanches."),
    ("Caméra Reconnaissance faciale", "intelligentes", "Intègre une IA pour identifier et comparer les visages avec une base de données en temps réel."),
    ("Caméra LAPI (lecture de plaques)", "intelligentes", "Conçue pour capturer et lire avec précision les plaques d'immatriculation de jour comme de nuit."),
    ("Caméra HD", "classiques", "Offre une résolution haute définition standard (720p) pour une surveillance de base claire."),
    ("Caméra Full HD", "classiques", "Résolution 1080p pour des images nettes et détaillées, le standard actuel de la vidéosurveillance."),
    ("Caméra 4K Ultra HD", "classiques", "Résolution exceptionnelle permettant de zoomer numériquement dans l'image sans perte de qualité."),
    ("Caméra Jour/Nuit", "classiques", "Bascule automatiquement du mode couleur au mode noir et blanc pour s'adapter à la luminosité."),
    ("Caméra Espion", "discretes", "Dispositif miniature intégré dans des objets du quotidien pour une surveillance secrète."),
    ("Caméra Pinhole", "discretes", "Objectif sténopé minuscule nécessitant seulement un trou de quelques millimètres pour filmer."),
    ("Caméra Réseau (Network Camera)", "classiques", "Caméra IP avancée avec traitement d'image intégré et encodage vidéo performant."),
    ("Caméra Thermographique", "intelligentes", "Mesure avec précision la température des équipements industriels pour prévenir les incendies."),
    ("Caméra de comptage de personnes", "intelligentes", "Analyse vidéo pour compter les flux de personnes dans les magasins ou bâtiments publics."),
    ("Caméra intelligente IA", "intelligentes", "Intègre des algorithmes de deep learning pour distinguer humains, véhicules et animaux."),
    ("Caméra multisensorielle", "specifiques", "Intègre plusieurs capteurs dans un seul boîtier pour couvrir plusieurs directions simultanément."),
    ("Caméra panoramique", "specifiques", "Combine plusieurs objectifs pour recréer une image panoramique fluide à 180° ou 360°."),
    ("Caméra extérieure étanche", "specifiques", "Certifiée IP67 pour résister à la pluie, la poussière et aux conditions climatiques extrêmes."),
    ("Caméra intérieure", "specifiques", "Conçue pour une intégration esthétique dans les bureaux et commerces avec un éclairage standard."),
    ("Caméra mobile embarquée", "specifiques", "Conçue pour résister aux vibrations dans les bus, trains et véhicules d'intervention."),
    ("Caméra pour ascenseur", "specifiques", "Objectif très grand angle adapté aux espaces confinés et transmetteur sans fil spécifique."),
    ("Caméra de circulation routière", "specifiques", "Optimisée pour capturer des véhicules à haute vitesse et gérer les phares de nuit."),
    ("Caméra de surveillance industrielle", "specifiques", "Résistante aux environnements très poussiéreux ou corrosifs (usines, mines)."),
    ("Caméra pour entrepôt", "specifiques", "Équipée d'un puissant zoom et d'un éclairage IR longue portée pour les grandes allées."),
    ("Caméra anti-explosion", "specifiques", "Boîtier certifié ATEX pour éviter toute étincelle dans les atmosphères explosives (pétrochimie)."),
    ("Caméra marine / portuaire", "specifiques", "Boîtier en acier inoxydable 316L résistant à la corrosion saline et aux tempêtes maritimes.")
]

# Read catalogue.html
with open('catalogue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add top filter
if 'data-filter="video"' not in content:
    content = content.replace(
        '<button class="filter-btn" data-filter="secours">Secours & Signalisation</button>',
        '<button class="filter-btn" data-filter="secours">Secours & Signalisation</button>\n                <button class="filter-btn" data-filter="video">Vidéosurveillance & Sécurité</button>'
    )

# 2. Add sidebar block
sidebar_html = """
<div class="sidebar-block theme-video" style="margin-top: 2rem;">
    <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-video"></i> Expertise Vidéo</h3>
    <ul class="sidebar-nav-list">
        <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="classiques"><i class="fas fa-angle-right"></i> Caméras Classiques</button></li>
        <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="discretes"><i class="fas fa-angle-right"></i> Caméras Discrètes</button></li>
        <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="intelligentes"><i class="fas fa-angle-right"></i> Intelligentes & Thermiques</button></li>
        <li><button class="sidebar-filter-btn" data-category="video" data-subcategory="specifiques"><i class="fas fa-angle-right"></i> Industrielles & Spécifiques</button></li>
    </ul>
</div>
"""
if 'Expertise Vidéo' not in content:
    content = content.replace('</aside>', sidebar_html + '\n</aside>')

# 3. Generate 40 product cards
products_html = "\n                <!-- === VIDEOSURVEILLANCE === -->\n"
for title, subcat, desc in cameras:
    products_html += f"""                <div class="product-card" data-category="video" data-subcategory="{subcat}">
                    <div class="product-image">
                        <img src="assets/camera_placeholder.png" alt="{title}">
                    </div>
                    <div class="product-info">
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <button class="btn btn-outline btn-add-quote" data-product="{title}">
                            <i class="fas fa-cart-plus"></i> Ajouter au devis
                        </button>
                    </div>
                </div>\n"""

# Find insertion point: end of product grid
# We can look for the last product card or the closing of product-grid
# The product grid closes right before `</div>` and `<div class="catalogue-footer">` (if it exists) or similar.
# In catalogue.html, let's find the `<!-- === SECOURS === -->` and insert after its block, or just insert right before `</div>` of `product-grid`.
# Wait, replacing `<!-- === END OF PRODUCTS === -->` is safer, but it might not exist.
if '<!-- === VIDEOSURVEILLANCE === -->' not in content:
    # Find the last `</div>\n                </div>` in the product-grid.
    # Let's insert it before `</section>` of catalogue-section, wait, `product-grid` is inside `catalogue-content`.
    # Let's use regex to find the end of `product-grid`
    match = re.search(r'(<div class="product-card"[^>]*>.*?</div>\s*</div>)(\s*)</div>\s*</div>\s*</section>', content, re.DOTALL)
    if match:
        content = content[:match.end(1)] + "\n" + products_html + match.group(2) + "</div>\n                </div>\n            </section>"
    else:
        print("Could not find insertion point for products!")

# Write back
with open('catalogue.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modification terminee.")
