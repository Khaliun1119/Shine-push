"""
Dataset builder utility:
  1. Монгол баганууд нэмэх (season_mn, undertone_mn, depth_mn)
  2. Тэнцвэргүй улирлуудад synthetic дата нэмэх
  3. Шинэ dataset.csv хадгалах

Run: python build_dataset.py
"""

import csv
import math
import random
import numpy as np
from collections import Counter

random.seed(42)
rng = np.random.RandomState(42)

# ─── Translation maps ───────────────────────────────────────────────────────
SEASON_MN = {
    'Light Spring': 'Хөнгөн хавар',
    'Warm Spring':  'Дулаан хавар',
    'Clear Spring': 'Тод хавар',
    'Light Summer': 'Хөнгөн зун',
    'Cool Summer':  'Сэрүүн зун',
    'Soft Summer':  'Зөөлөн зун',
    'Soft Autumn':  'Зөөлөн намар',
    'Warm Autumn':  'Дулаан намар',
    'Deep Autumn':  'Гүн намар',
    'Deep Winter':  'Гүн өвөл',
    'Cool Winter':  'Сэрүүн өвөл',
    'Clear Winter': 'Тод өвөл',
}
UNDERTONE_MN = {'warm': 'дулаан', 'cool': 'сэрүүн', 'neutral': 'төвийн'}
DEPTH_MN = {
    'very_light':   'маш цайвар',
    'light':        'цайвар',
    'light_medium': 'цайвар-дунд',
    'medium':       'дунд',
    'deep':         'гүн',
}

# ─── ITA-based season parameters ────────────────────────────────────────────
SEASON_PARAMS = {
    'Light Spring': dict(ita_mean=55, ita_std=8,  b_mean=18, b_std=4,  a_offset=-2, undertone='warm'),
    'Warm Spring':  dict(ita_mean=42, ita_std=7,  b_mean=22, b_std=5,  a_offset=-3, undertone='warm'),
    'Clear Spring': dict(ita_mean=38, ita_std=6,  b_mean=20, b_std=4,  a_offset=-2, undertone='warm'),
    'Light Summer': dict(ita_mean=52, ita_std=8,  b_mean= 8, b_std=3,  a_offset= 5, undertone='cool'),
    'Cool Summer':  dict(ita_mean=38, ita_std=7,  b_mean= 6, b_std=3,  a_offset= 6, undertone='cool'),
    'Soft Summer':  dict(ita_mean=35, ita_std=6,  b_mean= 9, b_std=3,  a_offset= 3, undertone='neutral'),
    'Soft Autumn':  dict(ita_mean=28, ita_std=6,  b_mean=14, b_std=4,  a_offset= 0, undertone='warm'),
    'Warm Autumn':  dict(ita_mean=20, ita_std=6,  b_mean=20, b_std=5,  a_offset=-2, undertone='warm'),
    'Deep Autumn':  dict(ita_mean= 8, ita_std=6,  b_mean=18, b_std=5,  a_offset=-1, undertone='warm'),
    'Deep Winter':  dict(ita_mean= 5, ita_std=6,  b_mean= 5, b_std=3,  a_offset= 7, undertone='cool'),
    'Cool Winter':  dict(ita_mean=18, ita_std=6,  b_mean= 4, b_std=3,  a_offset= 8, undertone='cool'),
    'Clear Winter': dict(ita_mean=22, ita_std=6,  b_mean= 6, b_std=3,  a_offset= 6, undertone='cool'),
}

# Eye color base values per season [R, G, B]
EYE_COLORS = {
    'Light Spring': [(140,90,80),  (165,120,100), (120,100,80)],
    'Warm Spring':  [(130,80,60),  (110,70,50),   (145,95,70)],
    'Clear Spring': [(120,85,70),  (100,80,60),   (140,100,80)],
    'Light Summer': [(110,100,100),(130,115,115),  (120,110,105)],
    'Cool Summer':  [(100,90,95),  (115,100,105),  (95,85,90)],
    'Soft Summer':  [(105,95,90),  (120,108,100),  (110,100,95)],
    'Soft Autumn':  [(100,75,55),  (120,90,65),   (110,80,60)],
    'Warm Autumn':  [(90,60,40),   (105,70,45),   (85,55,35)],
    'Deep Autumn':  [(70,45,30),   (85,55,35),    (75,48,32)],
    'Deep Winter':  [(55,40,35),   (70,50,42),    (60,42,36)],
    'Cool Winter':  [(100,90,92),  (115,100,105),  (95,85,90)],
    'Clear Winter': [(85,75,80),   (100,88,92),   (110,95,100)],
}

FITZ_BY_ITA = [(55,'I'),(41,'II'),(28,'III'),(10,'IV'),(-30,'V'),(-999,'VI')]
DEPTH_BY_L  = [(75,'very_light'),(65,'light'),(55,'light_medium'),(45,'medium'),(0,'deep')]


def lab_to_rgb(L, a, b):
    fy = (L + 16) / 116
    fx = a / 500 + fy
    fz = fy - b / 200
    def f_inv(t):
        return t**3 if t > 0.20689 else (t - 16/116) / 7.787
    xyz = np.array([f_inv(fx), f_inv(fy), f_inv(fz)]) * np.array([0.95047, 1.0, 1.08883])
    m = np.array([[ 3.2404542,-1.5371385,-0.4985314],
                  [-0.9692660, 1.8760108, 0.0415560],
                  [ 0.0556434,-0.2040259, 1.0572252]])
    lin  = np.clip(m @ xyz, 0, 1)
    srgb = np.where(lin > 0.0031308, 1.055*lin**(1/2.4)-0.055, 12.92*lin)
    return tuple(int(x) for x in np.clip(srgb*255, 0, 255).round())


def get_fitz(ita):
    for thr, name in FITZ_BY_ITA:
        if ita > thr:
            return name
    return 'VI'


def get_depth(L):
    for thr, name in DEPTH_BY_L:
        if L > thr:
            return name
    return 'deep'


def gen_eye(season):
    base = random.choice(EYE_COLORS.get(season, [(100, 80, 70)]))
    noise = [random.randint(-15, 15) for _ in range(3)]
    r = max(30, min(200, base[0] + noise[0]))
    g = max(25, min(180, base[1] + noise[1]))
    b = max(20, min(170, base[2] + noise[2]))
    return r, g, b


def gen_row(season):
    p = SEASON_PARAMS[season]
    ita   = rng.normal(p['ita_mean'], p['ita_std'])
    b_val = float(np.clip(rng.normal(p['b_mean'], p['b_std']), 0, 35))
    L     = float(np.clip(50 + b_val * math.tan(math.radians(ita)), 20, 98))
    a_val = float(p['a_offset'] + rng.normal(0, 1.5))

    sr, sg, sb = lab_to_rgb(L, a_val, b_val)
    sr = int(np.clip(sr, 60, 255))
    sg = int(np.clip(sg, 40, 240))
    sb = int(np.clip(sb, 30, 230))
    er, eg, eb = gen_eye(season)

    fitz      = get_fitz(ita)
    depth     = get_depth(L)
    undertone = p['undertone']

    return {
        'skin_r': sr, 'skin_g': sg, 'skin_b': sb,
        'hair_r': 0,  'hair_g': 0,  'hair_b': 0,
        'eye_r':  er, 'eye_g':  eg, 'eye_b':  eb,
        'skin_hex':    f'#{sr:02x}{sg:02x}{sb:02x}',
        'hair_hex':    '',
        'eye_hex':     f'#{er:02x}{eg:02x}{eb:02x}',
        'fitzpatrick': fitz,
        'undertone':   undertone,
        'depth':       depth,
        'season':      season,
        'season_mn':   SEASON_MN[season],
        'undertone_mn': UNDERTONE_MN[undertone],
        'depth_mn':    DEPTH_MN.get(depth, depth),
    }


def main():
    csv_path = 'backend/dataset.csv'

    # ── Load existing rows ──────────────────────────────────────────────────
    with open(csv_path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        old_fieldnames = reader.fieldnames
        existing_rows  = list(reader)

    print(f"Loaded {len(existing_rows)} existing rows")

    # ── Add Mongolian columns to existing rows ──────────────────────────────
    updated_rows = []
    for row in existing_rows:
        season    = row.get('season', '').strip()
        undertone = row.get('undertone', '').strip()
        depth     = row.get('depth', '').strip()
        row['season_mn']    = SEASON_MN.get(season, season)
        row['undertone_mn'] = UNDERTONE_MN.get(undertone, undertone)
        row['depth_mn']     = DEPTH_MN.get(depth, depth)
        updated_rows.append(row)

    # ── Determine how many synthetic rows to generate ───────────────────────
    existing_counts = Counter(r['season'] for r in updated_rows)
    TARGET = 500   # minimum rows per season
    EXTRA  = 150   # extra rows for seasons that already have enough

    gen_plan = {}
    for season in SEASON_MN.keys():
        current = existing_counts.get(season, 0)
        if current < TARGET:
            gen_plan[season] = TARGET - current
        else:
            gen_plan[season] = EXTRA   # still add some to increase variety

    print("\nSynthetic rows to generate per season:")
    total_new = 0
    for s, n in gen_plan.items():
        existing = existing_counts.get(s, 0)
        print(f"  {s:18s}  existing={existing:4d}  +{n:4d} new")
        total_new += n
    print(f"\n  Total new rows : {total_new}")
    print(f"  Total after    : {len(updated_rows) + total_new}")

    # ── Generate synthetic rows ─────────────────────────────────────────────
    new_rows = []
    for season, count in gen_plan.items():
        for _ in range(count):
            new_rows.append(gen_row(season))

    all_rows = updated_rows + new_rows

    # ── Save new CSV ────────────────────────────────────────────────────────
    new_fieldnames = [
        'skin_r', 'skin_g', 'skin_b',
        'hair_r', 'hair_g', 'hair_b',
        'eye_r',  'eye_g',  'eye_b',
        'skin_hex', 'hair_hex', 'eye_hex',
        'fitzpatrick',
        'undertone', 'undertone_mn',
        'depth',     'depth_mn',
        'season',    'season_mn',
    ]

    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=new_fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"\nSaved {len(all_rows)} rows to {csv_path}")

    # ── Final distribution ──────────────────────────────────────────────────
    final_counts = Counter(r['season'] for r in all_rows)
    print("\nFinal season distribution:")
    for s in sorted(final_counts.keys()):
        mn = SEASON_MN.get(s, s)
        print(f"  {s:18s} / {mn:16s} : {final_counts[s]}")


if __name__ == '__main__':
    main()
