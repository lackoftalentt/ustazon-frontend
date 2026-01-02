export const getWindowLink = (
    subjectCode: string,
    windowId: number | null
): string => {
    if (windowId === null) {
        return `/subjects-materials/${subjectCode}`;
    }
    return `/subjects-materials/${subjectCode}?window=${windowId}`;
};
