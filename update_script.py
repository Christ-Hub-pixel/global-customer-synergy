import re

with open("script.js", "r") as f:
    content = f.read()

# We need to replace link: "catalogue.html" with link: "catalogue.html?item=" + encoded title
def replacer(match):
    full_line = match.group(0)
    title = match.group(1)
    import urllib.parse
    encoded_title = urllib.parse.quote(title)
    return full_line.replace('link: "catalogue.html"', f'link: "catalogue.html?item={encoded_title}"')

new_content = re.sub(r'\{\s*title:\s*"([^"]+)",\s*desc:\s*"[^"]+",\s*link:\s*"catalogue\.html"\s*\}', replacer, content)

with open("script.js", "w") as f:
    f.write(new_content)
