import { state } from '../state.js';
import { t } from '../i18n.js';
import { showError, showUploadArea } from './ui.js';
import { showPreview } from './upload.js';

const dom = {
    uploadMethods: null,
    camera: null,
    video: null,
    canvas: null,
    previewImage: null,
};

export function bindCameraElements(refs) {
    Object.assign(dom, refs);
}

export async function openCamera() {
    try {
        state.cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        dom.video.srcObject = state.cameraStream;
        dom.uploadMethods.style.display = 'none';
        dom.camera.style.display = 'block';
    } catch {
        showError(
            t('error.title'),
            state.lang === 'mn'
                ? 'Камерт нэвтрэх боломжгүй байна. Зөвшөөрлийг шалгаарай.'
                : 'Camera access denied. Please check permissions.'
        );
    }
}

export function capturePhoto() {
    const { canvas, video, previewImage } = dom;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
    closeCamera();
    state.file = 'webcam';
    showPreview();
}

export function closeCamera() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach((track) => track.stop());
        state.cameraStream = null;
    }
    dom.video.srcObject = null;
    dom.camera.style.display = 'none';
    if (!state.file) showUploadArea();
}
