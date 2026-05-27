document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Form Submission Handling (Supabase)
    const SUPABASE_URL = 'https://htjjgpceefldmcwnwxvm.supabase.co'; // URL de votre projet
    const SUPABASE_ANON_KEY = 'sb_publishable_9p7lkNwYQ-CZg76h2P9qUg_oEqHkdFe'; // Clé Publiable
    
    // Initialisation de Supabase (uniquement si les clés sont fournies et supabase est chargé)
    let supabaseClient = null;
    if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'VOTRE_URL_SUPABASE_ICI') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // On bloque l'envoi classique
            
            // Anti-Spam Honeypot Check
            const botCheck = document.getElementById('bot-check');
            if (botCheck && botCheck.value !== '') {
                console.warn('Bot detected. Submission blocked.');
                return; // Silent failure for bots
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            // Récupération des données
            const formData = {
                telephone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                type_besoin: document.getElementById('type-besoin').value,
                type_batiment: document.getElementById('type-batiment').value,
                emplacement: document.getElementById('emplacement').value,
                details: document.getElementById('message').value
            };

            if (!supabaseClient) {
                alert("Erreur: Supabase n'est pas configuré. Veuillez recharger la page.");
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                return;
            }

            try {
                // 1. Envoi à Supabase (Base de données)
                const { data, error } = await supabaseClient
                    .from('soumissions')
                    .insert([formData]);

                if (error) throw error;

                // 2. Envoi de l'email via FormSubmit (Notification par mail)
                await fetch("https://formsubmit.co/ajax/globalcustomersynergy@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: "Nouvelle Demande de Soumission (Site Web)",
                        _template: "table",
                        ...formData // On inclut toutes les données du formulaire
                    })
                });

                // Succès global
                btn.innerHTML = '<i class="fas fa-check"></i> Demande envoyée !';
                btn.style.backgroundColor = '#10B981'; // Vert
                contactForm.reset();

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur. Réessayez.';
                btn.style.backgroundColor = '#E31837'; // Rouge
            }

            // Reset du bouton après 3 secondes
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 3000);
        });
    }

    // 5. Modals Logic
    const openModalBtns = document.querySelectorAll('.open-modal');
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 6. Search Modal Logic
    const searchBtns = document.querySelectorAll('.search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Dictionnaire des pages et services pour la recherche
    const searchData = [
        { title: "Extincteurs", desc: "Vente, installation et maintenance d'extincteurs", link: "services.html" },
        { title: "Systèmes d'alarme", desc: "Alarmes incendie et détection", link: "services.html" },
        { title: "Formations", desc: "Formation incendie, évacuation et secourisme", link: "services.html" },
        { title: "Courtage d'affaires", desc: "Expertise et mise en relation B2B", link: "services.html" },
        { title: "Nos Services", desc: "Découvrez tous nos domaines d'expertise", link: "services.html" },
        { title: "À Propos", desc: "Découvrez notre équipe et nos représentants", link: "about.html" },
        { title: "Demande de Soumission", desc: "Contactez-nous pour un devis", link: "contact.html" },
        { title: "Mentions Légales", desc: "Informations juridiques de l'entreprise", link: "mentions-legales.html" },
        { title: "Accueil", desc: "Page d'accueil de Global Customer Synergy", link: "index.html" }
    ];

    function openSearch() {
        if (searchModal) {
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
            document.body.style.overflow = 'hidden';
            renderResults(""); // Reset
            searchInput.value = "";
        }
    }

    function closeSearch() {
        if (searchModal) {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function renderResults(query) {
        if (!searchResults) return;
        searchResults.innerHTML = '';
        
        const filtered = searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) || 
            item.desc.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div style="color: #fff; padding: 1rem; text-align: center;">Aucun résultat trouvé</div>';
            return;
        }

        filtered.forEach(item => {
            const a = document.createElement('a');
            a.href = item.link;
            a.className = 'search-result-item';
            a.innerHTML = `
                <div>
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-desc">${item.desc}</div>
                </div>
                <i class="fas fa-chevron-right" style="color: var(--accent-red);"></i>
            `;
            searchResults.appendChild(a);
        });
    }

    searchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    });

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) closeSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderResults(e.target.value);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });
});

/* =========================================
   CATALOGUE DE PRODUITS & DEVIS LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le panier depuis le localStorage
    let quoteCart = JSON.parse(localStorage.getItem('gcs_quote_cart')) || [];
    
    const cartCountEl = document.getElementById('cartCount');
    const floatingCart = document.getElementById('floatingCart');
    
    // Fonction pour mettre à jour l'affichage du panier
    function updateCartDisplay() {
        if (!cartCountEl || !floatingCart) return;
        
        cartCountEl.textContent = quoteCart.length;
        
        if (quoteCart.length > 0) {
            floatingCart.classList.add('visible');
        } else {
            floatingCart.classList.remove('visible');
        }
    }
    
    updateCartDisplay();
    
    // Gestion des clics sur "Ajouter au devis"
    const addQuoteBtns = document.querySelectorAll('.btn-add-quote');
    addQuoteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            
            // Animation du bouton
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            this.classList.add('btn-primary');
            this.classList.remove('btn-outline');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
            }, 1500);
            
            // Ajouter au panier
            quoteCart.push(productName);
            localStorage.setItem('gcs_quote_cart', JSON.stringify(quoteCart));
            
            updateCartDisplay();
        });
    });
    
    // Filtres du catalogue
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer l'état actif de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajouter l'état actif au bouton cliqué
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Auto-remplissage du formulaire de contact si on vient du panier
    const messageField = document.getElementById('message');
    if (messageField && quoteCart.length > 0) {
        // Seulement si le champ est vide
        if (messageField.value.trim() === '') {
            let messageText = "Bonjour, je souhaite obtenir un devis pour les équipements suivants :\n\n";
            quoteCart.forEach((item, index) => {
                messageText += `- ${item}\n`;
            });
            messageText += "\nMerci de me recontacter.";
            messageField.value = messageText;
        }
    }
    
    // Vider le panier après soumission réussie du formulaire (optionnel)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            // On peut vider le panier une fois envoyé
            // localStorage.removeItem('gcs_quote_cart');
        });
    }
});
