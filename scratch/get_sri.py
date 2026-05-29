import urllib.request
import hashlib
import base64

def get_sri(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            digest = hashlib.sha384(data).digest()
            hash_b64 = base64.b64encode(digest).decode('utf-8')
            return f"sha384-{hash_b64}"
    except Exception as e:
        return str(e)

print("FontAwesome:", get_sri("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"))
print("Supabase JS:", get_sri("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js"))
