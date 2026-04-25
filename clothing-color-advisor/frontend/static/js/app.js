/**
 * ChromaSense AI — Frontend Application v13
 * Full-bleed editorial hero, luxury boutique design.
 */

const API_BASE = window.location.origin;

// ============================================
// NAVBAR — transparent → dark on scroll
// ============================================
(function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const update = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

// ============================================
// LANGUAGE SYSTEM
// ============================================
let currentLang = localStorage.getItem('chromasense_lang') || 'mn';

const LANG = {
  mn: {
    'nav.how': 'Хэрхэн ажилладаг',
    'nav.analyze': 'Шинжилгээ',
    'hero.eyebrow': 'AI • Өнгийн шинжилгээ',
    'hero.title1': 'Өөрт тохирох',
    'hero.title2': 'өнгөө олоорой',
    'hero.sub': 'Хиймэл оюун ухаанд суурилсан арьсны өнгөний шинжилгээ — танд хамгийн сайн зохицох хувцасны өнгийг тодорхойлно.',
    'hero.btn': 'Шинжилгээ эхлүүлэх',
    'hero.link': 'Хэрхэн ажилладаг вэ →',
    'spectrum.title': 'Арьсны өнгийн спектр',
    'spectrum.sub': 'Fitzpatrick хуваарь',
    'stats.seasons': 'Өнгийн улирал',
    'stats.features': 'Онцлог шинж',
    'stats.images': 'Сургалтын зураг',
    'stats.colors': 'Өнгийн мэдээлэл',
    'how.title': 'Хэрхэн ажилладаг вэ',
    'step1.title': 'Зураг оруулах',
    'step1.desc': 'Байгалийн гэрэлд авсан царайны тод зургийг оруулна уу.',
    'step2.title': 'AI шинжилгээ',
    'step2.desc': 'Манай AI компьютерийн алсын харааны технологи болон CIE LAB өнгөний шинжлэх ухаан ашиглан арьс, үс, нүдний өнгийг тодорхойлно.',
    'step3.title': 'Өнгийн палитр авах',
    'step3.desc': 'Хувцасны төрөл бүрийн өнгийн палитр, хослолын зөвлөмж, гоо сайхны өнгө болон загварын зөвлөгөөг хүлээн авна.',
    'seasons.title': '12 Өнгийн улирал',
    'seasons.sub': 'Таны арьс, үс, нүдний өнгийн хослол дөрвөн улирлын аль нэгэнд хамаарна — улирал бүр өөрийн гэсэн өнгийн санал болгодог.',
    'spring.name': 'Хавар',
    'spring.desc': 'Дулаан, тод, хөнгөн өнгүүд. Light Spring, Warm Spring, Clear Spring.',
    'summer.name': 'Зун',
    'summer.desc': 'Сэрүүн, зөөлөн, нам гүм өнгүүд. Light Summer, Cool Summer, Soft Summer.',
    'autumn.name': 'Намар',
    'autumn.desc': 'Дулаан, баялаг, нягт өнгүүд. Soft Autumn, Warm Autumn, Deep Autumn.',
    'winter.name': 'Өвөл',
    'winter.desc': 'Сэрүүн, тод, хурц ялгаатай өнгүүд. Cool Winter, Clear Winter, Deep Winter.',
    'analyze.title': 'Өнгийн шинжилгээ',
    'upload.title': 'Зураг оруулах',
    'upload.sub': 'Чирж оруулах эсвэл дарж сонгох',
    'upload.hint': 'JPEG, PNG эсвэл WebP',
    'camera.title': 'Камер ашиглах',
    'camera.sub': 'Вэбкамераар зураг авах',
    'camera.hint': 'Сайн гэрэлтэй байдлыг хангаарай',
    'or': 'эсвэл',
    'btn.clear': 'Зураг солих',
    'btn.analyze': 'Шинжлэх',
    'btn.close.camera': 'Болих',
    'btn.capture': 'Зураг авах',
    'btn.retry': 'Дахин оролдох',
    'btn.new': 'Шинэ шинжилгээ',
    'loading.title': 'Арьсны өнгийг шинжилж байна...',
    'loading.step': 'Царай илрүүлж байна...',
    'error.title': 'Шинжилгээ амжилтгүй болов',
    'results.title': 'Таны өнгийн профайл',
    'profile.title': 'Өнгийн профайл',
    'skin.label': 'Арьсны өнгө',
    'hair.label': 'Үсний өнгө',
    'eye.label': 'Нүдний өнгө',
    'detail.tone': 'Өнгийн нэр',
    'detail.fitz': 'Fitzpatrick',
    'detail.under': 'Дотоод өнгө',
    'detail.ita': 'ITA өнцөг',
    'season.title': 'Таны өнгийн улирал',
    'ml.title': 'ML загварын итгэлцэл',
    'clothes.title': 'Хувцасны төрлөөр',
    'tab.tops': 'Дээд хувцас',
    'tab.bottoms': 'Доод хувцас',
    'tab.dresses': 'Даашинз',
    'tab.outerwear': 'Гадуур хувцас',
    'tab.shoes': 'Гутал',
    'tab.accessories': 'Гоёл чимэглэл',
    'avoid.title': 'Зайлсхийх өнгүүд',
    'outfits.title': 'Хувцасны хослолууд',
    'tab.all': 'Бүгд',
    'tab.casual': 'Өдөр тутам',
    'tab.business': 'Ажлын',
    'tab.evening': 'Оройн',
    'tab.formal': 'Ёслолын',
    'makeup.title': 'Гоо сайхны өнгүүд',
    'makeup.lips': 'Уруул',
    'makeup.eyes': 'Нүд',
    'makeup.blush': 'Хацар',
    'makeup.nails': 'Хумс',
    'fabrics.title': 'Даавуу & Хээ угалз',
    'fabrics.sub': 'Тохиромжтой даавуунууд',
    'patterns.sub': 'Хамгийн тохиромжтой хээнүүд',
    'metals.title': 'Үнэт эдлэл & Металл',
    'metals.sub': 'Тохиромжтой металлууд',
    'tips.title': 'Загварын зөвлөгөө',
    'footer.text': 'Дипломын ажил: Хиймэл оюун ухаанд суурилсан хүний арьсны өнгө тодорхойлох, тохирох хувцасны өнгө санал болгох систем',
    'footer.copy': 'CIE LAB өнгийн шинжлэх ухаан, ITA өнцөг (Chardon et al., 1991), Fitzpatrick хуваарь болон 12 улирлын өнгийн шинжилгээний онолд суурилсан.',
    'nav.about': 'Системийн тухай',
    'trust.1': '89% нарийвчлал',
    'trust.2': '12 өнгийн улирал',
    'trust.3': 'Үнэгүй шинжилгээ',
    'float.season': 'Өнгийн улирал',
    'float.skin': 'Арьсны өнгө',
    'float.palette': 'Таны палитр',
    'float.palette.sub': 'Намрын өнгүүд',
    'float.ai': 'Шинжилгээ хийж байна...',
    'how.eyebrow': 'Энгийн 3 алхам',
    'how.sub': 'Зураг оруулаад хэдхэн секундын дотор өөрт тохирох өнгийн дүн шинжилгээгээ авна уу.',
    'step1.hint': 'JPEG · PNG · WebP · Камер',
    'step3.hint': 'Хувцас · Гоо сайхан · Үнэт эдлэл',
    'seasons.eyebrow': 'Өнгийн онол',
    'about.eyebrow': 'Судалгааны ажил',
    'about.title': 'Системийн тухай',
    'about.sub': 'Хиймэл оюун ухаанд суурилсан хүний арьсны өнгө тодорхойлох, тохирох хувцасны өнгө санал болгох системийн техникийн мэдээлэл.',
    'about.accuracy': 'Тестийн нарийвчлал',
    'about.dataset': 'Сургалтын зураг',
    'about.features': 'Онцлог шинж',
    'about.features.sub': 'Арьс + Үс + Нүд + Тодосгол',
    'about.classes': 'Ангиллын тоо',
    'about.classes.sub': 'Улирлын өнгийн систем',
    'about.split': 'Сургалт / Тест',
    'about.split.sub': 'Хуваалтын харьцаа',
    'about.pipeline': 'Системийн архитектур',
    'pipe.input': 'Зураг оруулах',
    'pipe.input.desc': 'JPEG/PNG/WebP',
    'pipe.detect': 'Царай илрүүлэх',
    'pipe.features': 'Онцлог гаргах',
    'pipe.ml': 'ML Ансамбль',
    'pipe.output': 'Палитр гаргах',
    'pipe.output.desc': '12 улирал',
    'about.feat.title': '42 Онцлог шинжийн бүлгүүд',
    'feat.skin': 'Арьсны өнгө',
    'feat.skin.sub': 'L*a*b*, ITA, RGB, HSV хэмжигдэхүүнүүд',
    'feat.hair': 'Үсний өнгө',
    'feat.hair.sub': 'Tone, saturation, darkness шинжүүд',
    'feat.eye': 'Нүдний өнгө',
    'feat.eye.sub': 'Iris hue, saturation, lightness',
    'feat.contrast': 'Тодосгол',
    'feat.contrast.sub': 'Арьс-үс-нүдний харьцаат ялгаа',
    'feat.total': 'Нийт онцлог:',
    'about.algo.title': 'ML Алгоритм',
    'algo.used': 'Ашигласан',
    'algo.acc': 'Нарийвчлал:',
    'algo.compare': 'Харьцуулалт',
    'about.data.title': 'Сургалтын датасет',
    'ds.desc': 'Нас, хүйс, угсаа гарвалаар тэмдэглэгдсэн нийт 20,000+ царайны зураг агуулдаг олон нийтийн датасет. Манай системд 4,967 зургийг ашигласан.',
    'ds.train': 'Сургалтын зураг',
    'ds.test': 'Тестийн зураг',
    'ds.classes': 'Ангилал',
    'ds.feats': 'Онцлог',
    'about.theory.title': 'Өнгийн шинжлэх ухааны суурь',
    'theory.lab': 'Хүний нүдний мэдрэхүйд суурилсан өнгийн орон зай. Арьсны өнгийг тодорхойлоход хамгийн найдвартай метрик.',
    'theory.ita': 'Individual Typology Angle — Chardon et al. (1991). L* ба b* утгуудаас гарган авдаг арьсны меланин агуулгын хэмжүүр.',
    'theory.fitz': 'Dermatologist Thomas Fitzpatrick (1975) арьсны 6 ангиллын хуваарь. Нарны хэт ягаан туяанд арьсны хариу үйлдлийг үнэлдэг.',
    'theory.season': 'Suzanne Caygill (1980) болон Carole Jackson "Color Me Beautiful" (1980) бүтээлд суурилсан улирлын өнгийн шинжилгээний систем.',
  },
  en: {
    'nav.how': 'How It Works',
    'nav.analyze': 'Analyze',
    'hero.eyebrow': 'AI • Color Analysis',
    'hero.title1': 'Discover Your',
    'hero.title2': 'Perfect Colors',
    'hero.sub': 'AI-powered skin tone analysis — determining the clothing colors that suit you best.',
    'hero.btn': 'Start Analysis',
    'hero.link': 'How it works →',
    'spectrum.title': 'Skin Tone Spectrum',
    'spectrum.sub': 'Fitzpatrick Scale',
    'stats.seasons': 'Color Seasons',
    'stats.features': 'Features',
    'stats.images': 'Training Images',
    'stats.colors': 'Color Sources',
    'how.title': 'How It Works',
    'step1.title': 'Upload Photo',
    'step1.desc': 'Upload a clear face photo taken in natural light.',
    'step2.title': 'AI Analysis',
    'step2.desc': 'Our AI uses computer vision and CIE LAB color science to analyze your skin, hair and eye color.',
    'step3.title': 'Get Your Palette',
    'step3.desc': 'Receive color palettes by clothing type, outfit combinations, makeup shades and personalized style tips.',
    'seasons.title': '12 Color Seasons',
    'seasons.sub': 'Your skin, hair, and eye color combination places you in one of four seasons — each with its own recommended palette.',
    'spring.name': 'Spring',
    'spring.desc': 'Warm, bright, light tones. Light Spring, Warm Spring, Clear Spring.',
    'summer.name': 'Summer',
    'summer.desc': 'Cool, soft, muted tones. Light Summer, Cool Summer, Soft Summer.',
    'autumn.name': 'Autumn',
    'autumn.desc': 'Warm, rich, deep tones. Soft Autumn, Warm Autumn, Deep Autumn.',
    'winter.name': 'Winter',
    'winter.desc': 'Cool, bright, high-contrast tones. Cool Winter, Clear Winter, Deep Winter.',
    'analyze.title': 'Color Analysis',
    'upload.title': 'Upload Photo',
    'upload.sub': 'Drag & drop or click to select',
    'upload.hint': 'JPEG, PNG or WebP',
    'camera.title': 'Use Camera',
    'camera.sub': 'Take a photo via webcam',
    'camera.hint': 'Ensure good lighting',
    'or': 'or',
    'btn.clear': 'Change Photo',
    'btn.analyze': 'Analyze',
    'btn.close.camera': 'Cancel',
    'btn.capture': 'Capture',
    'btn.retry': 'Try Again',
    'btn.new': 'New Analysis',
    'loading.title': 'Analyzing skin tone...',
    'loading.step': 'Detecting face...',
    'error.title': 'Analysis Failed',
    'results.title': 'Your Color Profile',
    'profile.title': 'Color Profile',
    'skin.label': 'Skin Tone',
    'hair.label': 'Hair Color',
    'eye.label': 'Eye Color',
    'detail.tone': 'Tone Name',
    'detail.fitz': 'Fitzpatrick',
    'detail.under': 'Undertone',
    'detail.ita': 'ITA Angle',
    'season.title': 'Your Color Season',
    'ml.title': 'ML Model Confidence',
    'clothes.title': 'By Clothing Type',
    'tab.tops': 'Tops',
    'tab.bottoms': 'Bottoms',
    'tab.dresses': 'Dresses',
    'tab.outerwear': 'Outerwear',
    'tab.shoes': 'Shoes',
    'tab.accessories': 'Accessories',
    'avoid.title': 'Colors to Avoid',
    'outfits.title': 'Outfit Combinations',
    'tab.all': 'All',
    'tab.casual': 'Casual',
    'tab.business': 'Business',
    'tab.evening': 'Evening',
    'tab.formal': 'Formal',
    'makeup.title': 'Makeup Colors',
    'makeup.lips': 'Lips',
    'makeup.eyes': 'Eyes',
    'makeup.blush': 'Blush',
    'makeup.nails': 'Nails',
    'fabrics.title': 'Fabrics & Patterns',
    'fabrics.sub': 'Recommended Fabrics',
    'patterns.sub': 'Best Patterns',
    'metals.title': 'Jewelry & Metals',
    'metals.sub': 'Recommended Metals',
    'tips.title': 'Style Tips',
    'footer.text': 'Thesis project: AI-based human skin color determination and clothing color recommendation system',
    'footer.copy': 'Based on CIE LAB color science, ITA angle (Chardon et al., 1991), Fitzpatrick scale and 12-season color analysis theory.',
    'nav.about': 'About System',
    'trust.1': '89% accuracy',
    'trust.2': '12 color seasons',
    'trust.3': 'Free analysis',
    'float.season': 'Color Season',
    'float.skin': 'Skin Tone',
    'float.palette': 'Your Palette',
    'float.palette.sub': 'Autumn tones',
    'float.ai': 'Analyzing...',
    'how.eyebrow': 'Simple 3 Steps',
    'how.sub': 'Upload a photo and get your personalized color profile in seconds.',
    'step1.hint': 'JPEG · PNG · WebP · Camera',
    'step3.hint': 'Clothing · Makeup · Jewelry',
    'seasons.eyebrow': 'Color Theory',
    'about.eyebrow': 'Research Project',
    'about.title': 'About the System',
    'about.sub': 'Technical details of the AI-based skin color determination and clothing color recommendation system.',
    'about.accuracy': 'Test Accuracy',
    'about.dataset': 'Training Images',
    'about.features': 'Features',
    'about.features.sub': 'Skin + Hair + Eye + Contrast',
    'about.classes': 'Classes',
    'about.classes.sub': 'Color season system',
    'about.split': 'Train / Test',
    'about.split.sub': 'Split ratio',
    'about.pipeline': 'System Architecture',
    'pipe.input': 'Input Image',
    'pipe.input.desc': 'JPEG/PNG/WebP',
    'pipe.detect': 'Face Detection',
    'pipe.features': 'Feature Extraction',
    'pipe.ml': 'ML Ensemble',
    'pipe.output': 'Palette Output',
    'pipe.output.desc': '12 seasons',
    'about.feat.title': '42 Feature Groups',
    'feat.skin': 'Skin Color',
    'feat.skin.sub': 'L*a*b*, ITA, RGB, HSV metrics',
    'feat.hair': 'Hair Color',
    'feat.hair.sub': 'Tone, saturation, darkness',
    'feat.eye': 'Eye Color',
    'feat.eye.sub': 'Iris hue, saturation, lightness',
    'feat.contrast': 'Contrast',
    'feat.contrast.sub': 'Relative skin-hair-eye differences',
    'feat.total': 'Total features:',
    'about.algo.title': 'ML Algorithm',
    'algo.used': 'In Use',
    'algo.acc': 'Accuracy:',
    'algo.compare': 'Comparison',
    'about.data.title': 'Training Dataset',
    'ds.desc': 'A public dataset containing 20,000+ face images labeled by age, gender and ethnicity. Our system used 4,967 processed images.',
    'ds.train': 'Training images',
    'ds.test': 'Test images',
    'ds.classes': 'Classes',
    'ds.feats': 'Features',
    'about.theory.title': 'Color Science Foundations',
    'theory.lab': 'A perceptually uniform color space. The most reliable metric for skin tone measurement.',
    'theory.ita': 'Individual Typology Angle — Chardon et al. (1991). Derived from L* and b* values to quantify melanin content.',
    'theory.fitz': 'Dermatologist Thomas Fitzpatrick\'s 6-category skin classification (1975), based on UV response.',
    'theory.season': 'Seasonal color analysis by Suzanne Caygill (1980) and Carole Jackson\'s "Color Me Beautiful" (1980).',
  }
};

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('chromasense_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (LANG[lang][key] !== undefined) el.textContent = LANG[lang][key];
    });
    // Update lang toggle active state
    document.querySelectorAll('.lang-opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });
    // Update html lang attribute
    document.documentElement.lang = lang === 'mn' ? 'mn' : 'en';
}

document.getElementById('langToggle').addEventListener('click', () => {
    applyLanguage(currentLang === 'mn' ? 'en' : 'mn');
});

// Apply on load
applyLanguage(currentLang);

// Load model info for about section
loadModelInfo();

// ============================================
// MODEL INFO (Diploma Section)
// ============================================
async function loadModelInfo() {
    try {
        const res = await fetch(`${API_BASE}/api/model-info`);
        if (!res.ok) return;
        const stats = await res.json();

        // Update accuracy display
        const pct = Math.round((stats.test_accuracy || 0.89) * 100);
        const accEl = document.getElementById('metricAccuracy');
        const algoAccEl = document.getElementById('algoAccVal');
        const ensembleEl = document.getElementById('ensembleAccVal');
        if (accEl) accEl.textContent = pct + '%';
        if (algoAccEl) algoAccEl.textContent = pct + '%';
        if (ensembleEl) ensembleEl.textContent = pct + '%';

        // Animate accuracy ring
        // Circle circumference = 2*π*32 ≈ 201; offset = 201 * (1 - pct/100)
        const circle = document.getElementById('accuracyCircle');
        if (circle) {
            const offset = 201 * (1 - pct / 100);
            setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
        }

        // Animate compare bar for ensemble
        const ensembleBar = document.querySelector('.accent-bar');
        if (ensembleBar) setTimeout(() => { ensembleBar.style.width = pct + '%'; }, 400);

        // Dataset numbers
        const datasetEl = document.getElementById('metricDataset');
        const dsTrainEl = document.getElementById('dsTrain');
        const dsTestEl  = document.getElementById('dsTest');
        if (datasetEl && stats.dataset_size) datasetEl.textContent = stats.dataset_size.toLocaleString();
        if (dsTrainEl && stats.train_size)   dsTrainEl.textContent = stats.train_size.toLocaleString();
        if (dsTestEl  && stats.test_size)    dsTestEl.textContent  = stats.test_size.toLocaleString();

    } catch (e) {
        // silently use hardcoded defaults already in HTML
    }
}

// ============================================
// DOM REFS
// ============================================
const uploadArea         = document.getElementById('uploadArea');
const fileUploadCard     = document.getElementById('fileUploadCard');
const cameraCard         = document.getElementById('cameraCard');
const fileInput          = document.getElementById('fileInput');
const previewContainer   = document.getElementById('previewContainer');
const previewImage       = document.getElementById('previewImage');
const cameraContainer    = document.getElementById('cameraContainer');
const cameraVideo        = document.getElementById('cameraVideo');
const cameraCanvas       = document.getElementById('cameraCanvas');
const loadingContainer   = document.getElementById('loadingContainer');
const loadingStep        = document.getElementById('loadingStep');
const errorContainer     = document.getElementById('errorContainer');
const errorMessage       = document.getElementById('errorMessage');
const resultsSection     = document.getElementById('results');

let currentFile    = null;
let cameraStream   = null;
let currentClothing = {};
let currentOutfits  = [];

// ============================================
// TRANSLATION MAPS
// ============================================
const SEASON_ICONS = { Spring: '🌸', Summer: '☀️', Autumn: '🍂', Winter: '❄️' };

const SEASON_MN = {
    'Light Spring': 'Хөнгөн хавар',  'Warm Spring': 'Дулаан хавар',  'Clear Spring': 'Тод хавар',
    'Light Summer': 'Хөнгөн зун',    'Cool Summer': 'Сэрүүн зун',     'Soft Summer': 'Зөөлөн зун',
    'Soft Autumn':  'Зөөлөн намар',  'Warm Autumn': 'Дулаан намар',   'Deep Autumn': 'Гүн намар',
    'Deep Winter':  'Гүн өвөл',      'Cool Winter': 'Сэрүүн өвөл',   'Clear Winter': 'Тод өвөл',
    'Spring': 'Хавар', 'Summer': 'Зун', 'Autumn': 'Намар', 'Winter': 'Өвөл',
};
const SEASON_EN = {
    'Light Spring': 'Light Spring', 'Warm Spring': 'Warm Spring', 'Clear Spring': 'Clear Spring',
    'Light Summer': 'Light Summer', 'Cool Summer': 'Cool Summer', 'Soft Summer': 'Soft Summer',
    'Soft Autumn':  'Soft Autumn',  'Warm Autumn': 'Warm Autumn', 'Deep Autumn': 'Deep Autumn',
    'Deep Winter':  'Deep Winter',  'Cool Winter': 'Cool Winter', 'Clear Winter': 'Clear Winter',
    'Spring': 'Spring', 'Summer': 'Summer', 'Autumn': 'Autumn', 'Winter': 'Winter',
};

const UNDERTONE_MN = { warm: 'Дулаан', cool: 'Сэрүүн', neutral: 'Саармаг' };
const UNDERTONE_EN = { warm: 'Warm',   cool: 'Cool',    neutral: 'Neutral' };

const FITZPATRICK_MN = {
    'I': 'I — Маш цайвар', 'II': 'II — Цайвар',
    'III': 'III — Дунд зэрэг', 'IV': 'IV — Хүрэн шаргал',
    'V': 'V — Бор', 'VI': 'VI — Хар бор',
};
const FITZPATRICK_EN = {
    'I': 'I — Very Fair', 'II': 'II — Fair',
    'III': 'III — Medium', 'IV': 'IV — Olive',
    'V': 'V — Brown', 'VI': 'VI — Dark Brown',
};

const OCCASION_MN = { casual: 'Өдөр тутам', business: 'Ажлын', evening: 'Оройн', formal: 'Ёслолын' };
const OCCASION_EN = { casual: 'Casual',      business: 'Business', evening: 'Evening', formal: 'Formal' };

/* Mongolian season descriptions */
const SEASON_DETAILS_MN = {
    'Light Spring':  { desc: 'Таны нүд, үс, арьсны өнгө хөнгөн дулаан шинж чанартай. Цайвар, гэрэлт өнгүүд танд хамгийн тохиромжтой.', chars: 'Персик, лимон шар, хаврын ногоон, цагаан, зефир ягаан өнгүүдийг ашиглаарай.' },
    'Warm Spring':   { desc: 'Таны өнгийн хослол илт дулаан, алтлаг шинж чанартай. Зэс, хүрэн алт өнгүүд таны гоо сайхныг онцолно.', chars: 'Зэс, намрын улбар шар, заримдаа хаврын ногоон болон персик өнгүүдийг сонгоорой.' },
    'Clear Spring':  { desc: 'Таны нүд болон арьсны өнгийн ялгаа тод, гэрэлт. Тод дулаан өнгүүд таны царайг гэрэлтүүлнэ.', chars: 'Тод улаан, шар, хаврын ногоон, цайвар цэнхэр — тод ялгааг ашиглаарай.' },
    'Light Summer':  { desc: 'Таны өнгийн хослол зөөлөн, сэрүүн, хөнгөн шинж чанартай. Цайвар нам гүм өнгүүд танд маш зохицно.', chars: 'Нилуфар ягаан, цайвар цэнхэр, зөөлөн саарал, цагаан өнгүүдийг сонгоорой.' },
    'Cool Summer':   { desc: 'Таны арьсны өнгө сэрүүн дотоод өнгөтэй. Цэнхэр-ягаан гэр бүлийн өнгүүд таны гоо сайхныг харуулна.', chars: 'Бургунди, нилуфар ягаан, цэнхэр, саарал ногоон — сэрүүн тонусын өнгүүд.' },
    'Soft Summer':   { desc: 'Таны өнгийн хослол нам гүм, зөөлөн. Хурц биш, зөөлөн сэрүүн өнгүүд хамгийн зохимжтой.', chars: 'Утаатай ягаан, зөөлөн цэнхэр, буурцаг ногоон, саарал өнгүүд — хурцалхгүй байгаарай.' },
    'Soft Autumn':   { desc: 'Таны өнгийн хослол зөөлөн дулаан, нам гүм шинж чанартай. Дулаан намрын өнгүүд танд зохицно.', chars: 'Зөөлөн хүрэн, намрын улбар, бор ногоон, шар хүрэн өнгүүдийг ашиглаарай.' },
    'Warm Autumn':   { desc: 'Таны нүд, үс, арьсны өнгийн хослол дулаан, баялаг, гүн шинж чанартай. Намрын дулаан тонус танд хамгийн тохирно.', chars: 'Зэс, улбар шар, хар хүрэн, бор ногоон — дулаан баялаг өнгүүд.' },
    'Deep Autumn':   { desc: 'Таны өнгийн хослол гүн, баялаг, хуурай дулаан шинж чанартай. Гүн намрын өнгүүд таны гоо сайхныг онцолно.', chars: 'Хар хүрэн, гүн улбар, хар ногоон, гүн зэс — баялаг гүн өнгүүд.' },
    'Deep Winter':   { desc: 'Таны нүд, үс, арьсны ялгаа маш тод, хурц. Гүн сэрүүн өнгүүд танд хамгийн тохиромжтой.', chars: 'Хар, цагаан, гүн бургунди, хар хөх — тод ялгаатай өнгүүдийг сонгоорой.' },
    'Cool Winter':   { desc: 'Таны өнгийн хослол сэрүүн, тод шинж чанартай. Цэвэр цэнхэр-улаан гэр бүлийн өнгүүд танд тохирно.', chars: 'Хар, цагаан, хар хөх, хурц ягаан, цэнхэр — сэрүүн тод өнгүүд.' },
    'Clear Winter':  { desc: 'Таны нүдний өнгө болон арьсны ялгаа маш тод, хурц. Тод сэрүүн өнгүүд таны дотоод гялбааг харуулна.', chars: 'Цагаан, хар, тод ягаан, хурц хөх, цэнхэр — тод ялгааг ашиглаарай.' },
};

const UNDERTONE_DESC_MN = {
    warm:    'Дулаан дотоод өнгө нь алт, зэс, зэрлэг улаан сүүдэртэй өнгүүдэд сайн зохицдог. Алтан үнэт эдлэл, дулаан хүрэн өнгүүд таны арьсыг гялалзуулна.',
    cool:    'Сэрүүн дотоод өнгө нь мөнгө, нилуфар ягаан, цэнхэр сүүдэртэй өнгүүдэд сайн зохицдог. Мөнгөн үнэт эдлэл, сэрүүн хэрчмийн өнгүүд танд тохирно.',
    neutral: 'Саармаг дотоод өнгө нь дулаан болон сэрүүн аль аль өнгүүдтэй зохицдог. Та хамгийн их уян хатан хувцасны өнгийн сонголттой хүн.',
};

/* Utility: derive Mongolian/English color name from hex */
function getColorNameMN(type, hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const max = Math.max(r,g,b)/255, min = Math.min(r,g,b)/255;
    const l = (max+min)/2;
    const mn = currentLang === 'mn';

    if (type === 'skin') {
        if (l > 0.75) return mn ? 'Маш цайвар' : 'Very Fair';
        if (l > 0.65) return mn ? 'Цайвар' : 'Fair';
        if (l > 0.55) return mn ? 'Дунд зэрэг' : 'Medium';
        if (l > 0.45) return mn ? 'Дулаан хүрэн' : 'Warm Tan';
        if (l > 0.32) return mn ? 'Хүрэн' : 'Brown';
        if (l > 0.18) return mn ? 'Гүн хүрэн' : 'Deep Brown';
        return mn ? 'Хар бор' : 'Ebony';
    }
    if (type === 'hair') {
        if (l > 0.72) return mn ? 'Цайвар шаргал' : 'Blonde';
        if (l > 0.55) return mn ? 'Дунд шаргал' : 'Light Brown';
        if (l > 0.38) return mn ? 'Хүрэн' : 'Brown';
        if (l > 0.22) return mn ? 'Хар хүрэн' : 'Dark Brown';
        return mn ? 'Хар' : 'Black';
    }
    if (type === 'eye') {
        const d = max - min;
        let h = 0;
        if (d > 0) {
            if (max===r/255) h=((g-b)/(255*d))%6;
            else if (max===g/255) h=(b-r)/(255*d)+2;
            else h=(r-g)/(255*d)+4;
            h=h*60; if(h<0)h+=360;
        }
        if (l < 0.22) return mn ? 'Хар хүрэн' : 'Dark Brown';
        if (h>=200&&h<265&&l>0.28) return mn ? 'Цэнхэр' : 'Blue';
        if (h>=90&&h<185&&l>0.22) return mn ? 'Ногоон' : 'Green';
        if (h>=30&&h<90&&l>0.35) return mn ? 'Саарал ногоон' : 'Hazel';
        if (r>b&&r>g*0.8) return mn ? 'Хүрэн' : 'Brown';
        if (l>0.5) return mn ? 'Саарал' : 'Grey';
        return mn ? 'Хар хүрэн' : 'Dark Brown';
    }
    return '';
}

const LOADING_STEPS_MN = [
    'Царай илрүүлж байна...', 'Арьсны өнгийг гаргаж байна...', 'Дотоод өнгийг шинжилж байна...',
    'Арьсны өнгийг ангилж байна...', 'Өнгийн улирлыг тодорхойлж байна...',
    'Хувцасны өнгийн зөвлөмж боловсруулж байна...', 'Хувцасны хослолуудыг үүсгэж байна...'
];
const LOADING_STEPS_EN = [
    'Detecting face...', 'Extracting skin color...', 'Analyzing undertone...',
    'Classifying skin tone...', 'Determining color season...',
    'Generating clothing recommendations...', 'Building outfit combinations...'
];

// ============================================
// EVENT LISTENERS
// ============================================
fileUploadCard.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) handleFile(e.target.files[0]); });
fileUploadCard.addEventListener('dragover',  (e) => { e.preventDefault(); fileUploadCard.classList.add('dragover'); });
fileUploadCard.addEventListener('dragleave', () => fileUploadCard.classList.remove('dragover'));
fileUploadCard.addEventListener('drop', (e) => {
    e.preventDefault(); fileUploadCard.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});
cameraCard.addEventListener('click', openCamera);
document.getElementById('captureBtn').addEventListener('click', capturePhoto);
document.getElementById('closeCameraBtn').addEventListener('click', closeCamera);
document.getElementById('clearBtn').addEventListener('click', clearPreview);
document.getElementById('analyzeBtn').addEventListener('click', analyzeImage);
document.getElementById('retryBtn').addEventListener('click', () => { errorContainer.style.display = 'none'; showUploadArea(); });
document.getElementById('newAnalysisBtn').addEventListener('click', () => {
    resultsSection.style.display = 'none'; clearPreview(); showUploadArea();
    document.getElementById('analyze').scrollIntoView({ behavior: 'smooth' });
});

// Clothing tabs
document.getElementById('clothingTabs').addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
        document.querySelectorAll('#clothingTabs .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderClothingType(e.target.dataset.tab);
    }
});

// Outfit tabs
document.getElementById('outfitTabs').addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
        document.querySelectorAll('#outfitTabs .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        filterOutfits(e.target.dataset.tab);
    }
});

// ============================================
// FILE HANDLING
// ============================================
function handleFile(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showError(t('error.title'), currentLang === 'mn' ? 'JPEG, PNG эсвэл WebP зураг оруулна уу.' : 'Please upload a JPEG, PNG or WebP image.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showError(t('error.title'), currentLang === 'mn' ? 'Зураг хэт том байна. Хамгийн ихдээ 10MB байна.' : 'Image too large. Maximum 10MB.');
        return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { previewImage.src = e.target.result; showPreview(); };
    reader.readAsDataURL(file);
}

function showPreview() {
    document.querySelector('.upload-methods').style.display = 'none';
    cameraContainer.style.display = 'none';
    previewContainer.style.display = 'block';
}
function clearPreview() {
    currentFile = null; previewImage.src = ''; previewContainer.style.display = 'none';
    fileInput.value = ''; showUploadArea();
}
function showUploadArea() {
    document.querySelector('.upload-methods').style.display = 'flex';
    loadingContainer.style.display = 'none'; errorContainer.style.display = 'none';
}

// ============================================
// CAMERA
// ============================================
async function openCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } });
        cameraVideo.srcObject = cameraStream;
        document.querySelector('.upload-methods').style.display = 'none';
        cameraContainer.style.display = 'block';
    } catch (err) {
        showError(t('error.title'), currentLang === 'mn' ? 'Камерт нэвтрэх боломжгүй байна. Зөвшөөрлийг шалгаарай.' : 'Camera access denied. Please check permissions.');
    }
}
function capturePhoto() {
    const canvas = cameraCanvas;
    canvas.width  = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, 0, 0);
    previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
    closeCamera(); currentFile = 'webcam'; showPreview();
}
function closeCamera() {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
    cameraVideo.srcObject = null; cameraContainer.style.display = 'none';
    if (!currentFile) showUploadArea();
}

// ============================================
// API
// ============================================
async function analyzeImage() {
    previewContainer.style.display = 'none';
    loadingContainer.style.display = 'block';

    const steps = currentLang === 'mn' ? LOADING_STEPS_MN : LOADING_STEPS_EN;
    let stepIndex = 0;
    loadingStep.textContent = steps[0];
    const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) loadingStep.textContent = steps[stepIndex];
    }, 500);

    try {
        let response;
        if (currentFile === 'webcam') {
            response = await fetch(`${API_BASE}/api/analyze-base64`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: previewImage.src })
            });
        } else {
            const formData = new FormData(); formData.append('file', currentFile);
            response = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: formData });
        }
        clearInterval(stepInterval);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || t('error.title'));
        loadingContainer.style.display = 'none';
        displayResults(data);
    } catch (err) {
        clearInterval(stepInterval);
        loadingContainer.style.display = 'none';
        showError(t('error.title'), err.message);
    }
}

function showError(title, message) {
    document.querySelector('.upload-methods').style.display = 'none';
    previewContainer.style.display = 'none';
    loadingContainer.style.display = 'none';
    document.getElementById('errorTitle').textContent = title;
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
}

// ============================================
// RESULTS RENDERING
// ============================================
function displayResults(data) {
    const { classification, recommendations } = data;

    // ── Analyzed photo ──
    const photoWrap = document.getElementById('analyzedPhotoWrap');
    const analyzedPhoto = document.getElementById('analyzedPhoto');
    if (photoWrap && analyzedPhoto && previewImage.src) {
        analyzedPhoto.src = previewImage.src;
        photoWrap.style.display = 'block';
        // Remove old badge if exists
        const oldBadge = photoWrap.querySelector('.photo-badge');
        if (oldBadge) oldBadge.remove();
        const badge = document.createElement('div');
        badge.className = 'photo-badge';
        badge.textContent = currentLang === 'mn' ? '✓ Шинжилгээ дууслаа' : '✓ Analysis Complete';
        photoWrap.appendChild(badge);
    }

    // ── Skin orb ──
    const skinHex = classification.skin_color.hex;
    const skinOrb = document.getElementById('skinOrb');
    if (skinOrb) skinOrb.style.background = skinHex;
    document.getElementById('skinHex').textContent = skinHex.toUpperCase();
    document.getElementById('skinColorName').textContent = getColorNameMN('skin', skinHex);

    // ── Hair orb ──
    const hairRgb = data.detection && data.detection.hair_rgb;
    let hairHex = '#2C1810';
    if (hairRgb && (hairRgb[0] || hairRgb[1] || hairRgb[2])) hairHex = rgbToHex(hairRgb);
    const hairOrb = document.getElementById('hairOrb');
    if (hairOrb) hairOrb.style.background = hairHex;
    document.getElementById('hairHex').textContent = hairHex.toUpperCase();
    document.getElementById('hairColorName').textContent = getColorNameMN('hair', hairHex);

    // ── Eye orb (iris) ──
    const eyeRgb = data.detection && data.detection.eye_rgb;
    let eyeHex = '#6B4226';
    if (eyeRgb && (eyeRgb[0] || eyeRgb[1] || eyeRgb[2])) eyeHex = rgbToHex(eyeRgb);
    // Support both old div-based and new SVG-based eye orb
    const irisBg = document.getElementById('irisBg');
    if (irisBg) irisBg.style.background = eyeHex;
    const eyeIrisSvg = document.getElementById('eyeIrisSvg');
    if (eyeIrisSvg) eyeIrisSvg.setAttribute('fill', eyeHex);
    document.getElementById('eyeHex').textContent = eyeHex.toUpperCase();
    document.getElementById('eyeColorName').textContent = getColorNameMN('eye', eyeHex);

    // ── Profile details ──
    document.getElementById('toneName').textContent = classification.tone_name;
    document.getElementById('fitzpatrickType').textContent =
        (currentLang === 'mn' ? FITZPATRICK_MN : FITZPATRICK_EN)[classification.fitzpatrick.type]
        || `${classification.fitzpatrick.type} — ${classification.fitzpatrick.label}`;
    document.getElementById('undertoneType').textContent =
        (currentLang === 'mn' ? UNDERTONE_MN : UNDERTONE_EN)[classification.undertone.type]
        || classification.undertone.type;
    document.getElementById('itaAngle').textContent = `${classification.ita_angle}°`;
    // Mongolian descriptions
    if (currentLang === 'mn') {
        const skinType = classification.undertone.type;
        document.getElementById('toneDescription').textContent =
            `${getColorNameMN('skin', skinHex)} арьстай таны нүүр ${UNDERTONE_MN[skinType]||skinType} дотоод өнгөтэй.`;
        document.getElementById('undertoneDescription').textContent =
            UNDERTONE_DESC_MN[skinType] || classification.undertone.description || '';
    } else {
        document.getElementById('toneDescription').textContent = classification.tone_description || '';
        document.getElementById('undertoneDescription').textContent = classification.undertone.description || '';
    }

    // ── Why this color works ──
    try { populateWhyColorSection(classification, data.ml_prediction); } catch(e){}

    // ── Season hero badge ──
    const season = classification.season;
    const primary = season.primary;
    const subSeason = season.sub_season;
    const seasonBadge = document.getElementById('seasonBadge');

    const seasonGradients = {
        Spring: 'linear-gradient(135deg, #F9A03C, #E8623A, #F2C46D)',
        Summer: 'linear-gradient(135deg, #6B93C8, #A07DC0, #8AABD4)',
        Autumn: 'linear-gradient(135deg, #C07028, #8B4513, #D4A017)',
        Winter: 'linear-gradient(135deg, #2A5298, #6B1A8A, #8C9DB5)',
    };
    seasonBadge.style.background = seasonGradients[primary] || 'linear-gradient(135deg, var(--accent), var(--accent-dk))';

    document.getElementById('seasonEmoji').textContent = SEASON_ICONS[primary] || '✨';
    document.getElementById('seasonName').textContent   = (currentLang === 'mn' ? SEASON_MN : SEASON_EN)[subSeason] || subSeason;
    document.getElementById('seasonEnName').textContent  = subSeason;
    // Mongolian season descriptions
    const detailsMN = SEASON_DETAILS_MN[subSeason];
    if (currentLang === 'mn' && detailsMN) {
        document.getElementById('seasonDescription').textContent     = detailsMN.desc;
        document.getElementById('seasonCharacteristics').textContent = detailsMN.chars;
    } else {
        document.getElementById('seasonDescription').textContent     = season.description;
        document.getElementById('seasonCharacteristics').textContent = season.characteristics;
    }

    // ── Season palette chips (first 6 recommended tops colors) ──
    const seasonPaletteEl = document.getElementById('seasonPalette');
    if (seasonPaletteEl) {
        const tops = (recommendations.clothing.tops || []).slice(0, 7);
        seasonPaletteEl.innerHTML = tops.map(c =>
            `<div class="sp-chip" style="background:${c.hex}" title="${c.name}"></div>`
        ).join('');
    }

    // ── ML Confidence ──
    const mlPrediction = data.ml_prediction;
    if (mlPrediction && mlPrediction.top_matches) {
        const mlDiv  = document.getElementById('mlConfidence');
        const barsDiv = document.getElementById('confidenceBars');
        barsDiv.innerHTML = '';
        mlPrediction.top_matches.forEach(match => {
            const bar = document.createElement('div');
            bar.className = 'confidence-row';
            const label = (currentLang === 'mn' ? SEASON_MN : SEASON_EN)[match.season] || match.season;
            bar.innerHTML = `
                <span class="conf-label">${label}</span>
                <div class="conf-bar-bg"><div class="conf-bar-fill" style="width:${match.confidence}%"></div></div>
                <span class="conf-value">${match.confidence}%</span>`;
            barsDiv.appendChild(bar);
        });
        mlDiv.style.display = 'block';
    }

    // ── Clothing ──
    currentClothing = recommendations.clothing || {};
    document.querySelectorAll('#clothingTabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelector('#clothingTabs .tab[data-tab="tops"]').classList.add('active');
    renderClothingType('tops');

    // ── Avoid tiles ──
    const avoidGrid = document.getElementById('avoidGrid');
    avoidGrid.innerHTML = '<div class="avoid-tiles" id="avoidTiles"></div>';
    const avoidTiles = document.getElementById('avoidTiles');
    recommendations.avoid.forEach(color => {
        const el = document.createElement('div');
        el.className = 'avoid-tile';
        el.title = color.reason || color.name;
        el.innerHTML = `
            <div class="avoid-tile-bg" style="background:${color.hex}"></div>
            <div class="avoid-tile-x">✕</div>
            <div class="avoid-tile-name">${color.name}</div>`;
        avoidTiles.appendChild(el);
    });

    // ── Outfits ──
    currentOutfits = recommendations.outfits || [];
    document.querySelectorAll('#outfitTabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelector('#outfitTabs .tab[data-tab="all"]').classList.add('active');
    renderOutfits(currentOutfits);

    // ── Makeup ──
    renderMakeup(recommendations.makeup || {});

    // ── Jewelry showcase ──
    renderJewelry(recommendations.metals || []);

    // ── Fabrics / Patterns ──
    renderTags('fabricTags',  recommendations.fabrics  || []);
    renderTags('patternTags', recommendations.patterns || []);

    // ── Tips ──
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = '';
    (recommendations.tips || []).forEach(tip => {
        const li = document.createElement('li'); li.textContent = tip; tipsList.appendChild(li);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    // Re-apply language so newly visible data-i18n elements get translated
    applyLanguage(currentLang);
}

// ── Clothing SVG silhouettes ──
const CLOTHING_SVG = {
    tops: (c) => `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="tG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.78"/>
            </linearGradient>
        </defs>
        <!-- Shirt body -->
        <path d="M10,18 L0,36 L14,40 L14,82 L66,82 L66,40 L80,36 L70,18 L54,28 Q40,34 26,28 Z" fill="url(#tG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Collar -->
        <path d="M26,28 Q34,38 40,36 Q46,38 54,28 Q48,22 40,24 Q32,22 26,28Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <!-- Highlight -->
        <path d="M14,40 L14,82" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
        <path d="M16,28 Q22,50 20,75" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    bottoms: (c) => `<svg viewBox="0 0 76 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bG${c.replace('#','')}" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <!-- Waistband -->
        <rect x="4" y="4" width="68" height="12" rx="4" fill="${c}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
        <!-- Left leg -->
        <path d="M4,16 L4,92 Q16,96 26,92 L38,52 L38,16 Z" fill="url(#bG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <!-- Right leg -->
        <path d="M72,16 L72,92 Q60,96 50,92 L38,52 L38,16 Z" fill="url(#bG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <!-- Center seam -->
        <line x1="38" y1="16" x2="38" y2="52" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Highlight -->
        <path d="M8,20 Q10,55 12,88" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    dresses: (c) => `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="dG${c.replace('#','')}" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.82"/>
            </linearGradient>
        </defs>
        <!-- Bodice -->
        <path d="M22,8 L8,28 L18,32 L18,54 L62,54 L62,32 L72,28 L58,8 Q46,16 40,14 Q34,16 22,8Z" fill="url(#dG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Skirt flare -->
        <path d="M18,54 L4,106 L76,106 L62,54 Z" fill="url(#dG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <!-- Neckline -->
        <path d="M28,10 Q34,20 40,18 Q46,20 52,10" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <!-- Waist seam -->
        <line x1="18" y1="54" x2="62" y2="54" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Highlight -->
        <path d="M20,30 Q22,58 14,100" stroke="rgba(255,255,255,0.15)" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    outerwear: (c) => `<svg viewBox="0 0 88 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="oG${c.replace('#','')}" x1="0" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <!-- Coat body -->
        <path d="M12,20 L0,44 L16,48 L16,92 L72,92 L72,48 L88,44 L76,20 L58,30 Q44,38 30,30 Z" fill="url(#oG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Lapels left -->
        <path d="M30,30 L28,50 L44,44 L44,20 Q38,24 30,30Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <!-- Lapels right -->
        <path d="M58,30 L60,50 L44,44 L44,20 Q50,24 58,30Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <!-- Button line -->
        <line x1="44" y1="50" x2="44" y2="90" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="2 4"/>
        <!-- Highlight -->
        <path d="M16,50 Q18,68 18,88" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    shoes: (c) => `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.82"/>
            </linearGradient>
        </defs>
        <!-- Heel -->
        <rect x="62" y="36" width="10" height="18" rx="2" fill="${c}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
        <!-- Sole -->
        <path d="M4,50 Q44,56 72,54 L72,54 L62,54 L62,54 Q58,56 4,54 Z" fill="rgba(0,0,0,0.22)" rx="3"/>
        <!-- Shoe body -->
        <path d="M4,48 Q8,28 28,24 Q48,20 62,28 L72,36 L62,36 Q50,32 34,34 Q16,36 12,48 Z" fill="url(#sG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Toe cap sheen -->
        <path d="M8,42 Q18,30 32,28" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    accessories: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="aG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <!-- Bag body -->
        <rect x="8" y="28" width="64" height="46" rx="6" fill="url(#aG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Bag flap -->
        <path d="M8,28 Q8,18 40,16 Q72,18 72,28 L72,44 Q56,38 40,38 Q24,38 8,44 Z" fill="${c}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <!-- Handle -->
        <path d="M24,28 Q24,10 40,8 Q56,10 56,28" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
        <path d="M24,28 Q24,10 40,8 Q56,10 56,28" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="4" stroke-linecap="round"/>
        <!-- Clasp -->
        <rect x="34" y="38" width="12" height="8" rx="3" fill="rgba(255,255,255,0.35)" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <!-- Highlight -->
        <path d="M12,32 Q14,52 14,68" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
};

function renderClothingType(type) {
    const grid = document.getElementById('clothingGrid');
    grid.innerHTML = '';
    const svgFn = CLOTHING_SVG[type] || CLOTHING_SVG.tops;
    (currentClothing[type] || []).forEach((color, index) => {
        const el = document.createElement('div');
        el.className = 'color-swatch clothing-swatch';
        el.style.animationDelay = `${index * 0.05}s`;
        el.innerHTML = `
            <div class="clothing-silhouette">${svgFn(color.hex)}</div>
            <div class="swatch-name">${color.name}</div>
            <div class="swatch-hex">${color.hex}</div>`;
        el.addEventListener('click', () => copyColor(color.hex));
        grid.appendChild(el);
    });
}

function renderOutfits(outfits) {
    const grid = document.getElementById('outfitsGrid');
    grid.innerHTML = '';
    outfits.forEach(outfit => {
        const el = document.createElement('div');
        el.className = 'outfit-card';
        el.dataset.occasion = outfit.occasion || '';
        const occLabel = currentLang === 'mn'
            ? (OCCASION_MN[outfit.occasion] || outfit.occasion || '')
            : (OCCASION_EN[outfit.occasion] || outfit.occasion || '');
        el.innerHTML = `
            <div class="outfit-header">
                <div class="outfit-name">${outfit.name}</div>
                <span class="outfit-occasion">${occLabel}</span>
            </div>
            <div class="outfit-colors">${outfit.colors.map(c => `<div class="outfit-color-circle" style="background:${c}" title="${c}"></div>`).join('')}</div>
            <ul class="outfit-pieces">${outfit.pieces.map(p => `<li>${p}</li>`).join('')}</ul>
            <div class="outfit-color-bar">${outfit.colors.map(c => `<div class="outfit-color-bar-seg" style="background:${c}"></div>`).join('')}</div>`;
        grid.appendChild(el);
    });
}

function filterOutfits(occasion) {
    renderOutfits(occasion === 'all' ? currentOutfits : currentOutfits.filter(o => o.occasion === occasion));
}

function renderMakeup(makeup) {
    renderMakeupPanel('makeupLips',  makeup.lips  || [], 'lips');
    renderMakeupPanel('makeupEyes',  makeup.eyes  || [], 'eyes');
    renderMakeupPanel('makeupBlush', makeup.blush || [], 'blush');
    renderMakeupPanel('makeupNails', makeup.nails || [], 'nails');
}

function renderMakeupPanel(containerId, colors, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!colors.length) return;

    const firstColor = colors[0][0];

    // Feature visual
    const feat = document.createElement('div');
    feat.className = 'makeup-feat-wrap';

    if (type === 'lips') {
        // Realistic 3D lips with cupid's bow, sheen, shadow
        feat.innerHTML = `
        <svg class="lips-feat-svg" viewBox="0 0 120 68" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="lipGrad" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="${firstColor}" stop-opacity="1"/>
                    <stop offset="100%" stop-color="${firstColor}" stop-opacity="0.75"/>
                </radialGradient>
                <filter id="lipBlur"><feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/></filter>
            </defs>
            <!-- Lower lip -->
            <path d="M10,34 Q30,54 60,56 Q90,54 110,34 Q90,42 60,43 Q30,42 10,34Z" fill="url(#lipGrad)"/>
            <!-- Upper lip -->
            <path d="M10,34 Q24,18 40,24 Q50,14 60,24 Q70,14 80,24 Q96,18 110,34 Q90,30 60,31 Q30,30 10,34Z" fill="url(#lipGrad)"/>
            <!-- Cupid's bow highlight -->
            <path d="M40,24 Q50,14 60,24 Q70,14 80,24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Upper lip sheen -->
            <ellipse cx="44" cy="28" rx="10" ry="3.5" fill="rgba(255,255,255,0.22)" transform="rotate(-12 44 28)"/>
            <!-- Lower lip sheen -->
            <ellipse cx="60" cy="46" rx="16" ry="5" fill="rgba(255,255,255,0.25)"/>
            <!-- Lip line center -->
            <path d="M10,34 Q60,32 110,34" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" fill="none"/>
            <!-- Corner shadows -->
            <circle cx="10" cy="34" r="3" fill="rgba(0,0,0,0.12)"/>
            <circle cx="110" cy="34" r="3" fill="rgba(0,0,0,0.12)"/>
        </svg>`;
    } else if (type === 'eyes') {
        // Realistic closed eye with eyeshadow
        const shadowColor = firstColor;
        feat.innerHTML = `
        <svg class="eye-feat-svg" viewBox="0 0 120 75" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="shadowGrad${feat.id||'e'}" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stop-color="${shadowColor}" stop-opacity="0.75"/>
                    <stop offset="70%" stop-color="${shadowColor}" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="${shadowColor}" stop-opacity="0"/>
                </radialGradient>
                <clipPath id="eyeClip">
                    <path d="M12,42 Q36,18 60,18 Q84,18 108,42 Q84,62 60,62 Q36,62 12,42Z"/>
                </clipPath>
            </defs>
            <!-- Eyeshadow area (above eye) -->
            <ellipse cx="60" cy="35" rx="52" ry="22" fill="url(#shadowGrad${feat.id||'e'})"/>
            <!-- Sclera (white of eye) -->
            <path d="M12,42 Q36,22 60,22 Q84,22 108,42 Q84,60 60,60 Q36,60 12,42Z" fill="white"/>
            <!-- Iris -->
            <circle cx="60" cy="42" r="16" fill="#6B4226"/>
            <circle cx="60" cy="42" r="16" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
            <!-- Pupil -->
            <circle cx="60" cy="42" r="8.5" fill="#0d0808"/>
            <!-- Iris radial texture -->
            <circle cx="60" cy="42" r="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <!-- Corneal reflection -->
            <circle cx="67" cy="35" r="5" fill="rgba(255,255,255,0.72)"/>
            <circle cx="65" cy="39" r="2" fill="rgba(255,255,255,0.3)"/>
            <!-- Top eyelid -->
            <path d="M12,42 Q36,22 60,22 Q84,22 108,42" stroke="#1a0808" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <!-- Eyelashes top -->
            <path d="M14,40 L9,32" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M22,30 L18,22" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M33,23 L30,14" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M46,19 L44,10" stroke="#1a0808" stroke-width="2" stroke-linecap="round"/>
            <path d="M60,18 L60,9" stroke="#1a0808" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M74,19 L76,10" stroke="#1a0808" stroke-width="2" stroke-linecap="round"/>
            <path d="M87,23 L90,14" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M98,30 L102,22" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M106,40 L111,32" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
            <!-- Bottom lash line -->
            <path d="M14,44 Q36,58 60,59 Q84,58 106,44" stroke="rgba(26,8,8,0.3)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        </svg>`;
    } else if (type === 'nails') {
        const nailColors = colors.slice(0, 5);
        feat.innerHTML = `<div class="nails-row">
            ${nailColors.map(([hex], i) => `
            <svg class="nail-svg-item" viewBox="0 0 26 44" xmlns="http://www.w3.org/2000/svg"
                 onclick="copyColor('${hex}')" title="${hex}">
                <defs>
                    <linearGradient id="nailG${i}" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
                        <stop offset="40%" stop-color="rgba(255,255,255,0.0)"/>
                        <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
                    </linearGradient>
                </defs>
                <!-- Finger base -->
                <rect x="3" y="30" width="20" height="14" rx="4" fill="#F2D9C0"/>
                <!-- Nail body -->
                <path d="M3,32 Q3,14 13,12 Q23,14 23,32 Q23,40 13,42 Q3,40 3,32Z" fill="${hex}"/>
                <!-- Nail side shadow -->
                <path d="M3,32 Q3,14 13,12 Q23,14 23,32 Q23,40 13,42 Q3,40 3,32Z" fill="url(#nailG${i})"/>
                <!-- Lunula (moon) -->
                <ellipse cx="13" cy="32" rx="6.5" ry="4" fill="rgba(255,255,255,0.28)"/>
                <!-- Nail sheen -->
                <ellipse cx="9" cy="22" rx="2.5" ry="6" fill="rgba(255,255,255,0.32)" transform="rotate(-10 9 22)"/>
                <!-- Cuticle line -->
                <path d="M5,32 Q13,29 21,32" stroke="rgba(0,0,0,0.1)" stroke-width="1" fill="none"/>
            </svg>`).join('')}
        </div>`;
    } else if (type === 'blush') {
        const blushColors = colors.slice(0, 2);
        const c1 = blushColors[0]?.[0] || firstColor;
        const c2 = blushColors[1]?.[0] || c1;
        feat.innerHTML = `
        <svg class="blush-feat-svg" viewBox="0 0 120 78" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="pan1G" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stop-color="${c1}" stop-opacity="0.92"/>
                    <stop offset="55%" stop-color="${c1}" stop-opacity="0.58"/>
                    <stop offset="100%" stop-color="${c1}" stop-opacity="0.22"/>
                </radialGradient>
                <radialGradient id="pan2G" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stop-color="${c2}" stop-opacity="0.92"/>
                    <stop offset="55%" stop-color="${c2}" stop-opacity="0.58"/>
                    <stop offset="100%" stop-color="${c2}" stop-opacity="0.22"/>
                </radialGradient>
            </defs>
            <!-- Compact case outer -->
            <rect x="4" y="6" width="112" height="66" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <!-- Compact case inner -->
            <rect x="8" y="10" width="104" height="58" rx="11" fill="rgba(255,255,255,0.04)"/>
            <!-- Pan 1 -->
            <circle cx="38" cy="39" r="24" fill="rgba(0,0,0,0.25)"/>
            <circle cx="38" cy="38" r="23" fill="url(#pan1G)"/>
            <circle cx="38" cy="38" r="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <circle cx="38" cy="38" r="9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <ellipse cx="30" cy="28" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20 30 28)"/>
            <!-- Pan 2 -->
            <circle cx="82" cy="39" r="24" fill="rgba(0,0,0,0.25)"/>
            <circle cx="82" cy="38" r="23" fill="url(#pan2G)"/>
            <circle cx="82" cy="38" r="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <circle cx="82" cy="38" r="9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <ellipse cx="74" cy="28" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20 74 28)"/>
            <!-- Divider -->
            <line x1="60" y1="12" x2="60" y2="66" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        </svg>`;
    }
    container.appendChild(feat);

    // Dot row
    const dotRow = document.createElement('div');
    dotRow.className = 'makeup-dot-row';
    colors.forEach(([hex, name]) => {
        const d = document.createElement('div');
        d.className = 'makeup-dot';
        d.style.background = hex;
        d.title = name;
        d.addEventListener('click', () => copyColor(hex));
        dotRow.appendChild(d);
    });
    container.appendChild(dotRow);
}

function renderJewelry(metals) {
    const showcase = document.getElementById('jewelryShowcase');
    if (!showcase) return;
    showcase.innerHTML = '';

    const METAL_COLORS = {
        'gold': '#D4AF37', 'yellow gold': '#D4AF37', 'алт': '#D4AF37',
        'silver': '#B8B8B8', 'мөнгө': '#B8B8B8',
        'rose gold': '#C9806A', 'ягаан алт': '#C9806A',
        'bronze': '#CD7F32', 'хүрэл': '#CD7F32',
        'copper': '#B87333', 'зэс': '#B87333',
        'platinum': '#D4D4D4', 'платин': '#D4D4D4',
        'pewter': '#96A8A1',
    };

    const JEWELRY_SVGS = {
        ring: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ringG_${ml}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${mc}" stop-opacity="1"/>
                    <stop offset="30%" stop-color="rgba(255,255,255,0.7)"/>
                    <stop offset="60%" stop-color="${mc}" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.5"/>
                </linearGradient>
                <radialGradient id="gemG_${ml}" cx="45%" cy="35%" r="55%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
                    <stop offset="40%" stop-color="rgba(200,220,255,0.7)"/>
                    <stop offset="100%" stop-color="rgba(150,170,220,0.4)"/>
                </radialGradient>
            </defs>
            <!-- Ring band -->
            <path d="M15,55 Q15,30 40,28 Q65,30 65,55" stroke="url(#ringG_${ml})" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M15,55 Q15,62 40,64 Q65,62 65,55" stroke="url(#ringG_${ml})" stroke-width="5" fill="none" stroke-linecap="round"/>
            <!-- Setting prongs -->
            <path d="M29,32 L28,20 M40,29 L40,17 M51,32 L52,20" stroke="${mc}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
            <!-- Gem facets -->
            <path d="M28,30 L40,18 L52,30 L48,36 L40,38 L32,36 Z" fill="url(#gemG_${ml})" stroke="${mc}" stroke-width="0.8" opacity="0.9"/>
            <line x1="28" y1="30" x2="40" y2="34" stroke="rgba(255,255,255,0.5)" stroke-width="0.6"/>
            <line x1="52" y1="30" x2="40" y2="34" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
            <line x1="40" y1="18" x2="40" y2="34" stroke="rgba(255,255,255,0.4)" stroke-width="0.6"/>
            <!-- Gem shine -->
            <circle cx="37" cy="23" r="3" fill="rgba(255,255,255,0.65)"/>
            <!-- Band highlight -->
            <path d="M18,52 Q20,38 40,35" stroke="rgba(255,255,255,0.35)" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`,

        necklace: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="chainG_${ml}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${mc}"/>
                    <stop offset="50%" stop-color="rgba(255,255,255,0.8)"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
                </linearGradient>
                <radialGradient id="pendG_${ml}" cx="40%" cy="30%" r="60%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
                </radialGradient>
            </defs>
            <!-- Chain curve -->
            <path d="M8,14 Q40,5 72,14 Q55,32 40,38 Q25,32 8,14Z" fill="none" stroke="url(#chainG_${ml})" stroke-width="2.2" stroke-linecap="round"/>
            <!-- Chain links -->
            ${[0.15,0.3,0.45,0.55,0.7,0.85].map(t=>{
                const x=8+64*t, y=14+Math.sin(Math.PI*t)*18;
                return `<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.6" stroke="${mc}" stroke-width="1.2" fill="none" transform="rotate(${-30+t*60} ${x} ${y})"/>`;
            }).join('')}
            <!-- Pendant drop line -->
            <line x1="40" y1="38" x2="40" y2="48" stroke="${mc}" stroke-width="1.8"/>
            <!-- Pendant gem -->
            <path d="M32,58 L40,47 L48,58 L44,64 L40,66 L36,64 Z" fill="url(#pendG_${ml})" stroke="${mc}" stroke-width="1"/>
            <line x1="32" y1="58" x2="40" y2="62" stroke="rgba(255,255,255,0.45)" stroke-width="0.7"/>
            <line x1="48" y1="58" x2="40" y2="62" stroke="rgba(255,255,255,0.25)" stroke-width="0.7"/>
            <circle cx="37" cy="52" r="3" fill="rgba(255,255,255,0.6)"/>
        </svg>`,

        earring: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="earG_${ml}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${mc}"/>
                    <stop offset="45%" stop-color="rgba(255,255,255,0.75)"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
                </linearGradient>
                <radialGradient id="earGemG_${ml}" cx="40%" cy="30%" r="58%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.5"/>
                </radialGradient>
            </defs>
            <!-- Hook -->
            <path d="M40,6 Q52,6 54,16 Q56,24 50,28" stroke="${mc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Wire drop -->
            <line x1="40" y1="28" x2="40" y2="38" stroke="${mc}" stroke-width="2"/>
            <!-- Drop gem -->
            <path d="M30,50 L40,37 L50,50 L46,60 L40,63 L34,60 Z" fill="url(#earGemG_${ml})" stroke="${mc}" stroke-width="1"/>
            <line x1="30" y1="50" x2="40" y2="58" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
            <line x1="50" y1="50" x2="40" y2="58" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
            <line x1="40" y1="37" x2="40" y2="58" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <circle cx="37" cy="43" r="3.5" fill="rgba(255,255,255,0.65)"/>
            <!-- Stud at top -->
            <circle cx="40" cy="10" r="4" fill="url(#earG_${ml})" stroke="${mc}" stroke-width="0.8"/>
        </svg>`,

        bracelet: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bracG_${ml}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${mc}"/>
                    <stop offset="35%" stop-color="rgba(255,255,255,0.75)"/>
                    <stop offset="65%" stop-color="${mc}" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="${mc}" stop-opacity="0.55"/>
                </linearGradient>
            </defs>
            <!-- Bangle band outer -->
            <ellipse cx="40" cy="44" rx="30" ry="16" stroke="url(#bracG_${ml})" stroke-width="6" fill="none"/>
            <!-- Bangle band inner highlight -->
            <ellipse cx="40" cy="44" rx="30" ry="16" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none"/>
            <!-- Chain links on top arc -->
            ${[-0.7,-0.3,0,0.3,0.7].map(t=>{
                const a=Math.asin(t)*1;
                const x=40+30*Math.cos(Math.PI/2+a);
                const y=44+16*Math.sin(Math.PI/2+a);
                return `<circle cx="${x}" cy="${y}" r="2.8" fill="${mc}" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>`;
            }).join('')}
            <!-- Gem centerpiece -->
            <path d="M31,42 L40,32 L49,42 L46,50 L40,52 L34,50 Z" fill="rgba(220,240,255,0.75)" stroke="${mc}" stroke-width="1.2"/>
            <circle cx="37" cy="38" r="3.2" fill="rgba(255,255,255,0.7)"/>
            <!-- Highlight arc -->
            <path d="M12,38 Q20,30 40,30" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,
    };

    const JEWELRY_LABELS = {
        ring:     currentLang==='mn' ? 'Бөгж'    : 'Ring',
        necklace: currentLang==='mn' ? 'Зүүлт'   : 'Necklace',
        earring:  currentLang==='mn' ? 'Ээмэг'   : 'Earring',
        bracelet: currentLang==='mn' ? 'Бугуйн'  : 'Bracelet',
    };

    // Resolve colors for all metals
    const resolvedMetals = (metals.length ? metals : ['Gold', 'Silver']).map(m => {
        const lower = m.toLowerCase();
        let color = '#D4AF37';
        for (const [key, val] of Object.entries(METAL_COLORS)) {
            if (lower.includes(key)) { color = val; break; }
        }
        return { name: m, color };
    });

    // Section 1 — Metals row
    const metalsRow = document.createElement('div');
    metalsRow.className = 'jewelry-metals-row';
    resolvedMetals.forEach(({ name, color }) => {
        metalsRow.innerHTML += `
            <div class="jewelry-metal-chip">
                <div class="jewelry-metal-dot" style="background:${color};box-shadow:0 2px 8px ${color}55"></div>
                <span class="jewelry-metal-name">${name}</span>
            </div>`;
    });
    showcase.appendChild(metalsRow);

    // Section 2 — Jewelry type grid
    const typeGrid = document.createElement('div');
    typeGrid.className = 'jewelry-type-grid';
    const primaryMetal = resolvedMetals[0] || { color: '#D4AF37', name: 'Gold' };

    Object.keys(JEWELRY_SVGS).forEach((key, idx) => {
        // Use different metals for variety
        const metal = resolvedMetals[idx % resolvedMetals.length] || primaryMetal;
        const svgContent = JEWELRY_SVGS[key](metal.color, `${key}_${idx}`);
        typeGrid.innerHTML += `
            <div class="jewelry-type-item">
                <div class="jewelry-type-icon">${svgContent}</div>
                <div class="jewelry-type-label">${JEWELRY_LABELS[key]}</div>
                <div class="jewelry-metal-badge" style="color:${metal.color}">${metal.name}</div>
            </div>`;
    });
    showcase.appendChild(typeGrid);
}

// ── Fabric & Pattern visual cards ──
const FABRIC_PATTERNS = {
    // Fabric textures — SVG patterns
    'silk': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="silkG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F8F2EC"/><stop offset="35%" stop-color="#E8D9CE"/><stop offset="65%" stop-color="#F4EDE6"/><stop offset="100%" stop-color="#D8C8BC"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#silkG${id})"/><path d="M0,15 Q15,10 30,15 Q45,20 60,15" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/><path d="M0,30 Q15,25 30,30 Q45,35 60,30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><path d="M0,45 Q15,40 30,45 Q45,50 60,45" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/></svg>`,
    'cotton': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F5F0EA"/>${Array.from({length:6},(_,r)=>Array.from({length:6},(_,c)=>`<circle cx="${5+c*10}" cy="${5+r*10}" r="2.5" fill="rgba(180,160,140,0.25)"/>`).join('')).join('')}<line x1="0" y1="0" x2="60" y2="60" stroke="rgba(180,160,140,0.1)" stroke-width="8"/><line x1="60" y1="0" x2="0" y2="60" stroke="rgba(180,160,140,0.1)" stroke-width="8"/></svg>`,
    'velvet': (id) => `<svg viewBox="0 0 60 60"><defs><radialGradient id="velG${id}" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#9B7E6E"/><stop offset="100%" stop-color="#5C3D2E"/></radialGradient></defs><rect width="60" height="60" rx="8" fill="url(#velG${id})"/>${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*8}" x2="60" y2="${i*8+4}" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>`).join('')}<ellipse cx="22" cy="20" rx="18" ry="10" fill="rgba(255,255,255,0.12)" transform="rotate(-20 22 20)"/></svg>`,
    'linen': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#E8DDD0"/>${Array.from({length:10},(_,i)=>`<line x1="0" y1="${i*6}" x2="60" y2="${i*6}" stroke="rgba(150,130,110,0.2)" stroke-width="1"/><line x1="${i*6}" y1="0" x2="${i*6}" y2="60" stroke="rgba(150,130,110,0.15)" stroke-width="0.8"/>`).join('')}</svg>`,
    'wool': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#C8B89A"/>${Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>`<path d="M${4+c*12},${4+r*12} Q${10+c*12},${-2+r*12} ${16+c*12},${4+r*12} Q${10+c*12},${10+r*12} ${4+c*12},${4+r*12}Z" fill="rgba(100,80,60,0.15)"/>`).join('')).join('')}</svg>`,
    'denim': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="denG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4A6FA5"/><stop offset="100%" stop-color="#2E4D7A"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#denG${id})"/>${Array.from({length:12},(_,i)=>`<line x1="0" y1="${i*5}" x2="60" y2="${i*5+3}" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"/>`).join('')}${Array.from({length:8},(_,i)=>`<line x1="${i*8}" y1="0" x2="${i*8+4}" y2="60" stroke="rgba(255,255,255,0.04)" stroke-width="1.5"/>`).join('')}</svg>`,
    'satin': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="satG${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#D4C5B8"/><stop offset="40%" stop-color="#F0E8E0"/><stop offset="60%" stop-color="#E8DCd4"/><stop offset="100%" stop-color="#C8B8AA"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#satG${id})"/><path d="M-10,20 Q15,10 40,20 Q55,25 80,18" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3"/><path d="M-10,40 Q20,30 45,40 Q55,45 80,38" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/></svg>`,
    'chiffon': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="rgba(240,234,226,0.9)"/>${Array.from({length:6},(_,i)=>`<path d="M0,${i*10} Q15,${i*10-4} 30,${i*10} Q45,${i*10+4} 60,${i*10}" fill="none" stroke="rgba(180,165,150,0.25)" stroke-width="1.5"/>`).join('')}</svg>`,
    // Pattern types
    'floral': (id) => {
        const pts = [[15,15],[45,15],[15,45],[45,45],[30,30]];
        const petals = pts.map(([x,y]) => {
            const petalSvg = [0,60,120,180,240,300].map(deg => {
                const r = deg * Math.PI / 180;
                const px = x + Math.cos(r)*7, py = y + Math.sin(r)*7;
                return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="3" ry="2" fill="rgba(196,149,106,0.4)" transform="rotate(${deg} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
            }).join('');
            return `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#C4956A" stroke-width="1.2"/>${petalSvg}<circle cx="${x}" cy="${y}" r="2.5" fill="#C4956A"/>`;
        }).join('');
        return `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F5EEE8"/>${petals}</svg>`;
    },
    'stripes': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F0E8E0"/>${[0,12,24,36,48].map(x=>`<rect x="${x}" y="0" width="6" height="60" fill="rgba(120,100,85,0.25)"/>`).join('')}</svg>`,
    'plaid': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#E8DDD4"/>${[10,30,50].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="rgba(100,75,60,0.35)" stroke-width="4"/>`).join('')}${[10,30,50].map(y=>`<line x1="0" y1="${y}" x2="60" y2="${y}" stroke="rgba(100,75,60,0.35)" stroke-width="4"/>`).join('')}${[10,30,50].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="rgba(150,120,95,0.2)" stroke-width="1.5"/>`).join('')}${[10,30,50].map(y=>`<line x1="0" y1="${y}" x2="60" y2="${y}" stroke="rgba(150,120,95,0.2)" stroke-width="1.5"/>`).join('')}</svg>`,
    'geometric': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F0EBE4"/>${[[0,0],[30,0],[0,30],[30,30]].map(([x,y])=>`<polygon points="${x+15},${y+4} ${x+26},${y+26} ${x+4},${y+26}" fill="none" stroke="rgba(100,80,65,0.35)" stroke-width="1.5"/>`).join('')}</svg>`,
    'animal print': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#D4B896"/>${[[10,8],[30,5],[50,10],[8,28],[25,22],[45,25],[55,40],[12,42],[35,38],[50,50],[20,55]].map(([x,y])=>`<path d="M${x},${y} Q${x+5},${y-4} ${x+8},${y+2} Q${x+5},${y+6} ${x},${y+3}Z" fill="rgba(60,40,20,0.5)"/>`).join('')}</svg>`,
    'paisley': (id) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#EDE0D4"/>${[[15,15],[45,35]].map(([x,y])=>`<path d="M${x},${y} Q${x+10},${y-14} ${x+14},${y-4} Q${x+18},${y+8} ${x+8},${y+14} Q${x-2},${y+12} ${x},${y}Z" fill="rgba(140,100,75,0.3)" stroke="rgba(140,100,75,0.5)" stroke-width="0.8"/><circle cx="${x}" cy="${y}" r="3" fill="rgba(140,100,75,0.5)"/>`).join('')}</svg>`,
    'solid': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="solG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E8DDD4"/><stop offset="100%" stop-color="#D4C8BE"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#solG${id})"/><ellipse cx="20" cy="20" rx="18" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-20 20 20)"/></svg>`,
};

function getPatternSvg(name, index) {
    const lower = name.toLowerCase();
    for (const [key, fn] of Object.entries(FABRIC_PATTERNS)) {
        if (lower.includes(key)) return fn(index);
    }
    // default: solid-ish texture
    return FABRIC_PATTERNS['solid'](index);
}

function renderTags(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'texture-card';
        card.innerHTML = `
            <div class="texture-preview">${getPatternSvg(item, index)}</div>
            <div class="texture-name">${item}</div>`;
        container.appendChild(card);
    });
}

// ============================================
// UTILITIES
// ============================================
function t(key) { return (LANG[currentLang] && LANG[currentLang][key]) || key; }

function rgbToHex(rgb) {
    return '#' + rgb.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function setSvgFill(id, color) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('fill', color);
}

function copyColor(hex) {
    navigator.clipboard.writeText(hex)
        .then(() => showTooltip(`${currentLang === 'mn' ? 'Хуулагдлаа' : 'Copied'} ${hex}`))
        .catch(() => {
            const input = document.createElement('input');
            input.value = hex; document.body.appendChild(input);
            input.select(); document.execCommand('copy');
            document.body.removeChild(input);
            showTooltip(`${currentLang === 'mn' ? 'Хуулагдлаа' : 'Copied'} ${hex}`);
        });
}

function showTooltip(text) {
    let tooltip = document.querySelector('.copied-tooltip');
    tooltip.textContent = text; tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 1500);
}

// ============================================
// WHY THIS COLOR WORKS + FLOATING CHIPS
// Populates explanation based on undertone/contrast/season
// ============================================
function populateWhyColorSection(classification, mlResult) {
    const section = document.getElementById('whyColorSection');
    const textEl  = document.getElementById('whyColorText');
    const chipsEl = document.getElementById('floatChipsWrap');
    if (!section || !textEl) return;

    const undertone = classification?.undertone?.type || '';
    const season    = mlResult?.predicted_season || classification?.season?.sub_season || '';
    const ita       = classification?.ita_angle || 0;
    const fitz      = classification?.fitzpatrick || '';
    const lang      = window.currentLang || 'mn';

    // Build "why" explanation
    const whyMap = {
        warm: {
            mn: `Таны арьс <strong>дулаан дотоод өнгөтэй</strong> (ITA ${Math.round(ita)}°) тул дулаан улаан-шар аясын өнгүүд — терракота, мөр, хуурай ногоон, зэс шар — арьсны байгалийн гялалзлыг нэмэгдүүлж, нүүрийг гэрэлтүүлнэ. Хүйтэн цэнхэр-ягаан өнгүүд арьсны ширхэгийг хүйтэн харагдуулна.`,
            en:  `Your skin has a <strong>warm undertone</strong> (ITA ${Math.round(ita)}°), so warm red-yellow tones — terracotta, coral, olive, amber — amplify your natural luminosity. Cool blue-pinks can make skin appear ashy.`
        },
        cool: {
            mn: `Таны арьс <strong>хүйтэн дотоод өнгөтэй</strong> (ITA ${Math.round(ita)}°) тул хүйтэн цэнхэр-ягаан аясын өнгүүд — нил, нэмрэн цэнхэр, хувцасны улаан, мөнгөлиг — арьсны байгалийн мэнгэрэмжийг тодотгоно. Улбар ба зэс аясын өнгүүд тулгарсан харагдуулж болно.`,
            en:  `Your skin has a <strong>cool undertone</strong> (ITA ${Math.round(ita)}°), so cool blue-pink tones — lavender, periwinkle, jewel tones, silver — enhance your natural clarity. Oranges and warm coppers can clash.`
        },
        neutral: {
            mn: `Таны арьс <strong>саармаг дотоод өнгөтэй</strong> бөгөөд хүйтэн болон дулаан өнгийн аль аль нь таны арьстай зохицно. Энэ нь өнгийн сонголтын хувьд хамгийн уян хатан хэлбэр юм.`,
            en:  `Your skin has a <strong>neutral undertone</strong>, meaning both warm and cool colors tend to harmonize beautifully. You have the most flexibility in color choices.`
        }
    };

    const key = undertone.toLowerCase().includes('warm') ? 'warm'
              : undertone.toLowerCase().includes('cool') ? 'cool'
              : 'neutral';

    const whyText = whyMap[key]?.[lang] || whyMap['neutral'][lang];
    textEl.innerHTML = whyText;
    section.style.display = 'block';

    // Floating chips: Undertone + Contrast + Fitzpatrick
    if (!chipsEl) return;
    chipsEl.innerHTML = '';
    const chips = [
        { label: lang==='mn' ? `Дотоод өнгө: ${undertone}` : `Undertone: ${undertone}`, color: '#C13B6E' },
        { label: lang==='mn' ? `Fitzpatrick: ${fitz}` : `Fitzpatrick: ${fitz}`, color: '#D4847A' },
        { label: lang==='mn' ? `ITA: ${Math.round(ita)}°` : `ITA: ${Math.round(ita)}°`, color: '#9B7AD4' },
    ];
    chips.forEach(c => {
        if (!c.label.includes('undefined') && !c.label.includes('null')) {
            const chip = document.createElement('div');
            chip.className = 'float-chip';
            chip.innerHTML = `<span class="float-chip-dot" style="background:${c.color}"></span>${c.label}`;
            chipsEl.appendChild(chip);
        }
    });
}

// Hook into existing displayResults
const _origDisplayResults = window.displayResults;

// ============================================
// HERO COLOR-CYCLING LABELS
// Synced with CSS keyframe animations
// ============================================
(function initHeroColorLabels() {
    const clothColors = {
        mn: ['Ягаан','Цэнхэр','Хадаг','Шар','Нил','Улбар','Улаан','Хөх'],
        en: ['Pink','Sky Blue','Mint','Yellow','Lavender','Sandy','Red','Steel Blue'],
    };
    const hairColors = {
        mn: ['Хүрэн','Хар','Алтан','Улаан','Нил','Зэс','Мөнгөлиг'],
        en: ['Brown','Black','Blonde','Auburn','Indigo','Copper','Silver'],
    };
    const earColors = {
        mn: ['Алт','Рубин','Зумруд','Сапфир','Аметист'],
        en: ['Gold','Ruby','Emerald','Sapphire','Amethyst'],
    };

    let clothIdx = 0, hairIdx = 0, earIdx = 0;

    function updateLabels() {
        const lang = window.currentLang || 'mn';
        const clothEl = document.getElementById('clothLabel');
        const hairEl  = document.getElementById('hairLabel');
        const earEl   = document.getElementById('earLabel');
        if (clothEl) clothEl.textContent = clothColors[lang][clothIdx % clothColors[lang].length];
        if (hairEl)  hairEl.textContent  = hairColors[lang][hairIdx  % hairColors[lang].length];
        if (earEl)   earEl.textContent   = earColors[lang][earIdx    % earColors[lang].length];
    }

    // Advance cloth every 1.2s (9.6s / 8 steps)
    setInterval(() => { clothIdx++; updateLabels(); }, 1200);
    // Advance hair every ~1.71s (12s / 7 steps)
    setInterval(() => { hairIdx++;  updateLabels(); }, 1714);
    // Advance earring every 1s (5s / 5 steps)
    setInterval(() => { earIdx++;   updateLabels(); }, 1000);

    // Initial render (after lang is ready)
    setTimeout(updateLabels, 200);
})();
