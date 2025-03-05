class TranslationService {
    /**
     * Dynamic translation function
     * @param {Object} fieldsToTranslate - Object containing the fields to be translated
     * @param {string} [targetLanguage='fr'] - Translation target language
     * @returns {Promise<Object|null>} Object translated or null on error
     */
    static async translateToFrench(fieldsToTranslate, targetLanguage = 'fr') {
        try {
            // Utility function to preserve formatting
            const preserveFormatting = (text) => {
                if (typeof text !== 'string') return text;

                return text
                    .replace(/\|/g, '[[VERTICAL_BAR]]')   // Preserving the pipes in the paintings
                    .replace(/\n/g, '[[NEW_LINE]]')       // Preserving line breaks
                    .replace(/```/g, '[[CODE_BLOCK]]')    // Preserving code blocks
                    .replace(/\[/g, '[[OPEN_BRACKET]]')   // Preserve opening hooks
                    .replace(/\]/g, '[[CLOSE_BRACKET]]'); //
            };

            // Utility function to restore formatting
            const restoreFormatting = (text) => {
                if (typeof text !== 'string') return text;

                return text
                    .replace(/\[\[VERTICAL_BAR\]\]/g, '|')
                    .replace(/\[\[NEW_LINE\]\]/g, '\n')
                    .replace(/\[\[CODE_BLOCK\]\]/g, '```')
                    .replace(/\[\[OPEN_BRACKET\]\]/g, '[')
                    .replace(/\[\[CLOSE_BRACKET\]\]/g, ']');
            };

            // Input validation
            if (!fieldsToTranslate || Object.keys(fieldsToTranslate).length === 0) {
                throw new Error('Aucun champ à traduire');
            }

            // Check API key
            if (!process.env.GOOGLE_SECRET_KEY) {
                throw new Error('Clé de traduction Google non configurée');
            }

            // Preparing texts for translation
            const textToTranslate = Object.entries(fieldsToTranslate).map(([key, value]) =>
                preserveFormatting(value)
            );

            // Calling up the translation API
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_SECRET_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: textToTranslate,
                        target: targetLanguage,
                        format: 'text',
                    }),
                }
            );

            // console.log(`textToTranslate ${response.status}`);

            const data = await response.json();

            // Managing translation errors
            if (response.status !== 200 || !data?.data?.translations) {
                throw new Error('Échec de la traduction');
            }

            // Restore translation formatting
            const translatedFields = {};
            const originalKeys = Object.keys(fieldsToTranslate);

            data.data.translations.forEach((translation, index) => {
                const key = originalKeys[index];
                translatedFields[key] = restoreFormatting(translation.translatedText);
            });

            // Optional logging
            console.log('Successful translation:', translatedFields);

            return translatedFields;
        } catch (err) {
            // Improved error handling
            console.error('Translation error :', err.message);
            return null;
        }
    }

    /**
     * Blog-specific translation function
     * @param {Object} blogData - Blog data to be translated
     * @returns {Promise<Object|null>} Translated or null data
     */
    static async translateBlogContent(blogData) {
        try {
            // Translate the required fields
            const translations = await this.translateToFrench({
                title: blogData.title,
                markdownContent: blogData.markdownContent,
                author: blogData.author,
                shortDesc: blogData.shortDesc
            });

            if (!translations) {
                throw new Error('Translation failure');
            }

            return translations;
        } catch (error) {
            console.error('Blog translation error : ', error);
            return null;
        }
    }

    /**
     * Translate category.js content
     * @param {Object} categoryData - Category data to be translated
     * @returns {Promise<Object|null>} Translated or null data
     */
    static async translateCategoryContent(categoryData) {
        try {
            const translations = await this.translateToFrench({
                name: categoryData.name,
                description: categoryData.description
            });

            if (!translations) {
                throw new Error('Category translation failed');
            }

            return translations;
        } catch (error) {
            console.error('Category translation error:', error);
            return null;
        }
    }
}

module.exports = TranslationService;