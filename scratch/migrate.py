import re
import os

filepath = 'catalogue.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Helper function to generate slug
def slugify(text):
    text = text.lower()
    text = re.sub(r'[éèêë]', 'e', text)
    text = re.sub(r'[àâä]', 'a', text)
    text = re.sub(r'[îï]', 'i', text)
    text = re.sub(r'[ôö]', 'o', text)
    text = re.sub(r'[ûüù]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# We need to extract the sidebar blocks
epi_block_match = re.search(r'<div class="sidebar-block theme-epi">(.*?)</div>\s*<div class="sidebar-block theme-incendie', html, re.DOTALL)
inc_block_match = re.search(r'<div class="sidebar-block theme-incendie"(.*?)</div>\s*</aside>', html, re.DOTALL)

if not epi_block_match or not inc_block_match:
    print("Could not find sidebar blocks")
    exit(1)

epi_html = epi_block_match.group(1)
inc_html = inc_block_match.group(1)

# Extract accordions and their items
def parse_accordions(block_html, category):
    accordions = []
    items_html = re.findall(r'<div class="accordion-item">(.*?)</div>\s*(?:<!--|<div class="accordion-item"|</div>)', block_html, re.DOTALL)
    
    # We will use a simpler regex
    items = block_html.split('<div class="accordion-item">')[1:]
    
    for item in items:
        # Title
        title_match = re.search(r'<span class="accordion-title">(.*?)</span>', item)
        if not title_match: continue
        title = title_match.group(1).strip()
        subcategory_slug = slugify(title)
        
        # Products
        products = []
        lis = re.findall(r'<li>(.*?)</li>', item, re.DOTALL)
        for li in lis:
            img_match = re.search(r'<img src="(.*?)" alt="(.*?)"', li)
            name_match = re.search(r'<strong>(.*?)</strong>', li)
            if img_match and name_match:
                products.append({
                    'img_src': img_match.group(1),
                    'img_alt': img_match.group(2),
                    'name': name_match.group(1).strip()
                })
        
        accordions.append({
            'title': title,
            'slug': subcategory_slug,
            'category': category,
            'products': products
        })
    return accordions

epi_data = parse_accordions(epi_html, 'epi')
inc_data = parse_accordions(inc_html, 'incendie')

all_data = epi_data + inc_data

# Generate new Sidebar HTML
def generate_sidebar_block(title, icon_class, data, theme_class, inline_style=""):
    sidebar = f'<div class="sidebar-block {theme_class}" {inline_style}>\n'
    sidebar += f'    <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="{icon_class}"></i> {title}</h3>\n'
    sidebar += '    <ul class="sidebar-nav-list">\n'
    for acc in data:
        sidebar += f'        <li><button class="sidebar-filter-btn" data-category="{acc["category"]}" data-subcategory="{acc["slug"]}"><i class="fas fa-angle-right"></i> {acc["title"]}</button></li>\n'
    sidebar += '    </ul>\n'
    sidebar += '</div>'
    return sidebar

new_epi_sidebar = generate_sidebar_block('Expertise EPI', 'fas fa-hard-hat', epi_data, 'theme-epi')
new_inc_sidebar = generate_sidebar_block('Expertise Incendie', 'fas fa-fire-extinguisher', inc_data, 'theme-incendie', 'style="margin-top: 2rem;"')

new_sidebar_html = f"""<aside class="catalogue-sidebar">
{new_epi_sidebar}
{new_inc_sidebar}
</aside>"""

# Generate Product Cards HTML
new_product_cards = ""
for acc in all_data:
    for prod in acc['products']:
        card = f"""
                <div class="product-card" data-category="{acc['category']}" data-subcategory="{acc['slug']}">
                    <div class="product-image">
                        <img src="{prod['img_src']}" alt="{prod['img_alt']}">
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
        new_product_cards += card

# We need to replace the aside in the original html
aside_start = html.find('<aside class="catalogue-sidebar">')
aside_end = html.find('</aside>', aside_start) + 8
html = html[:aside_start] + new_sidebar_html + html[aside_end:]

# Now we need to append the new product cards to the product-grid.
# We will append them at the end of product-grid, just before `</div>\n            </div>\n` which closes the layout.
# Actually, the catalogue-main-layout ends with:
#                 <div class="catalogue-content">
#                     <div class="product-grid">...</div>
#                 </div>
#             </div>
grid_end = html.find('</div>\n                </div>\n            </div>', aside_start)
html = html[:grid_end] + new_product_cards + html[grid_end:]

with open('catalogue_new.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Created catalogue_new.html. Found {} EPI sections and {} Incendie sections.".format(len(epi_data), len(inc_data)))
