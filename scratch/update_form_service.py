import os
import glob

html_files = glob.glob('/home/christ77/Global Customer Synergy Sarl/*.html')
js_file = '/home/christ77/Global Customer Synergy Sarl/script.js'

files_to_update = html_files + [js_file]

for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()
        
    if 'formsubmit.co' in content:
        new_content = content.replace('https://formsubmit.co', 'https://api.web3forms.com')
        new_content = new_content.replace('vers formsubmit.co', 'vers web3forms')
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
