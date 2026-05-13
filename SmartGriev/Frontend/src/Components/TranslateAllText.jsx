import React, { useEffect, useState } from "react";
import { useTranslationContext } from "../Context/TranslationContext";

const Translate = ({ text }) => {

    const { language, t } = useTranslationContext();

    const [translated, setTranslated] = useState(text);

    useEffect(() => {

        const loadTranslation = async () => {

            const result = await t(text);

            setTranslated(result);

        };

        loadTranslation();

    }, [language, text]);

    return translated;
};

export default Translate;