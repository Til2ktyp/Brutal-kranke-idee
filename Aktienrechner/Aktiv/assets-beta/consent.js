(function() {
    const STORAGE_KEY = 'bbConsent:ads';
    const ADSENSE_CLIENT = 'ca-pub-5795114678692881';
    const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT;
    const CURRENT_SCRIPT = document.currentScript;
    const PRIVACY_URL = CURRENT_SCRIPT && CURRENT_SCRIPT.src
        ? new URL('datenschutz.html', CURRENT_SCRIPT.src).href
        : 'datenschutz.html';

    if (window.__bbConsentManager) return;
    window.__bbConsentManager = true;

    function getConsent() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (error) {
            // If storage is unavailable, keep the choice for this page view only.
            window.__bbConsentFallback = value;
        }
    }

    function loadAdsense() {
        if (document.querySelector('script[data-bb-adsense="true"]')) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = ADSENSE_SRC;
        script.crossOrigin = 'anonymous';
        script.dataset.bbAdsense = 'true';
        document.head.appendChild(script);
    }

    function injectStyles() {
        if (document.getElementById('bb-consent-style')) return;

        const style = document.createElement('style');
        style.id = 'bb-consent-style';
        style.textContent = `
            .bb-consent-banner,
            .bb-consent-settings {
                font-family: Arial, Helvetica, sans-serif;
            }

            .bb-consent-banner {
                position: fixed;
                left: 16px;
                right: 16px;
                bottom: 16px;
                z-index: 2147483000;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 16px;
                width: min(960px, calc(100% - 32px));
                margin: 0 auto;
                padding: 18px;
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 18px;
                background:
                    radial-gradient(circle at 12% 18%, rgba(45, 212, 191, 0.3), transparent 28%),
                    radial-gradient(circle at 88% 14%, rgba(229, 169, 59, 0.22), transparent 24%),
                    linear-gradient(145deg, rgba(11, 15, 25, 0.97), rgba(7, 42, 58, 0.94));
                color: #ffffff;
                box-shadow:
                    0 26px 80px rgba(0, 0, 0, 0.42),
                    0 0 42px rgba(45, 212, 191, 0.12),
                    inset 0 1px 0 rgba(255, 255, 255, 0.14);
                backdrop-filter: blur(22px);
                isolation: isolate;
                overflow: hidden;
                transform-origin: 50% 100%;
                animation: bbConsentIn 0.58s cubic-bezier(0.18, 0.9, 0.24, 1) both;
            }

            .bb-consent-banner.is-closing {
                pointer-events: none;
                animation: bbConsentOut 0.28s ease forwards;
            }

            .bb-consent-banner::before {
                content: "";
                position: absolute;
                inset: 0;
                z-index: -1;
                background:
                    linear-gradient(115deg, transparent 0 34%, rgba(255, 255, 255, 0.18) 45%, transparent 58% 100%);
                transform: translateX(-120%) skewX(-10deg);
                animation: bbConsentSweep 4.4s ease-in-out 0.45s infinite;
            }

            .bb-consent-banner::after {
                content: "";
                position: absolute;
                inset: 1px;
                z-index: -2;
                border-radius: 17px;
                background:
                    linear-gradient(90deg, rgba(45, 212, 191, 0.34), rgba(229, 169, 59, 0.34), rgba(244, 63, 94, 0.2), rgba(45, 212, 191, 0.34));
                background-size: 240% 100%;
                opacity: 0.38;
                filter: blur(14px);
                animation: bbConsentGlow 5.5s linear infinite;
            }

            .bb-consent-spark {
                position: absolute;
                z-index: -1;
                width: 7px;
                height: 7px;
                border-radius: 999px;
                background: var(--bb-spark, #e5a93b);
                box-shadow: 0 0 14px var(--bb-spark, #e5a93b), 0 0 24px rgba(255, 255, 255, 0.3);
                opacity: 0.86;
                pointer-events: none;
                animation: bbConsentFloat var(--bb-time, 3.8s) ease-in-out infinite alternate;
            }

            .bb-consent-copy {
                min-width: 0;
                position: relative;
            }

            .bb-consent-title {
                margin: 0 0 6px;
                color: #fde68a;
                font-size: 1rem;
                font-weight: 950;
                line-height: 1.2;
                text-shadow: 0 0 20px rgba(229, 169, 59, 0.26);
            }

            .bb-consent-text {
                margin: 0;
                color: rgba(255, 255, 255, 0.76);
                font-size: 0.9rem;
                line-height: 1.45;
            }

            .bb-consent-text a {
                color: #2dd4bf;
                font-weight: 850;
            }

            .bb-consent-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
                flex-wrap: wrap;
            }

            .bb-consent-btn,
            .bb-consent-settings {
                min-height: 40px;
                border: 0;
                border-radius: 12px;
                padding: 9px 13px;
                cursor: pointer;
                font: inherit;
                font-size: 0.82rem;
                font-weight: 950;
                text-decoration: none;
                transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
            }

            .bb-consent-btn:hover,
            .bb-consent-btn:focus-visible,
            .bb-consent-settings:hover,
            .bb-consent-settings:focus-visible {
                outline: none;
                transform: translateY(-2px) scale(1.03);
            }

            .bb-consent-btn.accept {
                background: linear-gradient(135deg, #e5a93b, #2dd4bf);
                color: #07111f;
                box-shadow: 0 12px 30px rgba(45, 212, 191, 0.24), 0 0 24px rgba(229, 169, 59, 0.16);
                animation: bbConsentButtonPulse 2.8s ease-in-out infinite;
            }

            .bb-consent-btn.reject {
                border: 1px solid rgba(255, 255, 255, 0.18);
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }

            .bb-consent-settings {
                position: fixed;
                right: 14px;
                bottom: 14px;
                z-index: 2147482999;
                border: 1px solid rgba(229, 169, 59, 0.24);
                background: rgba(11, 15, 25, 0.86);
                color: #fde68a;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
                backdrop-filter: blur(18px);
                animation: bbConsentSettingsIn 0.34s cubic-bezier(0.18, 0.9, 0.24, 1) both;
            }

            @keyframes bbConsentIn {
                from {
                    opacity: 0;
                    transform: translateY(28px) scale(0.96);
                    filter: blur(8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
            }

            @keyframes bbConsentOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(24px) scale(0.97);
                    filter: blur(8px);
                }
            }

            @keyframes bbConsentSweep {
                0%,
                38% {
                    transform: translateX(-120%) skewX(-10deg);
                }
                62%,
                100% {
                    transform: translateX(120%) skewX(-10deg);
                }
            }

            @keyframes bbConsentGlow {
                to {
                    background-position: 240% 0;
                }
            }

            @keyframes bbConsentFloat {
                from {
                    transform: translate(0, 0) scale(0.8);
                    opacity: 0.44;
                }
                to {
                    transform: translate(var(--bb-x, 18px), var(--bb-y, -16px)) scale(1.2);
                    opacity: 0.95;
                }
            }

            @keyframes bbConsentButtonPulse {
                0%,
                100% {
                    filter: saturate(1);
                }
                50% {
                    filter: saturate(1.28) brightness(1.08);
                    box-shadow: 0 16px 38px rgba(45, 212, 191, 0.32), 0 0 30px rgba(229, 169, 59, 0.24);
                }
            }

            @keyframes bbConsentSettingsIn {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 720px) {
                .bb-consent-banner {
                    grid-template-columns: 1fr;
                    bottom: 12px;
                    padding: 15px;
                }

                .bb-consent-actions {
                    justify-content: stretch;
                }

                .bb-consent-btn {
                    flex: 1 1 140px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .bb-consent-banner,
                .bb-consent-banner::before,
                .bb-consent-banner::after,
                .bb-consent-spark,
                .bb-consent-btn.accept,
                .bb-consent-settings {
                    animation: none !important;
                }

                .bb-consent-btn:hover,
                .bb-consent-btn:focus-visible,
                .bb-consent-settings:hover,
                .bb-consent-settings:focus-visible {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function removeBanner() {
        const banner = document.getElementById('bbConsentBanner');
        if (banner) banner.remove();
    }

    function closeBanner(callback) {
        const banner = document.getElementById('bbConsentBanner');
        if (!banner) {
            if (callback) callback();
            return;
        }

        banner.classList.add('is-closing');
        window.setTimeout(function() {
            if (banner.isConnected) banner.remove();
            if (callback) callback();
        }, 300);
    }

    function showSettingsButton() {
        if (document.getElementById('bbConsentSettings')) return;

        const button = document.createElement('button');
        button.id = 'bbConsentSettings';
        button.className = 'bb-consent-settings';
        button.type = 'button';
        button.textContent = 'Cookie-Einstellungen';
        button.addEventListener('click', showBanner);
        document.body.appendChild(button);
    }

    function showBanner() {
        injectStyles();
        removeBanner();

        const banner = document.createElement('section');
        banner.id = 'bbConsentBanner';
        banner.className = 'bb-consent-banner';
        banner.setAttribute('aria-label', 'Cookie-Einstellungen');
        banner.innerHTML = `
            <span class="bb-consent-spark" style="left: 24px; top: 18px; --bb-spark: #2dd4bf; --bb-x: 18px; --bb-y: -10px; --bb-time: 3.2s;"></span>
            <span class="bb-consent-spark" style="left: 52%; top: 10px; --bb-spark: #e5a93b; --bb-x: -14px; --bb-y: 16px; --bb-time: 4.1s;"></span>
            <span class="bb-consent-spark" style="right: 34px; bottom: 16px; --bb-spark: #f43f5e; --bb-x: -20px; --bb-y: -14px; --bb-time: 3.7s;"></span>
            <div class="bb-consent-copy">
                <p class="bb-consent-title">Cookies und Anzeigen</p>
                <p class="bb-consent-text">
                    Wir laden Google AdSense erst nach deiner Einwilligung. Dabei können Cookies,
                    ähnliche Technologien und Nutzungsdaten für Anzeigen und Messung verwendet werden.
                    Mehr dazu in der <a href="${PRIVACY_URL}">Datenschutzerklärung</a>.
                </p>
            </div>
            <div class="bb-consent-actions">
                <button class="bb-consent-btn reject" type="button" data-bb-consent="denied">Ablehnen</button>
                <button class="bb-consent-btn accept" type="button" data-bb-consent="granted">Akzeptieren</button>
            </div>
        `;

        banner.addEventListener('click', function(event) {
            const button = event.target.closest('[data-bb-consent]');
            if (!button) return;

            const value = button.getAttribute('data-bb-consent');
            setConsent(value);
            closeBanner(function() {
                showSettingsButton();

                if (value === 'granted') {
                    loadAdsense();
                } else if (document.querySelector('script[data-bb-adsense="true"]')) {
                    window.location.reload();
                }
            });
        });

        document.body.appendChild(banner);
    }

    function boot() {
        injectStyles();
        const consent = getConsent() || window.__bbConsentFallback;

        if (consent === 'granted') {
            loadAdsense();
            showSettingsButton();
            return;
        }

        if (consent === 'denied') {
            showSettingsButton();
            return;
        }

        showBanner();
    }

    if (getConsent() === 'granted') {
        loadAdsense();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();