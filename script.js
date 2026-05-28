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
        // Pages générales
        { title: "Nos Services", desc: "Découvrez tous nos domaines d'expertise (incendie, sécurité, EPI...)", link: "services.html" },
        { title: "À Propos", desc: "Découvrez notre équipe et nos représentants au Canada, France, Gabon...", link: "about.html" },
        { title: "Demande de Soumission", desc: "Contactez-nous pour un devis personnalisé", link: "contact.html" },
        { title: "Mentions Légales", desc: "Informations juridiques de l'entreprise", link: "mentions-legales.html" },
        { title: "Accueil", desc: "Page d'accueil de Global Customer Synergy", link: "index.html" },
        { title: "Formations", desc: "Formation incendie, évacuation et secourisme", link: "services.html" },
        { title: "Courtage d'affaires", desc: "Expertise et mise en relation B2B", link: "services.html" },
        // Catalogue Produits (EPI, Détection, Incendie, Secours)
        { title: "Casques de sécurité", desc: "Casque de sécurité haute résistance en polycarbonate avec réglage à crémaillère...", link: "catalogue.html?item=Casques%20de%20s%C3%A9curit%C3%A9" },
        { title: "Protection respiratoire (masques, filtres)", desc: "Demi-masque et masque complet de protection respiratoire à haut confort avec ...", link: "catalogue.html?item=Protection%20respiratoire%20%28masques%2C%20filtres%29" },
        { title: "Lunettes et protections des yeux", desc: "Lunettes de protection oculaire avec oculaires anti-rayures, traitement anti-...", link: "catalogue.html?item=Lunettes%20et%20protections%20des%20yeux" },
        { title: "Protection auditive", desc: "Serre-tête de protection auditive haute performance (SNR 31dB) pour environnements...", link: "catalogue.html?item=Protection%20auditive" },
        { title: "Équipements antichute (Harnais)", desc: "Harnais de sécurité 2 points d'ancrage (dorsal et sternal) pour travaux en hauteur...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Harnais%29" },
        { title: "Équipements antichute (Longes)", desc: "Longe avec absorbeur d'énergie intégré pour l'arrêt sécurisé des chutes...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Longes%29" },
        { title: "Équipements antichute (Connecteurs)", desc: "Mousqueton et connecteur de sécurité à verrouillage automatique ou manuel...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Connecteurs%29" },
        { title: "Équipements de soudure", desc: "Cagoule de soudage automatique à cristaux liquides protégeant les...", link: "catalogue.html?item=%C3%89quipements%20de%20soudure" },
        { title: "Chaussures basses de sécurité", desc: "Bottes et chaussures de protection basses et hautes avec embout composite...", link: "catalogue.html?item=Chaussures%20basses%20de%20s%C3%A9curit%C3%A9" },
        { title: "Chaussures hautes", desc: "Bottes professionnelles renforcées pour les milieux exigeants...", link: "catalogue.html?item=Chaussures%20hautes" },
        { title: "Couvre-chaussures", desc: "Couvre-chaussures de sécurité jetables ou réutilisables, idéals pour les environnements propres...", link: "catalogue.html?item=Couvre-chaussures" },
        { title: "Cuissardes", desc: "Cuissardes de sécurité étanches, idéales pour les travaux en milieux très humides...", link: "catalogue.html?item=Cuissardes" },
        { title: "Bottes de sécurité", desc: "Bottes de sécurité étanches en PVC ou PU avec embout de protection...", link: "catalogue.html?item=Bottes%20de%20s%C3%A9curit%C3%A9" },
        { title: "Gants de manutention", desc: "Large gamme de gants de manutention fine ou lourde : protection anti-coupure...", link: "catalogue.html?item=Gants%20de%20manutention" },
        { title: "Gants anti-chaleur", desc: "Gants de protection thermique conçus pour résister aux hautes températures...", link: "catalogue.html?item=Gants%20anti-chaleur" },
        { title: "Gants anti-coupure", desc: "Gants tricotés haute résistance pour une protection optimale contre les risques...", link: "catalogue.html?item=Gants%20anti-coupure" },
        { title: "Gants anti-froid", desc: "Gants isolants conçus pour maintenir les mains au chaud tout en offrant une bonne...", link: "catalogue.html?item=Gants%20anti-froid" },
        { title: "Gants anti-vibration", desc: "Gants de protection avec coussinets absorbants pour réduire la transmission des vibrations...", link: "catalogue.html?item=Gants%20anti-vibration" },
        { title: "Gants chimiques", desc: "Gants étanches haute protection contre les produits chimiques agressifs...", link: "catalogue.html?item=Gants%20chimiques" },
        { title: "Gants pour soudeurs", desc: "Gants en cuir épais avec manchette longue, conçus pour protéger contre les projections...", link: "catalogue.html?item=Gants%20pour%20soudeurs" },
        { title: "Gants PVC", desc: "Gants enduits PVC offrant une excellente résistance à l'abrasion...", link: "catalogue.html?item=Gants%20PVC" },
        { title: "Gants jetables", desc: "Gants à usage unique en nitrile ou latex, idéals pour le secteur médical...", link: "catalogue.html?item=Gants%20jetables" },
        { title: "Gants électriciens", desc: "Gants isolants en latex spécialement conçus pour les travaux sous tension...", link: "catalogue.html?item=Gants%20%C3%A9lectriciens" },
        { title: "Combinaisons de travail", desc: "Combinaisons double fermeture et tenues de travail complètes offrant une protection...", link: "catalogue.html?item=Combinaisons%20de%20travail" },
        { title: "Gilets haute visibilité", desc: "Gilets et vêtements de signalisation à bandes réfléchissantes pour assurer une visibilité...", link: "catalogue.html?item=Gilets%20haute%20visibilit%C3%A9" },
        { title: "Manteaux de pluie", desc: "Vêtements imperméables, ensembles de pluie et coupe-vents robustes...", link: "catalogue.html?item=Manteaux%20de%20pluie" },
        { title: "Blouses de travail", desc: "Blouses d'atelier, médicales ou de laboratoire offrant confort et protection...", link: "catalogue.html?item=Blouses%20de%20travail" },
        { title: "Pantalons de travail", desc: "Pantalons multipoches robustes et ergonomiques, renforcés aux genoux...", link: "catalogue.html?item=Pantalons%20de%20travail" },
        { title: "Tabliers PVC", desc: "Tabliers de protection étanches en PVC lourd ou léger...", link: "catalogue.html?item=Tabliers%20PVC" },
        { title: "Vestes de travail", desc: "Vestes de travail multipoches et blousons professionnels...", link: "catalogue.html?item=Vestes%20de%20travail" },
        { title: "Tenues de travail", desc: "Ensembles complets de vêtements professionnels (vestes et pantalons assortis)...", link: "catalogue.html?item=Tenues%20de%20travail" },
        { title: "Vêtements de pluie", desc: "Ensembles de pluie étanches, coupe-vents et tenues de protection complètes...", link: "catalogue.html?item=V%C3%AAtements%20de%20pluie" },
        { title: "Détecteurs multi-gaz", desc: "Détecteur portable pour la surveillance continue de 1 à 4 gaz...", link: "catalogue.html?item=D%C3%A9tecteurs%20multi-gaz" },
        { title: "Détecteurs mono-gaz", desc: "Détecteur personnel ultra-robuste et sans maintenance...", link: "catalogue.html?item=D%C3%A9tecteurs%20mono-gaz" },
        { title: "Détecteurs fixes", desc: "Transmetteur fixe industriel pour la surveillance continue des gaz toxiques...", link: "catalogue.html?item=D%C3%A9tecteurs%20fixes" },
        { title: "Balises de détection", desc: "Balise de détection de zone multi-gaz pour la sécurisation temporaire...", link: "catalogue.html?item=Balises%20de%20d%C3%A9tection" },
        { title: "Capteurs de gaz", desc: "Cellules et capteurs de rechange haute précision pour détecteurs fixes et portables...", link: "catalogue.html?item=Capteurs%20de%20gaz" },
        { title: "Stations de test et d'étalonnage", desc: "Stations d'étalonnage automatiques pour vérifier, calibrer et recharger vos détecteurs...", link: "catalogue.html?item=Stations%20de%20test%20et%20d%27%C3%A9talonnage" },
        { title: "Accessoires pour détecteurs", desc: "Large gamme d'accessoires pour détecteurs : pompes d'échantillonnage, sondes...", link: "catalogue.html?item=Accessoires%20pour%20d%C3%A9tecteurs" },
        { title: "Tubes réactifs Dräger", desc: "Système éprouvé de mesure ponctuelle et rapide de gaz avec pompe de prélèvement...", link: "catalogue.html?item=Tubes%20r%C3%A9actifs%20Dr%C3%A4ger" },
        { title: "Extincteurs à eau", desc: "Extincteurs à eau pulvérisée, idéals pour les feux de classe A...", link: "catalogue.html?item=Extincteurs%20%C3%A0%20eau" },
        { title: "Extincteurs à eau + additif", desc: "Extincteurs à eau pulvérisée avec additif, redoutablement efficaces contre les feux A et B...", link: "catalogue.html?item=Extincteurs%20%C3%A0%20eau%20%2B%20additif" },
        { title: "Extincteurs à poudre", desc: "Extincteurs à poudre polyvalente ABC. Le plus polyvalent du marché, efficace sur presque tous les feux...", link: "catalogue.html?item=Extincteurs%20%C3%A0%20poudre" },
        { title: "Extincteurs à poudre BC", desc: "Extincteurs à poudre spécifiquement conçus pour les feux de liquides ou de solides liquéfiables (classe B)...", link: "catalogue.html?item=Extincteurs%20%C3%A0%20poudre%20BC" },
        { title: "Extincteurs au CO2", desc: "Extincteurs au dioxyde de carbone (CO2). Efficaces contre les feux d'origine électrique...", link: "catalogue.html?item=Extincteurs%20au%20CO2" },
        { title: "Extincteurs à mousse", desc: "Extincteurs à mousse, particulièrement recommandés pour les feux de classe B (liquides inflammables)...", link: "catalogue.html?item=Extincteurs%20%C3%A0%20mousse" },
        { title: "Extincteurs classe D", desc: "Extincteurs à poudre spéciale dédiés exclusivement aux feux de métaux (aluminium, magnésium)...", link: "catalogue.html?item=Extincteurs%20classe%20D" },
        { title: "Extincteurs classe F", desc: "Extincteurs à agent chimique humide, spécialement conçus pour les feux liés aux auxiliaires de cuisson...", link: "catalogue.html?item=Extincteurs%20classe%20F" },
        { title: "ROBINET D'INCENDIE ARMÉ (RIA)", desc: "RIA industriel complet DN 25 ou DN 33 avec dévidoir à alimentation axiale...", link: "catalogue.html?item=ROBINET%20D%27INCENDIE%20ARM%C3%89%20%28RIA%29" },
        { title: "Lances et Tuyaux incendie", desc: "Tuyaux plats de refoulement en polyester avec raccords symétriques Guillemin...", link: "catalogue.html?item=Lances%20et%20Tuyaux%20incendie" },
        { title: "Bouches incendie", desc: "Bouches et poteaux d'incendie extérieurs normalisés pour l'alimentation des engins...", link: "catalogue.html?item=Bouches%20incendie" },
        { title: "Équipements pompiers", desc: "Tenues d'intervention professionnelles ignifugées, casques F1/F2, bottes de feu...", link: "catalogue.html?item=%C3%89quipements%20pompiers" },
        { title: "Émulseurs", desc: "Émulseurs synthétiques et fluorosynthétiques haute performance pour la production de mousse...", link: "catalogue.html?item=%C3%89mulseurs" },
        { title: "Unités mobiles incendie", desc: "Extincteurs sur roues de grande capacité à poudre, eau ou CO2...", link: "catalogue.html?item=Unit%C3%A9s%20mobiles%20incendie" },
        { title: "Détecteur de fumée", desc: "Détecte efficacement les particules de fumée dès le début d'un incendie...", link: "catalogue.html?item=D%C3%A9tecteur%20de%20fum%C3%A9e" },
        { title: "Détecteur de chaleur", desc: "Détecte une hausse rapide de température. Particulièrement utilisé dans les cuisines...", link: "catalogue.html?item=D%C3%A9tecteur%20de%20chaleur" },
        { title: "Détecteur de flamme", desc: "Détecte instantanément les flammes grâce aux rayons UV/IR...", link: "catalogue.html?item=D%C3%A9tecteur%20de%20flamme" },
        { title: "Sirène incendie", desc: "Émet une alerte sonore très puissante pour l'évacuation, pouvant être combinée avec un signal lumineux...", link: "catalogue.html?item=Sir%C3%A8ne%20incendie" },
        { title: "Alarme incendie manuelle", desc: "Déclencheur manuel rouge à bouton poussoir. Permet à toute personne témoin d'activer immédiatement l'alarme...", link: "catalogue.html?item=Alarme%20incendie%20manuelle" },
        { title: "Alarme incendie adressable", desc: "Chaque détecteur possède une adresse unique. Permet au système de localiser exactement le départ de feu...", link: "catalogue.html?item=Alarme%20incendie%20adressable" },
        { title: "Alarme incendie conventionnelle", desc: "Fonctionne par découpage en zones. Moins précise que l'adressable mais constitue une solution économique...", link: "catalogue.html?item=Alarme%20incendie%20conventionnelle" },
        { title: "Centrale incendie", desc: "Le cerveau de l'installation de sécurité. Elle reçoit les alertes des capteurs et contrôle l'ensemble du système...", link: "catalogue.html?item=Centrale%20incendie" },
        { title: "Alarme vocale", desc: "Haut-parleur de sécurité diffusant des messages vocaux pré-enregistrés pour fluidifier l'évacuation...", link: "catalogue.html?item=Alarme%20vocale" },
        { title: "Alarme connectée", desc: "Système moderne qui envoie des alertes directement sur votre téléphone. Entièrement compatible domotique...", link: "catalogue.html?item=Alarme%20connect%C3%A9e" },
        { title: "Trousses de secours", desc: "Coffret médical de premiers soins complet, équipé selon les exigences...", link: "catalogue.html?item=Trousses%20de%20secours" },
        { title: "Défibrillateurs", desc: "Défibrillateur cardiaque d'urgence avec instructions vocales pas à pas...", link: "catalogue.html?item=D%C3%A9fibrillateurs" },
        { title: "Douches et lave-yeux", desc: "Station d'urgence autonome ou raccordée en acier inoxydable pour la décontamination...", link: "catalogue.html?item=Douches%20et%20lave-yeux" },
        { title: "Matériels de signalisation", desc: "Panneaux d'obligation, de danger, d'évacuation et de lutte contre l'incendie...", link: "catalogue.html?item=Mat%C3%A9riels%20de%20signalisation" },
        { title: "Cadenas de consignation", desc: "Cadenas diélectriques, moraillons de consignation multiple, dispositifs de verrouillage...", link: "catalogue.html?item=Cadenas%20de%20consignation" }
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
    const floatingWidgetContainer = document.getElementById('floatingWidgetContainer');
    
    // Fonction pour mettre à jour l'affichage du panier
    function updateCartDisplay() {
        if (!cartCountEl) return;
        
        cartCountEl.textContent = quoteCart.length;
        
        if (quoteCart.length > 0) {
            if (floatingWidgetContainer) floatingWidgetContainer.classList.add('visible');
            else if (floatingCart) floatingCart.classList.add('visible');
        } else {
            if (floatingWidgetContainer) floatingWidgetContainer.classList.remove('visible');
            else if (floatingCart) floatingCart.classList.remove('visible');
        }
    }
    
    updateCartDisplay();
    
    // Gestion du bouton Vider le panier
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm("Voulez-vous vraiment vider votre sélection de devis ?")) {
                quoteCart = [];
                localStorage.removeItem('gcs_quote_cart');
                updateCartDisplay();
            }
        });
    }
    
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
    
    // --- Lightbox Logic ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const productImages = document.querySelectorAll('.product-image img');

    if (lightboxModal && lightboxImg) {
        productImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
            // On vide la source après l'animation pour éviter de voir l'ancienne image à la prochaine ouverture
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Fermer si on clique en dehors de l'image
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Fermer avec la touche Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // --- Search Result Highlight & Scroll Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get('item');
    if (itemParam) {
        // Trouver la carte produit qui correspond au nom
        const productCardsList = document.querySelectorAll('.product-card');
        let targetCard = null;

        for (const card of productCardsList) {
            const btn = card.querySelector('.btn-add-quote');
            if (btn && btn.getAttribute('data-product') === itemParam) {
                targetCard = card;
                break;
            }
        }

        if (targetCard) {
            // Défilement fluide vers la carte avec un léger délai pour assurer le rendu
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Ajouter un effet de surbrillance pour montrer exactement l'article
                targetCard.style.boxShadow = '0 0 0 4px var(--primary-blue), 0 10px 30px rgba(10, 88, 202, 0.4)';
                targetCard.style.transform = 'scale(1.02)';
                targetCard.style.transition = 'all 0.5s ease';
                targetCard.style.zIndex = '10';
                targetCard.style.position = 'relative';
                
                // Retirer la surbrillance après 3 secondes
                setTimeout(() => {
                    targetCard.style.boxShadow = '';
                    targetCard.style.transform = '';
                    setTimeout(() => {
                        targetCard.style.zIndex = '';
                        targetCard.style.position = '';
                    }, 500);
                }, 3000);
            }, 600);
        }
    }
});
