export const formatNumericInput = (
    value: string,
    maxLength: number
): string => {
    return value.replace(/\D/g, '').slice(0, maxLength);
};

export const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('8')) {
        cleaned = '+7' + cleaned.slice(1);
    }

    if (!cleaned.startsWith('+7') && cleaned.length > 0) {
        cleaned = '+7' + cleaned;
    }

    return cleaned.slice(0, 12);
};
