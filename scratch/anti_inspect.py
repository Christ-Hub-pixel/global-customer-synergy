# Append anti-inspect CSS
css_content = """
/* Protection Anti-Inspection & Anti-Copie */
body {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none; /* Empêche le clic droit spécifique sur l'image */
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css_content)

# Append anti-inspect JS
js_content = """

// Protection Anti-Inspection Maximale
document.addEventListener('DOMContentLoaded', () => {
    // Désactiver le clic droit
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Désactiver les raccourcis clavier (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Ctrl+Shift+I ou Ctrl+Shift+J ou Ctrl+U
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
        }
        // Ctrl+U (Code source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
        }
        // Ctrl+S (Sauvegarder)
        if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
            e.preventDefault();
        }
    });
});
"""

with open('script.js', 'a', encoding='utf-8') as f:
    f.write(js_content)

print("Anti-inspect protection added.")
