css_content = """

/* ==========================================================================
   OPTIMISATIONS GPU & FLUIDITÉ
   ========================================================================== */

/* Force le rendu matériel (Carte Graphique) pour décharger le processeur central */
.gpu-accel,
.product-card,
.modal,
.hero-content,
.hero-image,
.trust-ticker-track,
.floating-card {
    will-change: transform, opacity;
    transform: translateZ(0); /* Hack matériel pour anciens ordis */
    backface-visibility: hidden;
    perspective: 1000px;
}

/* Transitions Organiques (Cubic-Bezier) au lieu de Lineaires */
.product-card {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.btn {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-link {
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal.active {
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-img {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Optimisation de l'affichage global */
html {
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

img {
    /* Évite les sauts de layout (CLS) en attendant le chargement */
    content-visibility: auto; 
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css_content)

print("GPU CSS optimizations added.")
