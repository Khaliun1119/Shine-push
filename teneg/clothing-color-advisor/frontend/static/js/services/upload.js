import { state } from '../state.js';
import { t } from '../i18n.js';
import { showError, showUploadArea } from './ui.js';

const dom = {
    uploadMethods: null,
    fileInput: null,
    preview: null,
    previewImage: null,
    camera: null,
};

export function bindUploadElements(refs) {
    Object.assign(dom, refs);
}

export function handleFile(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showError(
            t('error.title'),
            state.lang === 'mn' ? 'JPEG, PNG эсвэл WebP зураг оруулна уу.' : 'Please upload a JPEG, PNG or WebP image.'
        );
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showError(
            t('error.title'),
            state.lang === 'mn' ? 'Зураг хэт том байна. Хамгийн ихдээ 10MB байна.' : 'Image too large. Maximum 10MB.'
        );
        return;
    }
    state.file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        dom.previewImage.src = e.target.result;
        showPreview();
    };
    reader.readAsDataURL(file);
}

export function showPreview() {
    dom.uploadMethods.style.display = 'none';
    dom.camera.style.display = 'none';
    dom.preview.style.display = 'block';
}

export function clearPreview() {
    state.file = null;
    dom.previewImage.src = '';
    dom.preview.style.display = 'none';
    dom.fileInput.value = '';
    showUploadArea();
}
