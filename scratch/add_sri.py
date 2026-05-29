import glob
import os

html_files = glob.glob('*.html')

fa_old = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
fa_new = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0" crossorigin="anonymous">'

supa_old1 = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
supa_old2 = '<script src="https://unpkg.com/@supabase/supabase-js@2"></script>'
supa_new = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js" integrity="sha384-+exuGmToMCgcfiTDu+P+1aCmlH2Mis7lstkjVmVHdwvJqtNNqhxMreqsIe6bVstn" crossorigin="anonymous"></script>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(fa_old, fa_new)
    content = content.replace(supa_old1, supa_new)
    content = content.replace(supa_old2, supa_new)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("SRI added to all HTML files.")
