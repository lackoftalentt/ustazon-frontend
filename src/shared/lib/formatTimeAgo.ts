export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
        return 'только что';
    }

    if (diffMinutes < 60) {
        const word = getMinuteWord(diffMinutes);
        return `${diffMinutes} ${word} назад`;
    }

    if (diffHours < 24) {
        const word = getHourWord(diffHours);
        return `${diffHours} ${word} назад`;
    }

    if (diffDays < 30) {
        const word = getDayWord(diffDays);
        return `${diffDays} ${word} назад`;
    }

    return date.toLocaleDateString('ru-RU');
};

const getMinuteWord = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) return 'минуту';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
        return 'минуты';
    return 'минут';
};

const getHourWord = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) return 'час';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
        return 'часа';
    return 'часов';
};

const getDayWord = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
        return 'дня';
    return 'дней';
};
