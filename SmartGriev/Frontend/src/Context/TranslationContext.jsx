
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";

// import language files
import en from "../i18n_jsonFiles/en.json";
import hi from "../i18n_jsonFiles/hindi.json";
import gu from "../i18n_jsonFiles/gujrati.json";
import mr from "../i18n_jsonFiles/marathi.json";

const TranslationContext = createContext();

const languages = {
    en,
    hi,
    gu,
    mr
};

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    const t = (key) => {
        return languages[language]?.[key] || key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationContext = () => {
    return useContext(TranslationContext);
};