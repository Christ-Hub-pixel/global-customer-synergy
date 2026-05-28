import re
import os

with open('catalogue.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Get all images
images = [f for f in os.listdir('assets') if f.startswith('camera_') and f.endswith('.png') and f != 'camera_placeholder.png']

def replace_img(match):
    full_match = match.group(0)
    name = match.group(1).lower()
    
    img_name = 'camera_dome' # fallback
    
    if 'bullet' in name:
        img_name = 'camera_bullet'
    elif 'ptz' in name or 'speed' in name or 'tourelle' in name:
        img_name = 'camera_ptz'
    elif 'therm' in name:
        img_name = 'camera_thermique'
    elif 'espion' in name or 'cachée' in name or 'pinhole' in name or 'mini' in name:
        img_name = 'camera_espion'
    elif 'solair' in name or '4g' in name:
        img_name = 'camera_solaire'
    elif 'panoram' in name or 'fisheye' in name or '360' in name:
        img_name = 'camera_panoramique'
    elif 'vandal' in name or 'étanche' in name or 'extérieure' in name:
        img_name = 'camera_antivandale'
    elif 'embarquée' in name or 'mobile' in name or 'ascenseur' in name or 'circulation' in name:
        img_name = 'camera_embarquee'
    elif 'marine' in name or 'portuaire' in name:
        img_name = 'camera_marine'
    elif 'industri' in name or 'anti-explosion' in name:
        img_name = 'camera_industrielle'
    elif 'lapi' in name or 'reconnaissance' in name or 'comptage' in name or 'ia' in name or 'multisensori' in name:
        img_name = 'camera_lapi'
    elif 'box' in name:
        img_name = 'camera_box'
    elif 'analogique' in name:
        img_name = 'camera_analogique'
    elif 'wifi' in name or 'wi-fi' in name:
        img_name = 'camera_wifi'
    elif 'ip' in name or 'réseau' in name:
        img_name = 'camera_ip'
    elif 'infrarouge' in name or 'jour' in name or 'nuit' in name:
        img_name = 'camera_bullet' # IR are often bullets
    elif 'hd' in name or '4k' in name:
        img_name = 'camera_dome'
    
    # Try exact match first
    actual_img = next((img for img in images if img.startswith(img_name)), None)
    
    if actual_img:
        # replace whatever image is currently there
        # We need a regex that matches ANY camera image in the product card!
        # Ah wait, the previous script replaced 'assets/camera_placeholder.png'
        # BUT they are no longer placeholders!
        return f'<img src="assets/{actual_img}" alt="{match.group(1)}">'
        
    return full_match

# Since they are no longer placeholders, we need a smarter regex.
# The images are inside <div class="product-image"> \n <img src="assets/camera_..." alt="Caméra Name">
# Let's match based on data-category="video" product cards.
def update_all_camera_images(html_content):
    import re
    # Find all product cards with data-category="video"
    card_pattern = r'(<div class="product-card" data-category="video"[^>]*>.*?<img src=")([^"]+)(" alt="([^"]+)">)'
    
    def replacer(m):
        prefix = m.group(1)
        old_src = m.group(2)
        suffix = m.group(3)
        alt_text = m.group(4)
        
        # Determine new img
        name = alt_text.lower()
        img_name = 'camera_dome' # fallback
        
        if 'bullet' in name: img_name = 'camera_bullet'
        elif 'ptz' in name or 'speed' in name or 'tourelle' in name: img_name = 'camera_ptz'
        elif 'therm' in name: img_name = 'camera_thermique'
        elif 'espion' in name or 'cachée' in name or 'pinhole' in name or 'mini' in name: img_name = 'camera_espion'
        elif 'solair' in name or '4g' in name: img_name = 'camera_solaire'
        elif 'panoram' in name or 'fisheye' in name or '360' in name: img_name = 'camera_panoramique'
        elif 'vandal' in name or 'étanche' in name or 'extérieure' in name: img_name = 'camera_antivandale'
        elif 'embarquée' in name or 'mobile' in name or 'ascenseur' in name or 'circulation' in name: img_name = 'camera_embarquee'
        elif 'marine' in name or 'portuaire' in name: img_name = 'camera_marine'
        elif 'industri' in name or 'anti-explosion' in name: img_name = 'camera_industrielle'
        elif 'lapi' in name or 'reconnaissance' in name or 'comptage' in name or 'ia' in name or 'multisensori' in name: img_name = 'camera_lapi'
        elif 'box' in name: img_name = 'camera_box'
        elif 'analogique' in name: img_name = 'camera_analogique'
        elif 'wifi' in name or 'wi-fi' in name: img_name = 'camera_wifi'
        elif 'ip' in name or 'réseau' in name: img_name = 'camera_ip'
        elif 'infrarouge' in name or 'jour' in name or 'nuit' in name: img_name = 'camera_bullet'
        elif 'hd' in name or '4k' in name: img_name = 'camera_dome'
        
        actual_img = next((img for img in images if img.startswith(img_name)), None)
        if actual_img:
            return f'{prefix}assets/{actual_img}{suffix}'
        return m.group(0)

    return re.sub(card_pattern, replacer, html_content, flags=re.DOTALL)

new_html = update_all_camera_images(html)

with open('catalogue.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Images mapped dynamically!")
