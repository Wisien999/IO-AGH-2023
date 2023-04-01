export type ImageMatchEventParams = {
    imageId?: string;
    state: 'success' | 'error' | 'info';
    title?: string;
}

export const ImageMatchEvent = 'imageSuccess';
