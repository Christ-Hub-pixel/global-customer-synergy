import re

filepath = 'catalogue.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Find the start of the product grid
grid_start = html.find('<div class="product-grid">')

# 2. Extract product grid
grid_block = html[grid_start:]
depth = 0
grid_actual_end = 0
for i in range(len(grid_block) - 5):
    if grid_block[i:i+4] == '<div':
        depth += 1
    elif grid_block[i:i+5] == '</div':
        depth -= 1
        if depth == 0:
            grid_actual_end = i + 6
            break
product_grid_html = grid_block[:grid_actual_end]

# 3. Find EPI Section
epi_section_start = html.find('<!-- Guide d\'Expertise EPI Section -->')
epi_acc_start = html.find('<div class="accordion-container">', epi_section_start)
epi_acc_block = html[epi_acc_start:]
depth = 0
epi_actual_end = 0
for i in range(len(epi_acc_block) - 5):
    if epi_acc_block[i:i+4] == '<div':
        depth += 1
    elif epi_acc_block[i:i+5] == '</div':
        depth -= 1
        if depth == 0:
            epi_actual_end = i + 6
            break
epi_accordion_html = epi_acc_block[:epi_actual_end]

# 4. Find Incendie Section
inc_section_start = html.find('<!-- Guide d\'Expertise Incendie Section -->')
inc_acc_start = html.find('<div class="accordion-container">', inc_section_start)
inc_acc_block = html[inc_acc_start:]
depth = 0
inc_actual_end = 0
for i in range(len(inc_acc_block) - 5):
    if inc_acc_block[i:i+4] == '<div':
        depth += 1
    elif inc_acc_block[i:i+5] == '</div':
        depth -= 1
        if depth == 0:
            inc_actual_end = i + 6
            break
inc_accordion_html = inc_acc_block[:inc_actual_end]

# 5. Build New Layout
new_layout = f"""
            <div class="catalogue-main-layout">
                <aside class="catalogue-sidebar">
                    <div class="sidebar-block">
                        <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-hard-hat" style="color: var(--primary-blue);"></i> Expertise EPI</h3>
                        {epi_accordion_html}
                    </div>
                    <div class="sidebar-block" style="margin-top: 2rem;">
                        <h3 class="sidebar-title" style="margin-bottom: 1rem; color: var(--primary-dark); font-size: 1.25rem;"><i class="fas fa-fire-extinguisher" style="color: var(--primary-blue);"></i> Expertise Incendie</h3>
                        {inc_accordion_html}
                    </div>
                </aside>

                <div class="catalogue-content">
                    {product_grid_html}
                </div>
            </div>
"""

# 6. Assemble HTML
pre_grid = html[:grid_start]
between_grid_and_epi = html[grid_start+grid_actual_end:epi_section_start]
after_inc_section = html.find('<!-- Floating Cart Widget -->', inc_section_start)
post_incendie = html[after_inc_section:]

new_html = pre_grid + new_layout + between_grid_and_epi + post_incendie

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("HTML refactored successfully.")
