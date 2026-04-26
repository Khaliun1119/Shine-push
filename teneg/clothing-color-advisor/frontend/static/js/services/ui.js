/* Global UI state transitions (upload / loading / error / preview visibility). */

const dom = {
    uploadMethods: null,
    preview: null,
    loading: null,
    error: null,
    errorTitle: null,
    errorMessage: null,
};

export function bindUiElements(refs) {
    Object.assign(dom, refs);
}

export function showUploadArea() {
    dom.uploadMethods.style.display = 'flex';
    dom.loading.style.display = 'none';
    dom.error.style.display = 'none';
}

export function showError(title, message) {
    dom.uploadMethods.style.display = 'none';
    dom.preview.style.display = 'none';
    dom.loading.style.display = 'none';
    dom.errorTitle.textContent = title;
    dom.errorMessage.textContent = message;
    dom.error.style.display = 'block';
}
