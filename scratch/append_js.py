with open('script.js', 'a', encoding='utf-8') as f:
    f.write('''

// Gestionnaire global pour remplacer les onerror inline (Sécurité)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fallback-img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'assets/hero-image.png';
        });
    });

    // Gestionnaire global pour remplacer les onclick inline du catalogue (Sécurité)
    document.querySelectorAll('.trigger-subcategory').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const targetBtn = document.querySelector(`[data-subcategory='${target}']`);
            if (targetBtn) targetBtn.click();
        });
    });
});
''')
print("Appended logic to script.js")
