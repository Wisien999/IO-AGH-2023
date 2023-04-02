export type ImageMatchEventParams = {
    imageId?: string;
    state: 'success' | 'error' | 'info';
    title?: string | null;
}

export const ImageMatchEvent = 'imageSuccess';
