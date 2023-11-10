export default class Lang {
    static #browserLanguageCode = null;
    static #fallbackLanguageCode = "en";
    static #translationFilesRootFolder = "/langs";

    static #fetchedTranslationFiles = {};
    static #onlanguageChangeEvents = [];
    static #pendingTranslationFilesRequest = {};

    static async #getTranslationFile(filePath) {
        if (this.#fetchedTranslationFiles[filePath] === null)
            return null;
        if (this.#fetchedTranslationFiles[filePath] !== undefined) {
            return this.#fetchedTranslationFiles[filePath];
        }

        if (this.#pendingTranslationFilesRequest[filePath]) {
            return await this.#pendingTranslationFilesRequest[filePath];
        }

        let resolveCallback = null;
        this.#pendingTranslationFilesRequest[filePath] = new Promise((resolve, reject) => { resolveCallback = resolve; });

        const data = await fetch(filePath);
        try {
            const json = await data.json();
            this.#fetchedTranslationFiles[filePath] = json;
            resolveCallback?.(json);
            return json;
        } catch {
            this.#fetchedTranslationFiles[filePath] = null;
            resolveCallback?.(null);
            return null;
        }
    }

    static #getFilePath(language, file) {
        return `${this.#getTranslationFilesRootFolder()}/${language}/${file}.json`
    }

    static #sanitizeLanguageCode(code) {
        if (!code) return null;
        if (code.length > 2) code = code.split("-")[0];
        if (code.length > 2) code = code.substring(0, 2);
        return code.toLowerCase();
    }

    static #getTranslationFilesRootFolder() {
        return this.#translationFilesRootFolder;
    }

    static #getFallbackLanguageCode() {
        return this.#fallbackLanguageCode;
    }

    static #setSavedLanguageCode(code) {
        if (!code) localStorage.removeItem("lang");
        else localStorage.setItem("lang", code);
        this.#onlanguageChangeEvents.forEach(callback => callback(code));
    }

    static #getSavedLanguageCode() {
        return localStorage.getItem("lang") ?? null;
    }

    static #retreiveBrowserLanguageCode() {
        this.#setBrowserLanguageCode(this.#sanitizeLanguageCode(navigator.language || navigator.userLanguage))
    }

    static #getBrowserLanguageCode() {
        if (!this.#browserLanguageCode)
            this.#retreiveBrowserLanguageCode();
        return this.#browserLanguageCode;
    }

    static #setBrowserLanguageCode(code) {
        this.#browserLanguageCode = code;
    }

    static #getFormatedText(text, format) {
        if (!format) return text;
        for (const key in format) {
            if (text.includes(`{${key}}`))
                text = text.replace(`{${key}}`, format[key]);
        }
        return text;
    }

    static #processTranslation(translation) {
        if (typeof translation === "string") return translation;
        if (Array.isArray(translation)) return translation.join("\n");
        return JSON.stringify(translation);
    }

    static getLanguages() {
        return [
            { value: "en", name: "English" },
            { value: "fr", name: "Français" },
            { value: "",   name: "Auto"}
        ];
    }

    static getLanguage() {
        return this.#getSavedLanguageCode() ?? this.#getBrowserLanguageCode() ?? this.#getFallbackLanguageCode();
    }

    static setLanguage(value) {
        this.#setSavedLanguageCode(this.#sanitizeLanguageCode(value));
    }

    static registerOnLanguageChange(callback) {
        this.#onlanguageChangeEvents.push(callback);
    }

    static async TranslateAsync(context) {
        if (!this.isValidContext(context)) {
            console.error("Invalid translation context : ", context);
            return null;
        }

        const filePath = this.#getFilePath(this.getLanguage(), context.file);
        const translationFile = await this.#getTranslationFile(filePath);
        if (translationFile && translationFile[context.code])
            return this.#processTranslation(translationFile[context.code]);

        const fallbackFilePath = this.#getFilePath(this.#getFallbackLanguageCode(), context.file);
        const fallbackTranslationFile = await this.#getTranslationFile(fallbackFilePath);
        if (fallbackTranslationFile && fallbackTranslationFile[context.code])
            return this.#processTranslation(fallbackTranslationFile[context.code]);

        console.error(
            "Translation not found for code [" + context.code + "] in file : [" + context.file + "]\n" +
            "Language : [" + this.Language + "]\n" +
            "Fallback language : [" + this.#getFallbackLanguageCode() + "]\n" +
            "Translation file : [" + filePath + "]\n" +
            "Fallback translation file : [" + fallbackFilePath + "]\n"
        );
        return null;
    }

    static async GetTextAsync(context) {
        if (!context) return null;
        if (typeof(context) === 'string') return context;

        const translation = await this.TranslateAsync(context);
        if (!translation) return null;
        return this.#getFormatedText(translation, context.format);
    }

    static GetText(context, callback) {
        this.GetTextAsync(context).then(callback);
    }

    static CreateTranslationContext(file, code, format) {
        return {file, code, format: format ?? undefined};
    }

    static isValidContext(context) {
        return context && context.file && context.code;
    }
}