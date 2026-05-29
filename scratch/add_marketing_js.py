js_content = """

// ==========================================
// MARKETING & PUBLICITÉ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Top Bar Promotionnelle
    const promoTopbar = document.getElementById('promo-topbar');
    const promoClose = document.getElementById('promo-close');
    
    if (promoTopbar && promoClose) {
        // Vérifier si déjà fermée dans cette session
        if (sessionStorage.getItem('promoClosed') === 'true') {
            promoTopbar.style.display = 'none';
        }
        
        promoClose.addEventListener('click', () => {
            promoTopbar.classList.add('closed');
            sessionStorage.setItem('promoClosed', 'true');
        });
    }

    // 2. Exit Intent Pop-up (Lead Magnet)
    const exitPopup = document.getElementById('exit-popup');
    const exitPopupClose = document.getElementById('exit-popup-close');
    const modalOverlay = document.getElementById('modal-overlay');

    if (exitPopup && exitPopupClose && modalOverlay) {
        
        // Fermer le popup
        exitPopupClose.addEventListener('click', () => {
            exitPopup.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Détecter la sortie de la souris vers le haut (intent de fermer l'onglet)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0) {
                // Vérifier si la pop-up a déjà été montrée
                if (!sessionStorage.getItem('exitPopupShown')) {
                    // Afficher la pop-up
                    exitPopup.classList.add('active');
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Enregistrer pour ne pas spammer l'utilisateur
                    sessionStorage.setItem('exitPopupShown', 'true');
                }
            }
        });
    }
});
"""

with open('script.js', 'a', encoding='utf-8') as f:
    f.write(js_content)

print("Marketing JS added.")
