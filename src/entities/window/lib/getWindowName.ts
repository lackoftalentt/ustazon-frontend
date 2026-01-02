import { WINDOW_DATA } from '../model/windowData';

export const getWindowName = (windowId: number | null): string => {
    if (windowId === null) return 'Без категории';
    const windowData = WINDOW_DATA.find(w => w.id === windowId);
    return windowData?.name || `Window ID: ${windowId}`;
};
