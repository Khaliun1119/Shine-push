/**
 * Shared mutable app state. Import as `state` and mutate fields directly.
 */
export const state = {
    lang: localStorage.getItem('chromasense_lang') || 'mn',
    file: null,
    cameraStream: null,
    clothing: {},
    outfits: [],
};

export const API_BASE = window.location.origin;
