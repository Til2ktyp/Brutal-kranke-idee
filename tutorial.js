/* =========================================================
   BlopperBold Labs - Interactive Tutorial Framework
========================================================= */

(function () {
    // 1. Definitionen der Tutorials für alle Seiten
    const tutorialConfigs = {
        index: [
            {
                title: "Willkommen bei BlopperBold Labs! 🧪",
                text: "Deine Kommandozentrale für Web-Apps, Simulatoren und Rechner. Lass uns eine kurze Tour durch das Labor machen!"
            },
            {
                selector: "a[href='Games/100prozent.html']",
                title: "100% Risiko (Beliebt)",
                text: "Ein extrem süchtig machendes Spiel. Hier klickst du den Fortschrittsbalken nach oben, aber die Gefahr eines Resets steigt mit jedem Schritt!"
            },
            {
                selector: "a[href='Games/gambl.html']",
                title: "Casino Simulator 🎰",
                text: "Erlebe eine authentische Slot-Maschine mit progressivem Jackpot, Kontoverwaltung und dem berüchtigten 'Double or Nothing'-Münzwurf – völlig risikofrei."
            },
            {
                selector: "#portfolioLink",
                title: "Investment Portfolio Rechner 📈",
                text: "Simuliere historische Aktieninvestments mit echten Marktdaten. Halte die Karte gedrückt (oder klicke), um zwischen Canary- und Alt-Versionen zu wechseln!"
            },
            {
                selector: "#moreGamesButton",
                title: "Die Dopamin-Schublade ✨",
                text: "Klicke auf diesen Button, um das Fach für weitere Spiele zu öffnen! Dort findest du Kurve, Bias Bingo, Impuls, Takt und mehr."
            },
            {
                selector: "#bbHyperToggle",
                title: "Hyperaktivitäts-Modus ⚙️",
                text: "Lust auf Dopamin-Spikes? Öffne dieses Zahnrad, um Klick-Explosionen, Ambient-Glitzerregen und pulsierende Effekte einzuschalten!"
            }
        ],
        "100prozent": [
            {
                title: "100 Prozent Risiko 💯",
                text: "Das Ziel ist simpel: Klicke den Balken bis auf 100/100 Klicks. Aber Vorsicht – die Reset-Chance steigt gnadenlos mit jedem Fortschritt!"
            },
            {
                selector: "#progressBarContainer",
                title: "Der Fortschrittsbalken",
                text: "Klicke direkt auf diesen großen Balken, um Fortschritt zu machen. Bei jedem Klick besteht die Gefahr, dass alles auf Null gesetzt wird!"
            },
            {
                selector: ".chance-controls",
                title: "Reset-Steigerung wählen",
                text: "Hier stellst du ein, um wie viel Prozent die Reset-Gefahr pro Klick wächst. Tipp für Anfänger: Starte mit 0,2% oder 0,25%, um dich an die 100 heranzutasten!"
            },
            {
                selector: "#resetButton",
                title: "Rekorde & Fortschritt zurücksetzen",
                text: "Möchtest du von vorne anfangen oder deine gespeicherten Rekorde löschen? Halte diesen Button einfach für 5 Sekunden gedrückt."
            },
            {
                selector: ".probability-grid",
                title: "Wahrscheinlichkeits-Kalkulator",
                text: "Hier siehst du die mathematische Wahrscheinlichkeit, deinen aktuellen Stand bzw. das Ziel ohne vorherigen Reset zu erreichen. Reines Glückspiel!"
            }
        ],
        gambl: [
            {
                title: "Casino Simulator 🎰",
                text: "Willkommen im virtuellen Casino! Teste dein Glück an der Slot-Maschine und im Risiko-Spiel. Schaffst du es, den progressivem Jackpot zu knacken?"
            },
            {
                selector: ".chip-row",
                title: "1. Einsatz festlegen",
                text: "Wähle einen der Chips (1€ bis 100€) aus, um deinen Rundeneinsatz einzustellen. Halte dein Risiko im Blick!"
            },
            {
                selector: "#spinBtn",
                title: "2. Walzen drehen",
                text: "Klicke auf den SPIN-Button, um die Slot-Maschine zu starten. Bei 3 gleichen Symbolen gewinnst du ein Vielfaches deines Einsatzes."
            },
            {
                selector: ".money-grid",
                title: "3. Kontostand & Bankverwaltung",
                text: "Hier siehst du dein Bargeld und das Geld auf der Bank. Klicke auf 'Zur Bank', um Gewinne sicher zu verwahren – dort sind sie vor unüberlegten Runden geschützt!"
            },
            {
                selector: ".auto-grid",
                title: "Auto-Spin aktivieren",
                text: "Lass das Casino für dich arbeiten: Wähle 10x, 50x oder 100x, um die Runden vollautomatisch im schnellen Modus laufen zu lassen."
            },
            {
                selector: ".aufklaerung-btn",
                title: "Wichtig: Aufklärung 💡",
                text: "Dieses Spiel ist eine Simulation. Klicke auf diesen Button, um die mathematische Realität und die psychologischen Tricks hinter dem Glücksspiel zu verstehen."
            }
        ],
        "3expo": [
            {
                title: "Exponentieller Klick-Zähler 🚀",
                text: "Erlebe die Macht des exponentiellen Wachstums und des Zinseszinses live. Jeder Klick steigert dein Kapital."
            },
            {
                selector: "#increasePercentage",
                title: "Zuwachsrate einstellen",
                text: "Gib hier an, um wie viel Prozent der Wert pro Klick steigen soll (Standard ist 10%)."
            },
            {
                selector: "#clickButton",
                title: "Der Klick-Multiplikator",
                text: "Jeder Klick multipliziert deinen Kontostand mit dem Zuwachsfaktor. Schau zu, wie die Kurve im Chart nach oben ausbricht!"
            },
            {
                selector: "#resetButton",
                title: "Zähler zurücksetzen",
                text: "Klicke hier, um den Zähler wieder auf das Startkapital von 1,00 € zurückzusetzen."
            }
        ],
        biasbingo: [
            {
                title: "Bias Bingo 🧠",
                text: "Trainiere dein rationales Denken! Erkenne psychologische Denkfehler und kognitive Verzerrungen in 10 alltäglichen Szenarien."
            },
            {
                selector: ".scenario",
                title: "Szenario analysieren",
                text: "Lies das aktuelle Angebot oder die Verführung aufmerksam durch. Welcher Denkfehler versteckt sich hier?"
            },
            {
                selector: ".choice-row",
                title: "Entscheidung treffen",
                text: "Klicke auf 'Rein da' für die impulsive Reaktion (kostet dich Hype-Schaden) oder auf 'Kurz denken' für die rationale Wahl (rettet dir Geld)."
            },
            {
                selector: "#bingo",
                title: "Bingo-Spielfeld füllen",
                text: "Jeder richtig erkannte Denkfehler markiert eine Kachel auf deinem Spielfeld. Schafft dein Gehirn heute ein volles Bingo?"
            }
        ],
        entscheidomat: [
            {
                title: "Der Entscheidomat ⚖️",
                text: "Dieses Tool hilft dir, Alltagsentscheidungen rational abzuwägen. Kosten, Zeitaufwand, Energie und Zukunftswert werden direkt miteinander verrechnet."
            },
            {
                selector: "section.box[aria-label='Entscheidung eingeben']",
                title: "Variablen eintragen",
                text: "Trage deine Entscheidung, die Kosten pro Ausführung, die monatliche Häufigkeit und den Einfluss auf deine Energie und deine Zukunft ein."
            },
            {
                selector: ".preset-row",
                title: "Vorlagen nutzen",
                text: "Lade ein Preset wie Essen (Lieferdienst), Abo oder Lernen, um sofort ein Gefühl für die Gewichtung zu bekommen."
            },
            {
                selector: "#calculateBtn",
                title: "Berechnen & Abspeichern",
                text: "Klicke auf 'Checken', um das Ergebnis zu sehen. Mit 'Merken' speicherst du es im Verlaufsprotokoll ab."
            },
            {
                selector: ".decision-card",
                title: "Das mathematische Urteil",
                text: "Schau dir den errechneten Score (0-100) an. Ist die Entscheidung ein Zukunfts-Upgrade ('Ich mach's') oder ein leises Budget-Leck ('Ich lass es')?"
            }
        ],
        impuls: [
            {
                title: "Impuls-Klicker ⚡",
                text: "Ein extrem schnelles Reaktionsspiel. Teste deine Hand-Augen-Koordination in einem Zeitfenster von 45 Sekunden!"
            },
            {
                selector: "#start",
                title: "Spiel starten",
                text: "Klicke auf 'Start', um die Runde zu beginnen. Die Impulse spawnen sofort!"
            },
            {
                selector: "#board",
                title: "Targets treffen & Störer meiden",
                text: "Klicke so schnell wie möglich auf die blau-gelben '+' Chips. Meide unbedingt die roten '!' Chips, da sie dir 35 Punkte abziehen und deine Combo löschen!"
            },
            {
                selector: ".stats",
                title: "Score & Combo-Multiplikator",
                text: "Halte die Serie aufrecht! Je höher deine Combo, desto mehr Punkte gibt es pro getroffenem Target."
            }
        ],
        takt: [
            {
                title: "Takt-Rhythmusspiel 🎚️",
                text: "Triff die goldene Zone! Halte das fliegende Quadrat genau in der Mitte der Schiene an."
            },
            {
                selector: "#start",
                title: "Runde starten",
                text: "Klicke auf 'Start', um den Rhythmuslauf zu beginnen. Quadrate fliegen nacheinander von links ein."
            },
            {
                selector: "#tap",
                title: "Im Takt stoppen",
                text: "Klicke genau dann auf diesen Riesen-Button (oder drücke Leertaste/Enter), wenn sich das Quadrat in der markierten Zone in der Mitte befindet!"
            },
            {
                selector: "#difficultyButton",
                title: "Schwierigkeit anpassen",
                text: "Passe die Herausforderung an: Chill (Einfach), Normal, Hart oder Aua (Extrem) verändern Geschwindigkeit und Zonenbreite."
            }
        ],
        sortfall: [
            {
                title: "Sortfall 🗂️",
                text: "Sortiere das Chaos! Ordne Begriffe blitzschnell zu, um deine Produktivität und Konzentration zu schärfen."
            },
            {
                selector: "#card",
                title: "Begriffskarte analysieren",
                text: "Lies den Begriff auf der Karte (z.B. 'Matheaufgabe' oder 'Drama-Chat') und treffe sofort eine Zuordnung."
            },
            {
                selector: ".bins",
                title: "Kategorie wählen",
                text: "Klicke 'Jetzt', 'Planen' oder 'Weg'. Profi-Tipp: Nutze die Tasten 1, 2 und 3 auf deiner Tastatur für maximale Geschwindigkeit!"
            },
            {
                selector: "#start",
                title: "60-Sekunden-Lauf starten",
                text: "Klicke auf Start, um das Spiel zu beginnen. Halte deine Sortierserie hoch, um Bonuspunkte zu stapeln!"
            }
        ],
        kurve: [
            {
                title: "Kurve 📉",
                text: "Kompakter Risiko-Trader! Kaufe und verkaufe einen volatilen Vermögenswert über 80 Markt-Ticks hinweg und maximiere dein Kapital."
            },
            {
                selector: "#chart",
                title: "Die Live-Preiskurve",
                text: "Verfolge den Preistrend auf dem Graphen. Achtung vor plötzlichen Kurs-Spikes und schmerzhaften Dips!"
            },
            {
                selector: ".actions",
                title: "Handelsaktionen",
                text: "Klicke auf 'Kaufen', um all dein Cash zu investieren. Mit 'Verkaufen' machst du deine Position zu Geld. Verwende 'Weiter', um die Füße stillzuhalten."
            },
            {
                selector: ".stats",
                title: "Dein Kapital (Cash)",
                text: "Ziel ist es, die 80 Ticks mit mehr als deinen anfänglichen 1000€ abzuschließen. Sei kein gieriger HODLer!"
            }
        ],
        "ye-soundboard": [
            {
                title: "Runaway Soundboard 🎹",
                text: "Werde zum Produzenten! Mische den weltberühmten Intro-Beat von Kanye Wests Meisterwerk 'Runaway' live ab."
            },
            {
                selector: "#board",
                title: "Klaviertasten & Gesangs-Samples",
                text: "Die Tasten A-K spielen die Klaviertöne. Y startet den Full Beat, C triggert 'Lookatcha'. M stoppt sofort alle Tonspuren."
            },
            {
                selector: ".settings",
                title: "Performance-Schalter",
                text: "Aktiviere 'Spam', um Samples ohne Unterbrechung abzufeuern. 'ADHS' fügt spektakuläre visuelle Klick-Explosionen hinzu."
            },
            {
                selector: "#tutorialButton",
                title: "Runaway Melodie-Noten",
                text: "Klicke hier, um das exakte Tastenmuster für die originale Melodie des Songs einzublenden!"
            }
        ],
        since: [
            {
                title: "Investment Portfolio Rechner 📈",
                text: "Analysiere historische Aktien-Performance und Dividenden-Sparpläne in einem interaktiven Chart."
            },
            {
                selector: ".market-strip",
                title: "Aktien-Auswahl",
                text: "Klicke auf einen der Ticker (z.B. NVIDIA, APPLE) oder suche im Textfeld nach einer Aktie, um die historischen Kurse zu laden."
            },
            {
                selector: "#monthlyAmount",
                title: "Sparrate & Sparplan",
                text: "Stelle deine monatliche Investition ein. Nutze die bequemen Schnellwahl-Buttons direkt darunter."
            },
            {
                selector: ".dividend-mode-row",
                title: "Dividenden-Strategie",
                text: "Wähle, ob Dividenden sofort wieder in Anteile reinvestiert (Zinseszins!) oder ausgezahlt (Cashflow!) werden sollen."
            },
            {
                selector: ".reality-check",
                title: "Reality Check & Marktphasen 💡",
                text: "Schalte zwischen LARP (schön geredet), DERP und BRUTAL (die bittere Realität) um, um ehrliches Feedback zu deiner Anlagestrategie zu erhalten!"
            }
        ]
    };

    // 2. Seiten-Erkennung anhand des document.title
    function getPageKey() {
        const title = document.title.toLowerCase();
        if (title.includes("startseite") || title.includes("labs") || title.includes("blopperbold")) return "index";
        if (title.includes("100 prozent") || title.includes("risiko")) return "100prozent";
        if (title.includes("casino")) return "gambl";
        if (title.includes("exponentiell") || title.includes("3. expo") || title.includes("3expo")) return "3expo";
        if (title.includes("bias bingo") || title.includes("biasbingo")) return "biasbingo";
        if (title.includes("entscheidomat")) return "entscheidomat";
        if (title.includes("impuls")) return "impuls";
        if (title.includes("takt")) return "takt";
        if (title.includes("sortfall")) return "sortfall";
        if (title.includes("kurve")) return "kurve";
        if (title.includes("runaway") || title.includes("soundboard")) return "ye-soundboard";
        if (title.includes("investment") || title.includes("portfolio") || title.includes("since")) return "since";
        return null;
    }

    const pageKey = getPageKey();
    if (!pageKey || !tutorialConfigs[pageKey]) return; // Keine Tutorial-Konfiguration für diese Seite

    const steps = tutorialConfigs[pageKey];
    let currentStep = 0;

    // 3. UI-Elemente
    let overlay = null;
    let card = null;
    let helpButton = null;
    let currentHighlight = null;

    // 4. Tutorial-Steuerung
    function init() {
        // Overlay erstellen
        overlay = document.createElement("div");
        overlay.className = "tutorial-overlay";
        document.body.appendChild(overlay);

        // Karte erstellen
        card = document.createElement("div");
        card.className = "tutorial-card";
        card.setAttribute("role", "dialog");
        card.setAttribute("aria-modal", "true");
        card.innerHTML = `
            <button class="tutorial-card-close" id="tutorialCloseBtn" aria-label="Tutorial schließen">&times;</button>
            <div class="tutorial-card-header">
                <h3 class="tutorial-card-title" id="tutorialTitle"></h3>
                <span class="tutorial-card-progress" id="tutorialProgress"></span>
            </div>
            <p class="tutorial-card-text" id="tutorialText"></p>
            <div class="tutorial-card-buttons">
                <button class="tutorial-btn-skip" id="tutorialSkipBtn">Überspringen</button>
                <div class="tutorial-btn-right">
                    <button class="tutorial-btn-back" id="tutorialBackBtn">Zurück</button>
                    <button class="tutorial-btn-next" id="tutorialNextBtn">Weiter</button>
                </div>
            </div>
        `;
        document.body.appendChild(card);

        // Hilfe-FAB erstellen
        helpButton = document.createElement("button");
        helpButton.className = "tutorial-help-trigger";
        helpButton.textContent = "?";
        helpButton.setAttribute("title", "Tutorial anzeigen");
        helpButton.setAttribute("aria-label", "Tutorial anzeigen");
        document.body.appendChild(helpButton);

        // Event-Listener binden
        document.getElementById("tutorialCloseBtn").addEventListener("click", skipTutorial);
        document.getElementById("tutorialSkipBtn").addEventListener("click", skipTutorial);
        document.getElementById("tutorialBackBtn").addEventListener("click", prevStep);
        document.getElementById("tutorialNextBtn").addEventListener("click", nextStep);
        helpButton.addEventListener("click", () => startTutorial(true));

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, { passive: true });

        // Auto-Start-Check
        const shown = localStorage.getItem("tutorial_shown_" + pageKey);
        if (!shown) {
            // Eine winzige Verzögerung für schönere Seitenlade-Animationen
            setTimeout(() => {
                startTutorial(false);
            }, 600);
        }
    }

    function startTutorial(manual = false) {
        currentStep = 0;
        overlay.classList.add("show");
        card.classList.add("show");
        showStep();
        if (manual) {
            // Verhindert störendes Scrollen beim Klicken auf Hilfe, scrollt aber zum ersten Element
            updatePosition();
        }
    }

    function showStep() {
        const step = steps[currentStep];

        // Alten Highlight entfernen
        if (currentHighlight) {
            currentHighlight.classList.remove("tutorial-highlighted");
            currentHighlight = null;
        }

        // Titel und Text setzen
        document.getElementById("tutorialTitle").textContent = step.title;
        document.getElementById("tutorialText").textContent = step.text;
        document.getElementById("tutorialProgress").textContent = `${currentStep + 1} / ${steps.length}`;

        // Buttons anpassen
        const backBtn = document.getElementById("tutorialBackBtn");
        const nextBtn = document.getElementById("tutorialNextBtn");
        
        backBtn.style.display = currentStep === 0 ? "none" : "block";
        nextBtn.textContent = currentStep === steps.length - 1 ? "Fertig" : "Weiter";

        // Ziel-Element ermitteln und highlighten
        let targetEl = null;
        if (step.selector) {
            targetEl = document.querySelector(step.selector);
            // Spezial-Fall: Home-Button in ye-soundboard oder Since.html falls verdeckt
            if (targetEl) {
                currentHighlight = targetEl;
                currentHighlight.classList.add("tutorial-highlighted");
                // Element in den sichtbaren Bereich scrollen
                currentHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        // Repositionieren
        setTimeout(updatePosition, 100);
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep();
        } else {
            finishTutorial();
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep();
        }
    }

    function skipTutorial() {
        localStorage.setItem("tutorial_shown_" + pageKey, "true");
        closeTutorial();
    }

    function finishTutorial() {
        localStorage.setItem("tutorial_shown_" + pageKey, "true");
        
        if (currentHighlight) {
            currentHighlight.classList.remove("tutorial-highlighted");
            currentHighlight = null;
        }

        // Card für Erfolg-Zustand vorbereiten
        card.classList.add("tutorial-success-active");
        
        // Zentrieren
        card.style.left = "50%";
        card.style.top = "50%";
        card.style.bottom = "auto";
        card.style.transform = "translate(-50%, -50%) scale(1.05)";

        card.innerHTML = `
            <div class="tutorial-success-content">
                <div class="tutorial-success-icon">🎉</div>
                <h3 class="tutorial-success-title">Super, du hast es verstanden!</h3>
                <p class="tutorial-success-text">Viel Spaß beim Ausproberen der App! 🧪</p>
                <button class="tutorial-success-btn" id="tutorialSuccessBtn">Los geht's! 🚀</button>
            </div>
        `;

        document.getElementById("tutorialSuccessBtn").addEventListener("click", () => {
            clearTimeout(Number(card.dataset.autoCloseTimeout));
            closeTutorial();
            restoreCardHTML();
        });

        // Confetti zünden
        setTimeout(spawnConfetti, 150);

        // Auto-Close nach 5 Sekunden
        const autoCloseTimeout = setTimeout(() => {
            const btn = document.getElementById("tutorialSuccessBtn");
            if (btn) btn.click();
        }, 5000);
        card.dataset.autoCloseTimeout = autoCloseTimeout.toString();
    }

    function restoreCardHTML() {
        card.classList.remove("tutorial-success-active");
        card.style.transform = "";
        card.innerHTML = `
            <button class="tutorial-card-close" id="tutorialCloseBtn" aria-label="Tutorial schließen">&times;</button>
            <div class="tutorial-card-header">
                <h3 class="tutorial-card-title" id="tutorialTitle"></h3>
                <span class="tutorial-card-progress" id="tutorialProgress"></span>
            </div>
            <p class="tutorial-card-text" id="tutorialText"></p>
            <div class="tutorial-card-buttons">
                <button class="tutorial-btn-skip" id="tutorialSkipBtn">Überspringen</button>
                <div class="tutorial-btn-right">
                    <button class="tutorial-btn-back" id="tutorialBackBtn">Zurück</button>
                    <button class="tutorial-btn-next" id="tutorialNextBtn">Weiter</button>
                </div>
            </div>
        `;
        document.getElementById("tutorialCloseBtn").addEventListener("click", skipTutorial);
        document.getElementById("tutorialSkipBtn").addEventListener("click", skipTutorial);
        document.getElementById("tutorialBackBtn").addEventListener("click", prevStep);
        document.getElementById("tutorialNextBtn").addEventListener("click", nextStep);
    }

    function spawnConfetti() {
        const colors = ['#fbc531', '#38bdf8', '#ec4899', '#10b981', '#8b5cf6', '#f97316'];
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'tutorial-confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 6;
            const isCircle = Math.random() > 0.5;
            
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            if (isCircle) {
                confetti.style.borderRadius = '50%';
            }
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 180 + 120;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 60;
            const rot = Math.random() * 720 - 360;
            
            confetti.style.setProperty('--tx', `${tx}px`);
            confetti.style.setProperty('--ty', `${ty}px`);
            confetti.style.setProperty('--rot', `${rot}deg`);
            
            document.body.appendChild(confetti);
            
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    function closeTutorial() {
        overlay.classList.remove("show");
        card.classList.remove("show");
        if (currentHighlight) {
            currentHighlight.classList.remove("tutorial-highlighted");
            currentHighlight = null;
        }
    }

    function updatePosition() {
        if (!card || !card.classList.contains("show")) return;

        if (card.classList.contains("tutorial-success-active")) {
            card.style.left = "50%";
            card.style.top = "50%";
            card.style.bottom = "auto";
            card.style.transform = "translate(-50%, -50%) scale(1.05)";
            return;
        }

        const step = steps[currentStep];
        let targetEl = null;
        if (step.selector) {
            targetEl = document.querySelector(step.selector);
        }

        // Mobile-Layout
        if (window.innerWidth <= 600) {
            card.style.left = "";
            card.style.top = "";
            card.style.bottom = "";
            card.style.transform = "";
            return;
        }

        // Desktop-Layout
        if (!targetEl) {
            // Zentrieren im Viewport
            card.style.left = "50%";
            card.style.top = "50%";
            card.style.bottom = "auto";
            card.style.transform = "translate(-50%, -50%) scale(1)";
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const gap = 15;
        const margin = 20;

        // Versuche standardmäßig, unter das Element zu legen
        let top = rect.bottom + gap;
        let left = rect.left + (rect.width - cardRect.width) / 2;

        // Wenn unter dem Element nicht genug Platz ist, darüber legen
        if (rect.bottom + gap + cardRect.height > window.innerHeight - margin) {
            top = rect.top - cardRect.height - gap;
        }

        // Ränder-Checks links und rechts, um Card im Viewport zu halten
        if (left < margin) {
            left = margin;
        } else if (left + cardRect.width > window.innerWidth - margin) {
            left = window.innerWidth - cardRect.width - margin;
        }

        // Ränder-Checks oben und unten, um Card im Viewport zu halten
        if (top < margin) {
            top = margin;
        } else if (top + cardRect.height > window.innerHeight - margin) {
            top = window.innerHeight - cardRect.height - margin;
        }

        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        card.style.bottom = "auto";
        card.style.transform = "none";
    }

    // Inits
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
