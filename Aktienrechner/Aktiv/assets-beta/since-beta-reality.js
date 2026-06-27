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
                ({ invested, current, multiple }) => `Kurz gesagt: ${formatCurrency(invested)} hätten hier zu ${formatCurrency(current)} wachsen können. Faktor ${multiple}. Sieht gut aus.`,
                ({ invested, current, multiple }) => `Der sichtbare Zeitraum macht die Rechnung ganz einfach: ${formatCurrency(invested)} rein, ${formatCurrency(current)} raus. Faktor ${multiple}. Genau so funktioniert Vermögensaufbau, wenn man es einfach laufen lässt.`,
                ({ invested, current, multiple }) => `Compound-Effekt in Zahlen: aus ${formatCurrency(invested)} wurden hier ${formatCurrency(current)}. Faktor ${multiple}. Das ist kein Glück, das ist Mathematik.`,
                ({ invested, current, multiple }) => `Time in the market schlägt timing: ${formatCurrency(invested)} investiert, ${formatCurrency(current)} heute. Faktor ${multiple}. Der Chart zeigt's ganz nüchtern.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} konsequent investiert, ${formatCurrency(current)} als Ergebnis. Faktor ${multiple}. Boring wins.`,
                ({ invested, current, multiple }) => `Inflation war in diesem Zeitraum kein Thema für diese ${formatCurrency(invested)}, die zu ${formatCurrency(current)} geworden wären. Faktor ${multiple}.`,
                ({ invested, current, multiple }) => `Dollar-Cost-Averaging macht genau das: ${formatCurrency(invested)} eingestreut, ${formatCurrency(current)} heute. Faktor ${multiple}. Ohne Timing-Stress.`,
                ({ invested, current, multiple }) => `Wer ${formatCurrency(invested)} in diesem Fenster dringelassen hätte, schaut heute auf ${formatCurrency(current)}. Faktor ${multiple}. Nicht aufgeregt, einfach nur sachlich gut.`,
                ({ invested, current, multiple }) => `Ein nüchterner Blick auf die Zahlen: ${formatCurrency(invested)} → ${formatCurrency(current)}. Faktor ${multiple}. Der Markt tut, was der Markt tut, und hier lief er gut.`,
                ({ invested, current, multiple }) => `Langfristig denken lohnt sich, jedenfalls in diesem Fenster: ${formatCurrency(invested)} wären jetzt ${formatCurrency(current)}. Faktor ${multiple}. Klare Sache.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} → ${formatCurrency(current)}, Faktor ${multiple}. Das ist der Unterschied zwischen Sparbuch und Markt – sauber, sachlich, klar.`
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
                ({ invested, current, multiple }) => `Kurz gesagt: statt Kleingeld zu verbrennen, hätten ${formatCurrency(invested)} hier zu ${formatCurrency(current)} wachsen können. Faktor ${multiple}. Der Markt war gütiger als viele Konsumentscheidungen.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} hätten hier ${formatCurrency(current)} gebracht. Faktor ${multiple}. Das ist mehr als viele für Handyversicherungen, Premium-Abos und Lieferservices zusammen verbrennen.`,
                ({ invested, current, multiple }) => `Statt ${formatCurrency(invested)} in sinnfreie Dinge zu stecken, hätte man damit ${formatCurrency(current)} machen können. Faktor ${multiple}. Der Jahres-Streaming-Vergleich freut sich.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} rein, ${formatCurrency(current)} raus, Faktor ${multiple}. Für jeden, der sich fragt, ob das tägliche Mittagessen außer Haus vielleicht doch nicht optimal budgetiert ist.`,
                ({ invested, current, multiple }) => `Aus ${formatCurrency(invested)} wurden hier ${formatCurrency(current)}. Faktor ${multiple}. Irgendwo kauft jemand seinen dritten Sneaker diesen Monat und fragt sich, warum's am Ende nicht reicht.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} investiert, ${formatCurrency(current)} Ergebnis. Faktor ${multiple}. Kleiner Reminder: Impulskäufe im Sale sind selten ein echtes Sparangebot.`,
                ({ invested, current, multiple }) => `In diesem Zeitraum wären ${formatCurrency(invested)} zu ${formatCurrency(current)} geworden. Faktor ${multiple}. Aber okay, die Fast-Fashion-Kollektion hatte auch ihren Charme.`,
                ({ invested, current, multiple }) => `Faktor ${multiple} auf ${formatCurrency(invested)}, ergibt ${formatCurrency(current)}. Das ist die Rendite, die Takeout-Bestellungen und Taxi-Apps zusammen halt nicht liefern.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} → ${formatCurrency(current)}, Faktor ${multiple}. Das Geld für Produkte, die man nie nutzt, summiert sich über die Jahre auch ganz anders auf.`,
                ({ invested, current, multiple }) => `Kurz nachrechnen: ${formatCurrency(invested)} hätten hier Faktor ${multiple} gemacht, also ${formatCurrency(current)}. Und das, während monatlich ein Haufen Abos still und leise Geld abbuchen.`,
                ({ invested, current, multiple }) => `${formatCurrency(current)} wären hier drin, wenn ${formatCurrency(invested)} investiert worden wären. Faktor ${multiple}. Die Frage, wo das Geld stattdessen hingegangen ist, beantwortet jeder für sich selbst.`
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
                ({ invested, current, multiple }) => `Kurz gesagt: ${formatCurrency(invested)} hätten hier ${formatCurrency(current)} werden können. Faktor ${multiple}. Stattdessen wurde das Geld wahrscheinlich mit voller Überzeugung in Dinge verwandelt, die heute weniger Wert haben als ein trauriger Kassenbon.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} hätten in diesem Zeitraum ${formatCurrency(current)} ergeben. Faktor ${multiple}. Das ist das Geld, das theoretisch schon für dich gearbeitet hätte, während du dich mit komplett anderen Prioritäten beschäftigt hast.`,
                ({ invested, current, multiple }) => `Aus ${formatCurrency(invested)} wären ${formatCurrency(current)} geworden. Faktor ${multiple}. Und das in einem Zeitraum, in dem vermutlich auch Geld für Dinge ausgegeben wurde, an die sich heute niemand mehr erinnert.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} Einsatz, ${formatCurrency(current)} Ergebnis, Faktor ${multiple}. Das ist der Betrag, der dir in 20 Jahren erklärt hätte, warum frühes Investieren keine Optionssache war.`,
                ({ invested, current, multiple }) => `Der Markt hatte hier Faktor ${multiple} zu bieten. Aus ${formatCurrency(invested)} wären ${formatCurrency(current)} geworden. Das Fiese: Der Markt fragt nicht, ob man bereit war. Er läuft einfach.`,
                ({ invested, current, multiple }) => `${formatCurrency(current)} aus ${formatCurrency(invested)}, Faktor ${multiple}. Wäre das passiert, hätte zumindest ein Teil der Zukunft schon für sich selbst gesorgt. Stattdessen läuft die Uhr weiter.`,
                ({ invested, current, multiple }) => `Faktor ${multiple} auf ${formatCurrency(invested)} ergibt ${formatCurrency(current)}. Die Zahl, bei der man kurz anhält und fragt, was genau damals eigentlich wichtiger war.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} → ${formatCurrency(current)}, Faktor ${multiple}. Das ist keine Zahl aus der Zukunft, das ist Vergangenheit. Bereits gelaufen. Bereits verpasst. Der Chart lügt da nicht.`,
                ({ invested, current, multiple }) => `Dieser Bereich macht es explizit: ${formatCurrency(invested)} rein, ${formatCurrency(current)} raus, Faktor ${multiple}. Die nächste Generation wird nicht fragen, ob man hätte wissen können. Die Daten waren immer da.`,
                ({ invested, current, multiple }) => `${formatCurrency(invested)} hätten hier auf ${formatCurrency(current)} gewachsen. Faktor ${multiple}. Das ist die Zahl, die man sich merkt, wenn man begreift, dass Warten auch eine finanzielle Entscheidung ist – nur eine teurere.`,
                ({ invested, current, multiple }) => `Faktor ${multiple}. Aus ${formatCurrency(invested)} wurden ${formatCurrency(current)}. Das ist Mathematik, keine Meinung. Wer früh anfängt gewinnt nicht immer, aber wer zu spät anfängt verliert fast immer ein bisschen.`
            ]
        };
        let realityAnimationTimeouts = [];

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

            if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                updateCallback();
                return;
            }

            realityAnimationTimeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
            realityAnimationTimeouts = [];
            element.classList.remove('reality-text-enter');
            element.classList.add('reality-text-exit');

            const updateTimeout = window.setTimeout(() => {
                updateCallback();

                element.classList.remove('reality-text-exit');
                void element.offsetWidth;
                element.classList.add('reality-text-enter');

                const cleanupTimeout = window.setTimeout(() => {
                    element.classList.remove('reality-text-enter');
                    realityAnimationTimeouts = realityAnimationTimeouts.filter(timeoutId => timeoutId !== cleanupTimeout);
                }, 460);

                realityAnimationTimeouts.push(cleanupTimeout);
            }, 165);

            realityAnimationTimeouts.push(updateTimeout);
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
                // Force cache invalidation so the new mode's message always renders,
                // even when the visible chart range hasn't changed.
                if (typeof _lastStatsRange !== 'undefined') {
                    _lastStatsRange = { start: -1, end: -1 };
                }
                updateVisibleStats();
            });
        }

        function getRandomRealityCheck(invested, current, multiple) {
            const pool = realityCheckTemplates[realityMode] || realityCheckTemplates.LARP;
            const template = pool[Math.floor(Math.random() * pool.length)];
            return template({ invested, current, multiple });
        }
