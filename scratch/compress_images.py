import os
import glob
from PIL import Image

assets_dir = 'assets'
html_files = glob.glob('*.html')
css_files = glob.glob('*.css')
js_files = glob.glob('*.js')

# Keep track of old to new filenames for safe replacement
replacements = {}

print("Starting image compression to WebP...")

# 1. Convert Images
for filename in os.listdir(assets_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        file_path = os.path.join(assets_dir, filename)
        name, ext = os.path.splitext(filename)
        new_filename = f"{name}.webp"
        new_file_path = os.path.join(assets_dir, new_filename)
        
        # Avoid reconverting if already exists
        if os.path.exists(new_file_path) and new_filename != filename:
            replacements[filename] = new_filename
            continue
            
        try:
            with Image.open(file_path) as img:
                # Convert RGBA to RGB for JPEG-like webp compression
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                
                # Save as WebP
                img.save(new_file_path, 'webp', quality=85, optimize=True)
                print(f"Converted: {filename} -> {new_filename}")
                replacements[filename] = new_filename
        except Exception as e:
            print(f"Error converting {filename}: {e}")

# 2. Update References in HTML, CSS, JS
files_to_update = html_files + css_files + js_files

print(f"Updating references in {len(files_to_update)} files...")

for file in files_to_update:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        for old_img, new_img in replacements.items():
            # Replace URL encoded versions too
            old_encoded = old_img.replace(' ', '%20')
            new_encoded = new_img.replace(' ', '%20')
            
            content = content.replace(f"assets/{old_img}", f"assets/{new_img}")
            content = content.replace(f"assets/{old_encoded}", f"assets/{new_encoded}")
            
        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated references in {file}")
            
    except Exception as e:
        print(f"Error updating {file}: {e}")

print("WebPerf optimization: Image compression complete.")
