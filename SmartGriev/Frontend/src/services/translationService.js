const API_URL = "https://api.mymemory.translated.net/get";

export const translateText = async (text, targetLang) => {

    if (!text || targetLang === "en") {
        return text;
    }

    try {

        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );

        const data = await response.json();

        return data.responseData.translatedText;

    } catch (error) {

        console.error("Translation Error:", error);

        return text;
    }
};