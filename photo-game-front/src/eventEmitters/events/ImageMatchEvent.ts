export type ImageMatchEventParams = {
    imageId: string;
    state: 'success' | 'error';
    title?: string;
}

export const ImageMatchEvent = 'imageSuccess';
