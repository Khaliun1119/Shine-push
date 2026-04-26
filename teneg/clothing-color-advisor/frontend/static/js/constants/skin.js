export const UNDERTONE_MN = { warm: 'Дулаан', cool: 'Сэрүүн', neutral: 'Саармаг' };
export const UNDERTONE_EN = { warm: 'Warm',   cool: 'Cool',    neutral: 'Neutral' };

export const FITZPATRICK_MN = {
    'I': 'I — Маш цайвар', 'II': 'II — Цайвар',
    'III': 'III — Дунд зэрэг', 'IV': 'IV — Хүрэн шаргал',
    'V': 'V — Бор', 'VI': 'VI — Хар бор',
};
export const FITZPATRICK_EN = {
    'I': 'I — Very Fair', 'II': 'II — Fair',
    'III': 'III — Medium', 'IV': 'IV — Olive',
    'V': 'V — Brown', 'VI': 'VI — Dark Brown',
};

export const OCCASION_MN = { casual: 'Өдөр тутам', business: 'Ажлын', evening: 'Оройн', formal: 'Ёслолын' };
export const OCCASION_EN = { casual: 'Casual',      business: 'Business', evening: 'Evening', formal: 'Formal' };

export const UNDERTONE_DESC_MN = {
    warm:    'Дулаан дотоод өнгө нь алт, зэс, зэрлэг улаан сүүдэртэй өнгүүдэд сайн зохицдог. Алтан үнэт эдлэл, дулаан хүрэн өнгүүд таны арьсыг гялалзуулна.',
    cool:    'Сэрүүн дотоод өнгө нь мөнгө, нилуфар ягаан, цэнхэр сүүдэртэй өнгүүдэд сайн зохицдог. Мөнгөн үнэт эдлэл, сэрүүн хэрчмийн өнгүүд танд тохирно.',
    neutral: 'Саармаг дотоод өнгө нь дулаан болон сэрүүн аль аль өнгүүдтэй зохицдог. Та хамгийн их уян хатан хувцасны өнгийн сонголттой хүн.',
};

export const LOADING_STEPS_MN = [
    'Царай илрүүлж байна...', 'Арьсны өнгийг гаргаж байна...', 'Дотоод өнгийг шинжилж байна...',
    'Арьсны өнгийг ангилж байна...', 'Өнгийн улирлыг тодорхойлж байна...',
    'Хувцасны өнгийн зөвлөмж боловсруулж байна...', 'Хувцасны хослолуудыг үүсгэж байна...'
];
export const LOADING_STEPS_EN = [
    'Detecting face...', 'Extracting skin color...', 'Analyzing undertone...',
    'Classifying skin tone...', 'Determining color season...',
    'Generating clothing recommendations...', 'Building outfit combinations...'
];
