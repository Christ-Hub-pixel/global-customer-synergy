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
                console.warn("Supabase n'est pas configuré. Le formulaire sera envoyé uniquement par email.");
            } else {
                try {
                    // 1. Envoi à Supabase (Base de données) si configuré
                    const { data, error } = await supabaseClient
                        .from('soumissions')
                        .insert([formData]);

                    if (error) console.error("Erreur Supabase:", error);
                } catch (e) {
                    console.error("Erreur lors de l'insertion Supabase:", e);
                }
            }

            try {
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
                
                // Remise à l'état initial après 3s
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);

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
        { title: "Masque jetable FFP1", desc: "Masque de protection respiratoire jetable FFP1. Protège efficacement contre les poussières fines non toxiques...", link: "catalogue.html?item=Masque%20jetable%20FFP1" },
        { title: "Masque jetable FFP2", desc: "Masque de protection respiratoire jetable FFP2. Assure un excellent niveau de filtration contre les particules fines, toxiques...", link: "catalogue.html?item=Masque%20jetable%20FFP2" },
        { title: "Masque jetable FFP3", desc: "Masque de protection respiratoire jetable FFP3 avec valve. Offre la plus haute protection contre les poussières très fines...", link: "catalogue.html?item=Masque%20jetable%20FFP3" },
        { title: "Demi-masque réutilisable", desc: "Demi-masque de protection respiratoire réutilisable. Conception bi-filtre pour un équilibre parfait, compatible avec de multiples cartouches...", link: "catalogue.html?item=Demi-masque%20r%C3%A9utilisable" },
        { title: "Masque complet respiratoire", desc: "Masque de protection complet avec visière panoramique. Offre une protection maximale des voies respiratoires et des yeux...", link: "catalogue.html?item=Masque%20complet%20respiratoire" },
        { title: "Masque à cartouches filtrantes", desc: "Masque respiratoire équipé de cartouches filtrantes interchangeables. Protection efficace contre une large gamme de gaz...", link: "catalogue.html?item=Masque%20%C3%A0%20cartouches%20filtrantes" },
        { title: "Appareil respiratoire isolant (ARI)", desc: "Équipement de pointe pour les interventions en milieu confiné ou pauvre en oxygène. Fournit un apport d'air indépendant...", link: "catalogue.html?item=Appareil%20respiratoire%20isolant%20(ARI)" },
        { title: "Appareil respiratoire autonome", desc: "Système de protection respiratoire autonome complet, conçu pour les longues durées d'intervention en milieu hostile...", link: "catalogue.html?item=Appareil%20respiratoire%20autonome" },
        { title: "Masque d’évacuation d’urgence", desc: "Masque ou cagoule d'évacuation d'urgence. Déploiement ultra-rapide pour garantir une fuite sécurisée en cas d'incendie...", link: "catalogue.html?item=Masque%20d%E2%80%99%C3%A9vacuation%20d%E2%80%99urgence" },
        { title: "Masque anti-gaz", desc: "Masque respiratoire hautement spécialisé pour la protection contre les gaz toxiques et les vapeurs chimiques dangereuses...", link: "catalogue.html?item=Masque%20anti-gaz" },
        { title: "Masque pour soudage avec filtration", desc: "Cagoule de soudage intégrée avec système de filtration d'air (ventilation assistée). Protège les yeux et assure une respiration...", link: "catalogue.html?item=Masque%20pour%20soudage%20avec%20filtration" },
        { title: "Cagoule à adduction d’air", desc: "Système de protection avec cagoule légère alimentée en air pur via un réseau externe. Idéale pour les fortes concentrations...", link: "catalogue.html?item=Cagoule%20%C3%A0%20adduction%20d%E2%80%99air" },
        { title: "Masque chirurgical jetable", desc: "Masque chirurgical de protection jetable 3 plis. Idéal pour un usage quotidien en milieu médical, agroalimentaire...", link: "catalogue.html?item=Masque%20chirurgical%20jetable" },
        { title: "Système de protection respiratoire à ventilation assistée (PAPR)", desc: "Système PAPR complet avec moteur et filtres. Fournit un flux d'air purifié constant pour réduire la fatigue respiratoire...", link: "catalogue.html?item=Syst%C3%A8me%20de%20protection%20respiratoire%20%C3%A0%20ventilation%20assist%C3%A9e%20(PAPR)" },
        { title: "Cartouches filtrantes respiratoires", desc: "Lot de cartouches filtrantes de rechange pour demi-masques et masques complets. Protection spécifique contre les particules...", link: "catalogue.html?item=Cartouches%20filtrantes%20respiratoires" },
        { title: "Filtres à particules", desc: "Filtres de rechange haute efficacité pour systèmes de protection respiratoire. Bloquent les poussières fines et les aérosols...", link: "catalogue.html?item=Filtres%20%C3%A0%20particules" },
        { title: "Filtres gaz et vapeurs", desc: "Filtres spécifiques pour une protection optimale contre une grande variété de gaz toxiques et de vapeurs (organiques, inorganiques...)", link: "catalogue.html?item=Filtres%20gaz%20et%20vapeurs" },
        { title: "Accessoires de protection respiratoire", desc: "Large gamme d'accessoires (lingettes nettoyantes, valves de rechange, sangles, étuis) pour entretenir et prolonger la durée de vie...", link: "catalogue.html?item=Accessoires%20de%20protection%20respiratoire" },
        { title: "Lunettes et protections des yeux", desc: "Lunettes de protection oculaire avec oculaires anti-rayures, traitement anti-...", link: "catalogue.html?item=Lunettes%20et%20protections%20des%20yeux" },
        { title: "Lunettes de sécurité transparentes", desc: "Lunettes de sécurité à verres transparents pour une vision claire en intérieur. Offrent une excellente protection...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20transparentes" },
        { title: "Lunettes de sécurité teintées", desc: "Lunettes de protection avec verres teintés anti-éblouissement, parfaites pour les travaux en extérieur ou sous une forte luminosité...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20teint%C3%A9es" },
        { title: "Lunettes de sécurité anti-buée", desc: "Lunettes équipées d'un revêtement anti-buée ultra-performant. Maintiennent une vision nette même lors d'efforts intenses...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20anti-bu%C3%A9e" },
        { title: "Lunettes de sécurité anti-rayures", desc: "Lunettes de protection avec verres traités anti-rayures pour une durabilité exceptionnelle dans les environnements abrasifs...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20anti-rayures" },
        { title: "Lunettes de sécurité avec protection latérale", desc: "Lunettes de sécurité enveloppantes avec écrans latéraux intégrés. Offrent une protection complète contre les projections...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20avec%20protection%20lat%C3%A9rale" },
        { title: "Lunettes-masque de sécurité", desc: "Lunettes-masque étanches offrant une protection hermétique contre les liquides, les éclaboussures chimiques et les particules fines...", link: "catalogue.html?item=Lunettes-masque%20de%20s%C3%A9curit%C3%A9" },
        { title: "Lunettes pour soudage", desc: "Lunettes spécialisées pour les opérations de soudage au chalumeau, avec verres filtrants protégeant contre les rayonnements...", link: "catalogue.html?item=Lunettes%20pour%20soudage" },
        { title: "Lunettes de sécurité UV", desc: "Lunettes de protection dotées de filtres anti-UV. Bloquent à 100% les rayonnements ultraviolets nocifs pour une sécurité optimale...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20UV" },
        { title: "Lunettes-masque de sécurité ventilées", desc: "Lunettes-masque avec système de ventilation indirecte. Assurent une protection optimale contre les projections tout en limitant la buée...", link: "catalogue.html?item=Lunettes-masque%20de%20s%C3%A9curit%C3%A9%20ventil%C3%A9es" },
        { title: "Lunettes balistiques de sécurité", desc: "Lunettes de protection haute résistance certifiées normes balistiques. Conçues pour résister aux impacts à très haute vitesse...", link: "catalogue.html?item=Lunettes%20balistiques%20de%20s%C3%A9curit%C3%A9" },
        { title: "Lunettes de sécurité à verres correcteurs", desc: "Monture de sécurité robuste avec possibilité d'intégration de verres correcteurs sur mesure. Allient parfaite vision et protection...", link: "catalogue.html?item=Lunettes%20de%20s%C3%A9curit%C3%A9%20%C3%A0%20verres%20correcteurs" },
        { title: "Sur-lunettes de sécurité", desc: "Conçues pour être portées confortablement par-dessus des lunettes de vue. Offrent une excellente couverture périphérique...", link: "catalogue.html?item=Sur-lunettes%20de%20s%C3%A9curit%C3%A9" },
        { title: "Écran facial de protection", desc: "Visière transparente robuste avec serre-tête ajustable. Protège l'intégralité du visage contre les projections mécaniques...", link: "catalogue.html?item=%C3%89cran%20facial%20de%20protection" },
        { title: "Protection auditive", desc: "Serre-tête de protection auditive haute performance (SNR 31dB) pour environnements...", link: "catalogue.html?item=Protection%20auditive" },
        { title: "Bouchons d'oreilles jetables", desc: "Bouchons d'oreilles en mousse de polyuréthane à expansion lente. Idéals pour une utilisation prolongée dans les environnements bruyants...", link: "catalogue.html?item=Bouchons%20d'oreilles%20jetables" },
        { title: "Bouchons d'oreilles réutilisables avec cordon", desc: "Bouchons préformés en silicone lavable avec cordon de maintien. Conception multi-collerettes pour un ajustement parfait...", link: "catalogue.html?item=Bouchons%20d'oreilles%20r%C3%A9utilisables%20avec%20cordon" },
        { title: "Casque antibruit actif (électronique)", desc: "Casque intelligent avec modulation sonore. Amplifie les voix et bruits ambiants faibles tout en bloquant instantanément les bruits nocifs...", link: "catalogue.html?item=Casque%20antibruit%20actif%20%28%C3%A9lectronique%29" },
        { title: "Casque antibruit communicant (avec radio intégrée)", desc: "Casque de protection avec système de communication radio bidirectionnelle intégré. Idéal pour coordonner des équipes...", link: "catalogue.html?item=Casque%20antibruit%20communicant%20%28avec%20radio%20int%C3%A9gr%C3%A9e%29" },
        { title: "Équipements antichute (Harnais)", desc: "Harnais de sécurité 2 points d'ancrage (dorsal et sternal) pour travaux en hauteur...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Harnais%29" },
        { title: "Équipements antichute (Longes)", desc: "Longe avec absorbeur d'énergie intégré pour l'arrêt sécurisé des chutes...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Longes%29" },
        { title: "Équipements antichute (Connecteurs)", desc: "Mousqueton et connecteur de sécurité à verrouillage automatique ou manuel...", link: "catalogue.html?item=%C3%89quipements%20antichute%20%28Connecteurs%29" },
        { title: "Équipements de soudure", desc: "Cagoule de soudage automatique à cristaux liquides protégeant les...", link: "catalogue.html?item=%C3%89quipements%20de%20soudure" },
        { title: "Chaussures basses de sécurité", desc: "Bottes et chaussures de protection basses et hautes avec embout composite...", link: "catalogue.html?item=Chaussures%20basses%20de%20s%C3%A9curit%C3%A9" },
        { title: "Baskets de sécurité légères (S1P)", desc: "Chaussures de sécurité au style sport, respirantes et ultra-légères avec embout de protection...", link: "catalogue.html?item=Baskets%20de%20s%C3%A9curit%C3%A9%20l%C3%A9g%C3%A8res%20%28S1P%29" },
        { title: "Chaussures de sécurité montantes (S3)", desc: "Chaussures tout-terrain robustes avec maintien de la cheville, semelle crantée anti-perforation et tige hydrofuge...", link: "catalogue.html?item=Chaussures%20de%20s%C3%A9curit%C3%A9%20montantes%20%28S3%29" },
        { title: "Bottes de sécurité étanches (S5)", desc: "Bottes professionnelles imperméables en PVC/Nitrile, avec embout protecteur et semelle crantée anti-perforation...", link: "catalogue.html?item=Bottes%20de%20s%C3%A9curit%C3%A9%20%C3%A9tanches%20%28S5%29" },
        { title: "Chaussures hautes", desc: "Bottes professionnelles renforcées pour les milieux exigeants...", link: "catalogue.html?item=Chaussures%20hautes" },
        { title: "Couvre-chaussures", desc: "Couvre-chaussures de sécurité jetables ou réutilisables, idéals pour les environnements propres...", link: "catalogue.html?item=Couvre-chaussures" },
        { title: "Cuissardes", desc: "Cuissardes de sécurité étanches, idéales pour les travaux en milieux très humides...", link: "catalogue.html?item=Cuissardes" },
        { title: "Bottes de sécurité", desc: "Bottes de sécurité étanches en PVC ou PU avec embout de protection...", link: "catalogue.html?item=Bottes%20de%20s%C3%A9curit%C3%A9" },
        { title: "Chaussures de sécurité sport", desc: "Chaussures de sécurité au design sportif, légères et respirantes avec embout de protection...", link: "catalogue.html?item=Chaussures%20de%20s%C3%A9curit%C3%A9%20sport" },
        { title: "Chaussures antidérapantes", desc: "Chaussures professionnelles dotées d'une semelle ultra-adhérente, idéales pour les sols glissants...", link: "catalogue.html?item=Chaussures%20antid%C3%A9rapantes" },
        { title: "Chaussures isolantes électriques", desc: "Chaussures de sécurité avec semelle isolante haute tension pour électriciens...", link: "catalogue.html?item=Chaussures%20isolantes%20%C3%A9lectriques" },
        { title: "Chaussures ESD", desc: "Chaussures de sécurité dissipatrices d'électricité statique (ESD) pour l'industrie électronique...", link: "catalogue.html?item=Chaussures%20ESD" },
        { title: "Chaussures résistantes à la chaleur", desc: "Chaussures de sécurité conçues pour résister aux températures extrêmes (HRO)...", link: "catalogue.html?item=Chaussures%20r%C3%A9sistantes%20%C3%A0%20la%20chaleur" },
        { title: "Bottes PVC de sécurité", desc: "Bottes de sécurité étanches en PVC lourd. Idéales pour les milieux très humides, inondés ou l'industrie chimique...", link: "catalogue.html?item=Bottes%20PVC%20de%20s%C3%A9curit%C3%A9" },
        { title: "Chaussures anti-perforation", desc: "Chaussures renforcées intégrant une semelle anti-perforation ultra-résistante pour protéger contre les objets pointus...", link: "catalogue.html?item=Chaussures%20anti-perforation" },
        { title: "Chaussures pour soudeurs", desc: "Chaussures montantes en cuir ignifugé, conçues spécifiquement pour la soudure avec protection renforcée...", link: "catalogue.html?item=Chaussures%20pour%20soudeurs" },
        { title: "Chaussures sans métal", desc: "Chaussures de sécurité 100% amagnétiques (sans métal) avec embout composite. Légères et idéales pour les portiques...", link: "catalogue.html?item=Chaussures%20sans%20m%C3%A9tal" },
        { title: "Sabots de sécurité", desc: "Sabots de sécurité confortables, parfaits pour le milieu médical ou l'agroalimentaire. Lavables et antidérapants...", link: "catalogue.html?item=Sabots%20de%20s%C3%A9curit%C3%A9" },
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
        { title: "Combinaisons de travail", desc: "Combinaisons double fermeture et tenues de travail complètes offrant une protection optimale...", link: "catalogue.html?item=Combinaisons%20de%20travail" },
        { title: "Gilets haute visibilité", desc: "Gilets et vêtements de signalisation à bandes réfléchissantes pour assurer une visibilité...", link: "catalogue.html?item=Gilets%20haute%20visibilit%C3%A9" },
        { title: "Vestes Haute Visibilité", desc: "Vestes et blousons chauds et imperméables, dotés de bandes rétroréfléchissantes pour une signalisation optimale...", link: "catalogue.html?item=Vestes%20Haute%20Visibilit%C3%A9" },
        { title: "Combinaisons de protection chimique", desc: "Combinaisons jetables hautement résistantes (type Tyvek) pour la protection contre les particules fines, les éclaboussures...", link: "catalogue.html?item=Combinaisons%20de%20protection%20chimique" },
        { title: "Vêtements ignifugés", desc: "Vêtements techniques retardateurs de flamme pour une protection optimale contre la chaleur, les flammes et les arcs électriques...", link: "catalogue.html?item=V%C3%AAtements%20ignifug%C3%A9s" },
        { title: "Vêtements pour le grand froid", desc: "Parkas et pantalons thermiques haute isolation. Conçus pour maintenir la chaleur corporelle lors de travaux dans des environnements...", link: "catalogue.html?item=V%C3%AAtements%20pour%20le%20grand%20froid" },
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
        { title: "Cadenas de consignation", desc: "Cadenas diélectriques, moraillons de consignation multiple, dispositifs de verrouillage...", link: "catalogue.html?item=Cadenas%20de%20consignation" },
        { title: "Harnais certifié EN 361", desc: "Harnais de sécurité certifié selon la norme EN 361 pour les travaux en hauteur...", link: "catalogue.html?item=Harnais%20EN%20361" },
        { title: "Longe avec absorbeur (EN 355)", desc: "Longe de sécurité certifiée EN 355 avec absorbeur d'énergie intégré...", link: "catalogue.html?item=Longe%20absorbeur%20EN%20355" },
        { title: "Point d'ancrage certifié", desc: "Dispositif d'ancrage fixe ou temporaire haute résistance...", link: "catalogue.html?item=Point%20d'ancrage" },
        { title: "Connecteurs EN 362", desc: "Mousquetons et connecteurs en acier ou aluminium certifiés EN 362...", link: "catalogue.html?item=Connecteurs%20EN%20362" }
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
            
            const divContainer = document.createElement('div');
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'search-result-title';
            titleDiv.textContent = item.title;
            
            const descDiv = document.createElement('div');
            descDiv.className = 'search-result-desc';
            descDiv.textContent = item.desc;
            
            divContainer.appendChild(titleDiv);
            divContainer.appendChild(descDiv);
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-right';
            icon.style.color = 'var(--accent-red)';
            
            a.appendChild(divContainer);
            a.appendChild(icon);
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
    
    // Fonction pour mettre à jour l'affichage du compteur et du bouton flottant
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
        renderCartSidebar();
    }
    
    // Elements du panneau latéral (Sidebar Cart)
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebarBody = document.getElementById('cartSidebarBody');
    const closeCartBtn = document.getElementById('closeCartBtn');
    
    function openCart() {
        if(cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
        }
    }
    
    function closeCart() {
        if(cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
        }
    }
    
    if (floatingCart) {
        floatingCart.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    function renderCartSidebar() {
        if (!cartSidebarBody) return;
        
        cartSidebarBody.innerHTML = '';
        
        if (quoteCart.length === 0) {
            cartSidebarBody.innerHTML = '<div class="empty-cart-msg">Votre liste de devis est vide.</div>';
            return;
        }
        
        quoteCart.forEach((item, index) => {
            const itemName = typeof item === 'string' ? item : item.name;
            const itemImgSrc = (typeof item === 'object' && item.image) ? item.image : '';

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'cart-item-info';
            
            if (itemImgSrc) {
                const img = document.createElement('img');
                img.src = itemImgSrc;
                img.alt = itemName;
                img.className = 'cart-item-img';
                infoDiv.appendChild(img);
            }
            
            const titleH4 = document.createElement('h4');
            titleH4.textContent = itemName;
            infoDiv.appendChild(titleH4);
            
            const btn = document.createElement('button');
            btn.className = 'remove-item-btn';
            btn.setAttribute('data-index', index);
            btn.setAttribute('aria-label', 'Supprimer');
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-trash';
            btn.appendChild(icon);
            
            itemEl.appendChild(infoDiv);
            itemEl.appendChild(btn);
            cartSidebarBody.appendChild(itemEl);
        });
        
        // Attacher les events pour supprimer un item
        const removeBtns = cartSidebarBody.querySelectorAll('.remove-item-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                quoteCart.splice(idx, 1);
                localStorage.setItem('gcs_quote_cart', JSON.stringify(quoteCart));
                updateCartDisplay();
            });
        });
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
            const productCard = this.closest('.product-card');
            const imgSrc = productCard ? productCard.querySelector('.product-image img').getAttribute('src') : '';
            quoteCart.push({ name: productName, image: imgSrc });
            localStorage.setItem('gcs_quote_cart', JSON.stringify(quoteCart));
            
            updateCartDisplay();
        });
    });
    
    // Filtres du catalogue
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const sidebarBtns = document.querySelectorAll('.sidebar-filter-btn');
    
    // Filtres principaux (Haut de page)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Réinitialiser la barre latérale
            if(sidebarBtns) {
                sidebarBtns.forEach(b => b.classList.remove('active'));
            }
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Revenir en haut des résultats pour éviter d'être bloqué en bas de page
            const catalogueHeader = document.querySelector('.catalogue-filters');
            if (catalogueHeader) {
                const offset = 120; // Ajustement pour le menu flottant
                const elementPosition = catalogueHeader.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // Filtres de la barre latérale (Sous-catégories)
    if(sidebarBtns) {
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sidebarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mettre à jour le bouton parent en haut
                const parentCat = btn.getAttribute('data-category');
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    if(b.getAttribute('data-filter') === parentCat) {
                        b.classList.add('active');
                    }
                });
                
                const subFilterValue = btn.getAttribute('data-subcategory');
                
                productCards.forEach(card => {
                    if (card.getAttribute('data-subcategory') === subFilterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Revenir en haut des résultats pour éviter d'être bloqué en bas de page
                const catalogueHeader = document.querySelector('.catalogue-filters');
                if (catalogueHeader) {
                    const offset = 120; // Ajustement pour le menu flottant
                    const elementPosition = catalogueHeader.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }

            });
        });
    }
    
    // Auto-remplissage du formulaire de contact si on vient du panier
    const messageField = document.getElementById('message');
    if (messageField && quoteCart.length > 0) {
        // Seulement si le champ est vide
        if (messageField.value.trim() === '') {
            let messageText = "Bonjour, je souhaite obtenir un devis pour les équipements suivants :\n\n";
            quoteCart.forEach((item, index) => {
                const itemName = typeof item === 'string' ? item : item.name;
                messageText += `- ${itemName}\n`;
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
    const productImagesContainers = document.querySelectorAll('.product-image');

    if (lightboxModal && lightboxImg) {
        productImagesContainers.forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
                }
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

// --- Accordion Logic for Expertise Guide ---
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all accordions
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });
            
            // Open the clicked one if it was closed
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});


// Gestionnaire global pour remplacer les onerror inline (Sécurité)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fallback-img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'assets/hero-image.webp';
        });
    });

    // Gestionnaire global pour remplacer les onclick inline du catalogue (Sécurité)
    document.querySelectorAll('.trigger-subcategory').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const targetBtn = document.querySelector(`[data-subcategory='${target}']`);
            if (targetBtn) {
                targetBtn.click();
                
                // Défilement manuel fluide vers la section catalogue
                const catalogueSection = document.getElementById('catalogue-section');
                if (catalogueSection) {
                    catalogueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});


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
