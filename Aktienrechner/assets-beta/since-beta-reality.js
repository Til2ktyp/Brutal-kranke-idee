        const realityCheckTemplates = {
            LARP: [
                ({ invested, current, multiple }) => `In diesem sichtbaren Zeitraum wären aus ${formatCurrency(invested)} einfach ${formatCurrency(current)} geworden. Faktor ${multiple}. Gar nicht mal so uncharmant.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} eingezahlt, ${formatCurrency(current)} rausbekommen. Faktor ${multiple}. Das ist schon ein ziemlich stabiler Rückblick.`,
                ({ invested, current, multiple }) => `Hättest du in diesem Abschnitt ${formatCurrency(invested)} investiert, läge das jetzt bei ${formatCurrency(current)}. Faktor ${multiple}. Das sieht schon sauber aus.`,
                ({ invested, current, multiple }) => `Aus ${formatCurrency(invested)} wären hier ${formatCurrency(current)} geworden. Faktor ${multiple}. Ruhig, sachlich, trotzdem aua.`,
                ({ invested, current, multiple }) => `Dieser sichtbare Bereich sagt ganz trocken: ${formatCurrency(invested)} rein, ${formatCurrency(current)} heute. Faktor ${multiple}. Nicht übel.`,
                ({ invested, current, multiple }) => `Wenn man es runterbricht: ${formatCurrency(invested)} investiert, ${formatCurrency(current)} Wert. Faktor ${multiple}. Kann man mitnehmen.`,
                ({ invested, current, multiple }) => `Hier hättest du aus ${formatCurrency(invested)} einfach ${formatCurrency(current)} machen können. Faktor ${multiple}. Das ist schon ordentlich.`,
                ({ invested, current, multiple }) => `Der Chart ist da recht eindeutig: ${formatCurrency(invested)} wären in diesem Zeitraum zu ${formatCurrency(current)} geworden. Faktor ${multiple}.`,
                ({ invested, current, multiple }) => `In diesem Fenster reden wir von ${formatCurrency(invested)} Einsatz und ${formatCurrency(current)} Ergebnis. Faktor ${multiple}. Ganz entspannter Reality Check.`,
                ({ invested, current, multiple }) => `Kurz gesagt: ${formatCurrency(invested)} hätten hier zu ${formatCurrency(current)} wachsen können. Faktor ${multiple}. Sieht gut aus.`
            ],
            DERP: [
                ({ invested, current, multiple }) => `In diesem sichtbaren Zeitraum wären aus ${formatCurrency(invested)} einfach ${formatCurrency(current)} geworden. Faktor ${multiple}. Brutal, wenn man bedenkt, wie viel Geld sonst Monat für Monat einfach verdampft.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} eingezahlt, ${formatCurrency(current)} rausbekommen. Faktor ${multiple}. Das ist der Teil, wo man kurz still an die ganzen unnötigen Käufe denkt.`,
                ({ invested, current, multiple }) => `Hättest du in diesem Abschnitt stumpf ${formatCurrency(invested)} hier reingeworfen, läge das jetzt bei ${formatCurrency(current)}. Faktor ${multiple}. Die Kippen hätten sich darüber safe nicht gefreut.`,
                ({ invested, current, multiple }) => `Aus ${formatCurrency(invested)} wären hier ${formatCurrency(current)} geworden. Faktor ${multiple}. Finanzielle Ohrfeige, aber immerhin mit Stil.`,
                ({ invested, current, multiple }) => `Dieser sichtbare Bereich sagt ganz trocken: ${formatCurrency(invested)} rein, ${formatCurrency(current)} heute. Faktor ${multiple}. Manche Ausgaben altern halt echt wie Milch.`,
                ({ invested, current, multiple }) => `Wenn man es auf das Wesentliche runterbricht: ${formatCurrency(invested)} investiert, ${formatCurrency(current)} Wert. Faktor ${multiple}. Tut bisschen weh, sieht aber geil aus.`,
                ({ invested, current, multiple }) => `Hier hättest du aus ${formatCurrency(invested)} einfach ${formatCurrency(current)} machen können. Faktor ${multiple}. Nicht jede Monatsausgabe hätte so geliefert.`,
                ({ invested, current, multiple }) => `Der Chart macht keine Faxen: ${formatCurrency(invested)} wären in diesem Zeitraum zu ${formatCurrency(current)} geworden. Faktor ${multiple}. Das ist schon fast frech.`,
                ({ invested, current, multiple }) => `In diesem Fenster reden wir von ${formatCurrency(invested)} Einsatz und ${formatCurrency(current)} Ergebnis. Faktor ${multiple}. Genau die Art von Rückblick, die kurz die Seele aus dem Körper zieht.`,
                ({ invested, current, multiple }) => `Kurz gesagt: statt Kleingeld zu verbrennen, hätten ${formatCurrency(invested)} hier zu ${formatCurrency(current)} wachsen können. Faktor ${multiple}. Der Markt war gütiger als viele Konsumentscheidungen.`
            ],
            BRUTAL: [
                ({ invested, current, multiple }) => `Bevor dein Leben überhaupt ernsthaft gestartet ist, hätte ${formatCurrency(invested)} hier schon zu ${formatCurrency(current)} werden können. Faktor ${multiple}. Stattdessen wurde Zeit offenbar lieber genutzt, um finanziell komplett am Punkt vorbeizuleben.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} hätten hier ${formatCurrency(current)} ergeben. Faktor ${multiple}. Das ist dieser seltene Moment, in dem selbst deine Vergangenheit dich mit enttäuschtem Blick anguckt.`,
                ({ invested, current, multiple }) => `Aus ${formatCurrency(invested)} wären in diesem Abschnitt ${formatCurrency(current)} geworden. Faktor ${multiple}. Ehrlich, man hätte fast schon investieren sollen, bevor man überhaupt wusste, wie man Schuhe bindet.`,
                ({ invested, current, multiple }) => `Hier reden wir über ${formatCurrency(invested)} Einsatz und ${formatCurrency(current)} Ergebnis. Faktor ${multiple}. Gegen diese Zahl sehen viele alte Entscheidungen aus wie ein Langzeitprojekt in finanzieller Selbstverarsche.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} investiert hätte hier ${formatCurrency(current)} gebracht. Faktor ${multiple}. Der Markt war bereit, aber deine Historie hatte anscheinend andere, deutlich dämlichere Pläne.`,
                ({ invested, current, multiple }) => `In diesem Fenster wurden aus ${formatCurrency(invested)} theoretisch ${formatCurrency(current)}. Faktor ${multiple}. Statt Vermögen mitzunehmen, wurde offenbar lieber Kapital in belanglosen Quatsch zerlegt.`,
                ({ invested, current, multiple }) => `Dieser Bereich zeigt gnadenlos: ${formatCurrency(invested)} rein, ${formatCurrency(current)} raus. Faktor ${multiple}. Wenn man das sieht, fragt man sich schon, wie kreativ Geld über die Jahre verbrannt wurde.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} hätten hier auf ${formatCurrency(current)} wachsen können. Faktor ${multiple}. Anders gesagt: Man hätte schon investieren sollen, als man noch nicht mal wusste, was Steuern überhaupt sind.`,
                ({ invested, current, multiple }) => `Der Chart macht es peinlich eindeutig: ${formatCurrency(invested)} wären zu ${formatCurrency(current)} geworden. Faktor ${multiple}. Das ist nicht einfach nur verpasst, das ist fast schon kunstvoll an gutem Timing vorbeigelaufen.`,
                ({ invested, current, multiple }) => `Kurz gesagt: ${formatCurrency(invested)} hätten hier ${formatCurrency(current)} werden können. Faktor ${multiple}. Stattdessen wurde das Geld wahrscheinlich mit voller Überzeugung in Dinge verwandelt, die heute weniger Wert haben als ein trauriger Kassenbon.`
            ]
        };

        function getRealityCheckElement() {
            const selectors = [
                '#realityCheckText',
                '#realityCheckMessage',
                '.reality-check-text',
                '.reality-check-message',
                '[data-reality-check]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element;
            }

            return null;
        }

        function animateRealityCheckUpdate(updateCallback) {
            const element = getRealityCheckElement();

            if (!element || typeof element.animate !== 'function') {
                updateCallback();
                return;
            }

            element.getAnimations().forEach(animation => animation.cancel());

            const exitAnimation = element.animate(
                [
                    {
                        opacity: 1,
                        transform: 'translateY(0) scale(1)',
                        filter: 'blur(0)'
                    },
                    {
                        opacity: 0,
                        transform: 'translateY(-5px) scale(0.992)',
                        filter: 'blur(2px)'
                    }
                ],
                {
                    duration: 130,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );

            exitAnimation.onfinish = () => {
                updateCallback();

                element.animate(
                    [
                        {
                            opacity: 0,
                            transform: 'translateY(8px) scale(0.992)',
                            filter: 'blur(2px)'
                        },
                        {
                            opacity: 1,
                            transform: 'translateY(0) scale(1)',
                            filter: 'blur(0)'
                        }
                    ],
                    {
                        duration: 280,
                        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                        fill: 'forwards'
                    }
                );
            };
        }

        function setRealityMode(mode) {
            realityMode = mode;
            document.querySelectorAll('.reality-mode-btn').forEach(button => {
                button.classList.toggle('active', button.dataset.mode === mode);
            });

            if (portfolioData) {
                const xScale = chart && chart.scales && chart.scales.x ? chart.scales.x : null;
                const startIndex = xScale && Number.isFinite(xScale.min) ? Math.max(0, Math.floor(xScale.min)) : 0;
                const endIndex = xScale && Number.isFinite(xScale.max)
                    ? Math.min(portfolioData.months.length - 1, Math.ceil(xScale.max))
                    : portfolioData.months.length - 1;

                const investedAmounts = portfolioData.investedAmounts;
                const portfolioValues = portfolioData.portfolioValues;
                const previousInvested = startIndex > 0 ? investedAmounts[startIndex - 1] : 0;
                const currentInvestedTotal = investedAmounts[endIndex] || 0;
                const investedInRange = currentInvestedTotal - previousInvested;
                const currentPortfolio = portfolioValues[endIndex] || 0;
                const opportunityMultiple = investedInRange > 0 ? currentPortfolio / investedInRange : 0;

                if (investedInRange > 0) {
                    currentRealityCheckMessage = getRandomRealityCheck(
                        investedInRange,
                        currentPortfolio,
                        opportunityMultiple.toFixed(2)
                    );
                }
            }

            animateRealityCheckUpdate(() => {
                updateVisibleStats();
            });
        }

        function getRandomRealityCheck(invested, current, multiple) {
            const pool = realityCheckTemplates[realityMode] || realityCheckTemplates.LARP;
            const template = pool[Math.floor(Math.random() * pool.length)];
            return template({ invested, current, multiple });
        }
