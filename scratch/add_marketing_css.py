css_content = """

/* ==========================================================================
   MARKETING & PUBLICITÉ (Top Bar, Ticker, Pop-up)
   ========================================================================== */

/* 1. Top Bar Promotionnelle */
.promo-topbar {
    background: linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 10px 0;
    font-size: 0.9rem;
    position: relative;
    z-index: 1000;
    transition: margin-top 0.4s ease;
}

.promo-topbar.closed {
    margin-top: -50px;
    display: none;
}

.promo-topbar-content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0 30px;
}

.promo-text i {
    margin-right: 8px;
    color: #FFD700; /* Gold */
}

.promo-close {
    position: absolute;
    right: 15px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 1.1rem;
    transition: color 0.3s;
}

.promo-close:hover {
    color: white;
}

/* 2. Trust Ticker (Marques Partenaires) */
.trust-ticker-section {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 20px 0;
    overflow: hidden;
    position: relative;
}

.trust-ticker-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}

/* Fade effetc on edges */
.trust-ticker-container::before,
.trust-ticker-container::after {
    content: '';
    position: absolute;
    top: 0;
    width: 150px;
    height: 100%;
    z-index: 2;
}

.trust-ticker-container::before {
    left: 0;
    background: linear-gradient(to right, #f8fafc 0%, transparent 100%);
}

.trust-ticker-container::after {
    right: 0;
    background: linear-gradient(to left, #f8fafc 0%, transparent 100%);
}

.trust-ticker-track {
    display: inline-flex;
    animation: scroll-ticker 30s linear infinite;
}

.trust-ticker-track:hover {
    animation-play-state: paused;
}

.trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #64748b;
    padding: 0 40px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.trust-item i {
    font-size: 1.5rem;
    color: var(--primary-blue);
    opacity: 0.8;
}

@keyframes scroll-ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

/* 3. Pop-up Exit Intent (Lead Magnet) */
.lead-magnet-popup {
    max-width: 500px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 3rem 2rem;
}

.lead-magnet-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem auto;
}

.lead-magnet-icon i {
    font-size: 2.5rem;
    color: var(--primary-blue);
}

.lead-magnet-popup h3 {
    font-size: 1.8rem;
    color: var(--color-dark);
    margin-bottom: 1rem;
}

.lead-magnet-popup p {
    color: var(--text-muted);
    margin-bottom: 2rem;
    font-size: 1.05rem;
    line-height: 1.6;
}

.lead-magnet-small {
    font-size: 0.85rem !important;
    color: #94a3b8 !important;
    margin-top: 1rem;
    margin-bottom: 0 !important;
}

@media (max-width: 768px) {
    .promo-topbar-content {
        flex-direction: column;
        text-align: center;
        gap: 5px;
    }
    .promo-close {
        top: 5px;
        right: 5px;
    }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css_content)

print("Marketing CSS added.")
