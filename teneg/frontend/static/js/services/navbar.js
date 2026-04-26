/* Toggle `.scrolled` on the navbar once the page scrolls past a threshold. */
export function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const update = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}
