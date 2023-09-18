export interface FormatMonetaryValueOptions extends Intl.NumberFormatOptions {
    /**
     * The locale to use. If undefined, the browser's locale is used.
     */
    locale?: string;
}

export const formatMonetaryValue = (value: number, currency: string, options: FormatMonetaryValueOptions = {}) => {
    const { locale, ...intlOptions } = options;
    if (typeof value !== 'number' || !currency) {
        throw new Error('value and currency are required');
    }
    return new Intl.NumberFormat(locale, {
        ...intlOptions,
        style: 'currency',
        currency,
    }).format(value);
};
