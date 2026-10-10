/* ==========================================
   MathSutra — Shared App System
   Language: English / Hinglish
   Modes: CBSE Boards / JEE Main
========================================== */

(() => {
    "use strict";

    const STORAGE = {
        language: "mathsutra-language",
        mode: "mathsutra-mode"
    };

    const settings = {
        language: localStorage.getItem(STORAGE.language) || "en",
        mode: localStorage.getItem(STORAGE.mode) || "boards"
    };

    // Keep settings valid
    if (!["en", "hi"].includes(settings.language)) {
        settings.language = "en";
    }

    if (!["boards", "jee"].includes(settings.mode)) {
        settings.mode = "boards";
    }

    // Text dictionary for shared interface
    const translations = {
        en: {
            settings: "STUDY SETTINGS",
            language: "Language",
            mode: "Study Mode",
            english: "English",
            hinglish: "Hinglish",
            boards: "CBSE Boards",
            jee: "JEE Main",
            saved: "Your preferences are saved automatically.",
            boardsNote: "You are using CBSE Boards mode.",
            jeeNote: "You are using JEE Main mode."
        },

        hi: {
            settings: "PADHAI KI SETTINGS",
            language: "Bhasha",
            mode: "Study Mode",
            english: "English",
            hinglish: "Hinglish",
            boards: "CBSE Boards",
            jee: "JEE Main",
            saved: "Tumhari settings apne aap save hoti hain.",
            boardsNote: "Tum CBSE Boards mode mein ho.",
            jeeNote: "Tum JEE Main mode mein ho."
        }
    };

    function saveSettings() {
        localStorage.setItem(STORAGE.language, settings.language);
        localStorage.setItem(STORAGE.mode, settings.mode);

        document.documentElement.lang =
            settings.language === "hi" ? "hi" : "en";

        document.documentElement.dataset.language = settings.language;
        document.documentElement.dataset.studyMode = settings.mode;

        document.dispatchEvent(
            new CustomEvent("mathsutra:settingsChanged", {
                detail: { ...settings }
            })
        );
    }

    // Build the settings panel
    function createSettingsPanel() {
        if (document.getElementById("mathsutra-settings")) return;

        const panel = document.createElement("section");
        panel.id = "mathsutra-settings";

        panel.innerHTML = `
            <style>
                #mathsutra-settings {
                    position: relative;
                    z-index: 1000;
                    margin: 12px auto;
                    width: min(94%, 1000px);
                    padding: 16px;
                    border: 1px solid rgba(120, 130, 255, 0.4);
                    border-radius: 16px;
                    background: rgba(12, 16, 42, 0.96);
                    color: #f3f4ff;
                    font-family: Arial, sans-serif;
                    box-sizing: border-box;
                    box-shadow: 0 0 20px rgba(100, 80, 255, 0.12);
                }

                #mathsutra-settings * {
                    box-sizing: border-box;
                }

                #mathsutra-settings .ms-title {
                    margin: 0 0 14px;
                    font-size: 16px;
                    letter-spacing: 1px;
                    color: #aeb8ff;
                }

                #mathsutra-settings .ms-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                }

                #mathsutra-settings .ms-group {
                    flex: 1 1 220px;
                    min-width: 0;
                }

                #mathsutra-settings label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 13px;
                    color: #c9cbed;
                }

                #mathsutra-settings select {
                    width: 100%;
                    min-height: 44px;
                    padding: 10px;
                    border: 1px solid #545e9e;
                    border-radius: 9px;
                    background: #171d45;
                    color: white;
                    font-size: 14px;
                    outline-offset: 3px;
                }

                #mathsutra-settings .ms-note {
                    margin: 12px 0 0;
                    font-size: 12px;
                    line-height: 1.5;
                    color: #b8c0e9;
                }

                @media (max-width: 480px) {
                    #mathsutra-settings {
                        padding: 12px;
                    }

                    #mathsutra-settings .ms-row {
                        gap: 10px;
                    }
                }
            </style>

            <h3 class="ms-title" data-ms-text="settings">
                STUDY SETTINGS
            </h3>

            <div class="ms-row">
                <div class="ms-group">
                    <label for="ms-language" data-ms-text="language">
                        Language
                    </label>

                    <select id="ms-language">
                        <option value="en">English</option>
                        <option value="hi">Hinglish</option>
                    </select>
                </div>

                <div class="ms-group">
                    <label for="ms-mode" data-ms-text="mode">
                        Study Mode
                    </label>

                    <select id="ms-mode">
                        <option value="boards">CBSE Boards</option>
                        <option value="jee">JEE Main</option>
                    </select>
                </div>
            </div>

            <p class="ms-note" id="ms-note" aria-live="polite"></p>
        `;

        // Insert below the existing header, if present
        const header = document.querySelector("header");

        if (header && header.parentNode) {
            header.insertAdjacentElement("afterend", panel);
        } else {
            document.body.prepend(panel);
        }

        const languageSelect = panel.querySelector("#ms-language");
        const modeSelect = panel.querySelector("#ms-mode");

        languageSelect.value = settings.language;
        modeSelect.value = settings.mode;

        languageSelect.addEventListener("change", () => {
            settings.language = languageSelect.value;
            updateInterface();
        });

        modeSelect.addEventListener("change", () => {
            settings.mode = modeSelect.value;
            updateInterface();
        });
    }

    // Translate elements that use data-ms-text
    function updateInterface() {
        saveSettings();

        const dictionary = translations[settings.language];

        document.querySelectorAll("[data-ms-text]").forEach(element => {
            const key = element.dataset.msText;

            if (dictionary[key]) {
                element.textContent = dictionary[key];
            }
        });

        const note = document.getElementById("ms-note");

        if (note) {
            const noteKey =
                settings.mode === "jee" ? "jeeNote" : "boardsNote";

            note.textContent =
                dictionary[noteKey] + " " + dictionary.saved;
        }

        const languageSelect = document.getElementById("ms-language");
        const modeSelect = document.getElementById("ms-mode");

        if (languageSelect) {
            languageSelect.value = settings.language;
        }

        if (modeSelect) {
            modeSelect.value = settings.mode;
        }

        // Hide sections explicitly marked for the other study mode
        document.querySelectorAll("[data-mode-only]").forEach(element => {
            const allowedModes = element.dataset.modeOnly
                .split(/\s+/)
                .filter(Boolean);

            element.hidden = !allowedModes.includes(settings.mode);
        });
    }

    function initialiseMathSutra() {
        createSettingsPanel();
        updateInterface();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseMathSutra
        );
    } else {
        initialiseMathSutra();
    }

    // Allow other chapter scripts to read current preferences
    window.MathSutra = {
        getSettings: () => ({ ...settings }),
        getTranslations: () => translations[settings.language]
    };
})();