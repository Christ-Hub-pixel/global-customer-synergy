from bs4 import BeautifulSoup
import json

with open("catalogue.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

products = []
cards = soup.find_all("div", class_="product-card")
for card in cards:
    h3 = card.find("h3")
    p = card.find("p")
    if h3 and p:
        title = h3.text.strip().replace('"', '\\"')
        desc = p.text.strip().replace('\n', ' ').replace('\r', ' ').replace('"', '\\"')
        # Truncate description if too long
        if len(desc) > 80:
            desc = desc[:77] + "..."
        products.append(f'        {{ title: "{title}", desc: "{desc}", link: "catalogue.html" }}')

print(",\n".join(products))
