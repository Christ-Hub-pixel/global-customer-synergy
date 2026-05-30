import glob
import os

footer_addition = """            </div>
            <div class="footer-col">
                <h4>Contactez-nous</h4>
                <ul style="list-style:none; padding:0;">
                    <li style="margin-bottom: 0.8rem; display: flex; align-items: flex-start; gap: 10px;"><i class="fas fa-map-marker-alt" style="color: var(--primary); margin-top: 4px;"></i> <span>Abidjan, Marcory Hibiscus<br>Immeuble La Madone</span></li>
                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;"><i class="fas fa-phone-alt" style="color: var(--primary);"></i> <a href="tel:+2250505058433" style="color: #cbd5e1; text-decoration: none;">+225 05 05 05 84 33</a></li>
                    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;"><i class="fas fa-envelope" style="color: var(--primary);"></i> <a href="mailto:Contact@globalcustomersynergy.com" style="color: #cbd5e1; text-decoration: none; word-break: break-word;">Contact@globalcustomersynergy.com</a></li>
                </ul>
            </div>
        </div>"""

for filepath in glob.glob("*.html"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We look for the end of the Nos Services column
    # Usually it's:
    #             </ul>
    #         </div>
    #     </div>
    #     <div class="footer-bottom">
    
    target = """            </div>
        </div>
        <div class="footer-bottom">"""
    
    if target in content:
        content = content.replace(target, footer_addition + "\n        <div class=\"footer-bottom\">")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        # try another target format in case of indentation differences
        target2 = """                </ul>
            </div>
        </div>
        <div class="footer-bottom">"""
        
        if target2 in content:
            content = content.replace(target2, """                </ul>
""" + footer_addition + "\n        <div class=\"footer-bottom\">")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
        else:
            print(f"Target not found in {filepath}")
