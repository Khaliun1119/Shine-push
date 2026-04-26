"""
Unit tests for the skin analysis pipeline.

Tests cover:
- RGB to CIE LAB conversion accuracy
- ITA (Individual Typology Angle) calculation
- Fitzpatrick scale classification
- Undertone detection
- Seasonal color type determination
- Color recommendation generation
"""

import sys
import math
sys.path.insert(0, '../backend')

from analyzer.skin_classifier import SkinClassifier
from analyzer.color_recommender import ColorRecommender


classifier = SkinClassifier()
recommender = ColorRecommender()


# ============================================
# CIE LAB Conversion Tests
# ============================================

def test_rgb_to_lab_white():
    """Pure white should have L*=100, a*=0, b*=0."""
    l, a, b = classifier._rgb_to_lab(255, 255, 255)
    assert abs(l - 100) < 1, f"White L* should be ~100, got {l}"
    assert abs(a) < 1, f"White a* should be ~0, got {a}"
    assert abs(b) < 1, f"White b* should be ~0, got {b}"
    print("[PASS] RGB to LAB: White")


def test_rgb_to_lab_black():
    """Pure black should have L*=0, a*=0, b*=0."""
    l, a, b = classifier._rgb_to_lab(0, 0, 0)
    assert abs(l) < 1, f"Black L* should be ~0, got {l}"
    assert abs(a) < 1, f"Black a* should be ~0, got {a}"
    assert abs(b) < 1, f"Black b* should be ~0, got {b}"
    print("[PASS] RGB to LAB: Black")


def test_rgb_to_lab_skin_tones():
    """Test LAB conversion for typical skin tones."""
    # Fair skin (approx)
    l, a, b = classifier._rgb_to_lab(230, 195, 170)
    assert 75 < l < 85, f"Fair skin L* should be 75-85, got {l}"
    assert a > 0, f"Fair skin a* should be positive, got {a}"
    assert b > 0, f"Fair skin b* should be positive, got {b}"
    print(f"[PASS] RGB to LAB: Fair skin -> L*={l:.1f}, a*={a:.1f}, b*={b:.1f}")

    # Medium skin
    l, a, b = classifier._rgb_to_lab(180, 140, 110)
    assert 55 < l < 70, f"Medium skin L* should be 55-70, got {l}"
    print(f"[PASS] RGB to LAB: Medium skin -> L*={l:.1f}, a*={a:.1f}, b*={b:.1f}")

    # Deep skin
    l, a, b = classifier._rgb_to_lab(100, 70, 50)
    assert 25 < l < 40, f"Deep skin L* should be 25-40, got {l}"
    print(f"[PASS] RGB to LAB: Deep skin -> L*={l:.1f}, a*={a:.1f}, b*={b:.1f}")


# ============================================
# ITA Calculation Tests
# ============================================

def test_ita_calculation():
    """ITA should correctly classify skin lightness."""
    # Very light skin (high L*, moderate b*)
    ita = classifier._calculate_ita(80, 15)
    assert ita > 55, f"Very light skin ITA should be > 55, got {ita}"
    print(f"[PASS] ITA: Very light -> {ita:.1f} degrees")

    # Medium skin
    ita = classifier._calculate_ita(60, 20)
    assert 20 < ita < 40, f"Medium skin ITA should be 20-40, got {ita}"
    print(f"[PASS] ITA: Medium -> {ita:.1f} degrees")

    # Deep skin
    ita = classifier._calculate_ita(35, 18)
    assert ita < 0, f"Deep skin ITA should be < 0, got {ita}"
    print(f"[PASS] ITA: Deep -> {ita:.1f} degrees")


# ============================================
# Fitzpatrick Classification Tests
# ============================================

def test_fitzpatrick_classification():
    """Test Fitzpatrick scale mapping from ITA."""
    assert classifier._classify_fitzpatrick(60)['type'] == 'I'
    assert classifier._classify_fitzpatrick(48)['type'] == 'II'
    assert classifier._classify_fitzpatrick(35)['type'] == 'III'
    assert classifier._classify_fitzpatrick(20)['type'] == 'IV'
    assert classifier._classify_fitzpatrick(0)['type'] == 'V'
    assert classifier._classify_fitzpatrick(-40)['type'] == 'VI'
    print("[PASS] Fitzpatrick classification: All types correct")


# ============================================
# Undertone Detection Tests
# ============================================

def test_undertone_warm():
    """High b* (yellow) relative to a* should indicate warm undertone."""
    undertone, _ = classifier._detect_undertone(10, 25, 210, 170, 130)
    assert undertone == 'warm', f"Expected warm, got {undertone}"
    print("[PASS] Undertone: Warm detection")


def test_undertone_cool():
    """High a* (pink) relative to b* should indicate cool undertone."""
    undertone, _ = classifier._detect_undertone(18, 5, 200, 170, 175)
    assert undertone == 'cool', f"Expected cool, got {undertone}"
    print("[PASS] Undertone: Cool detection")


# ============================================
# Seasonal Type Tests
# ============================================

def test_season_spring():
    """Light + warm should classify as Spring."""
    result = classifier.classify([230, 190, 160])
    season = result['season']['primary']
    assert season == 'Spring', f"Expected Spring, got {season}"
    print(f"[PASS] Season: Fair warm skin -> {result['season']['sub_season']}")


def test_season_summer():
    """Light + cool should classify as Summer."""
    result = classifier.classify([210, 180, 180])
    season = result['season']['primary']
    assert season == 'Summer', f"Expected Summer, got {season}"
    print(f"[PASS] Season: Fair cool skin -> {result['season']['sub_season']}")


def test_season_autumn():
    """Deep + warm should classify as Autumn."""
    result = classifier.classify([170, 120, 80])
    season = result['season']['primary']
    assert season == 'Autumn', f"Expected Autumn, got {season}"
    print(f"[PASS] Season: Deep warm skin -> {result['season']['sub_season']}")


def test_season_winter():
    """Deep + cool should classify as Winter."""
    result = classifier.classify([100, 70, 65])
    season = result['season']['primary']
    assert season == 'Winter', f"Expected Winter, got {season}"
    print(f"[PASS] Season: Deep cool skin -> {result['season']['sub_season']}")


# ============================================
# Full Classification Pipeline Test
# ============================================

def test_full_classification():
    """Test the complete classification pipeline end-to-end."""
    result = classifier.classify([200, 160, 130])

    assert 'skin_color' in result
    assert 'ita_angle' in result
    assert 'fitzpatrick' in result
    assert 'undertone' in result
    assert 'season' in result
    assert 'tone_name' in result

    assert result['skin_color']['hex'].startswith('#')
    assert len(result['skin_color']['hex']) == 7
    assert result['fitzpatrick']['type'] in ['I', 'II', 'III', 'IV', 'V', 'VI']
    assert result['undertone']['type'] in ['warm', 'cool', 'neutral']
    assert result['season']['primary'] in ['Spring', 'Summer', 'Autumn', 'Winter']

    print(f"[PASS] Full pipeline: {result['tone_name']}")
    print(f"        Fitzpatrick: {result['fitzpatrick']['type']} ({result['fitzpatrick']['label']})")
    print(f"        Undertone: {result['undertone']['type']}")
    print(f"        Season: {result['season']['sub_season']}")
    print(f"        ITA: {result['ita_angle']}")


# ============================================
# Recommendation Tests
# ============================================

def test_recommendations_structure():
    """Test that recommendations have the expected structure."""
    for season_name in [
        'Light Spring', 'Warm Spring', 'Clear Spring',
        'Light Summer', 'Cool Summer', 'Soft Summer',
        'Soft Autumn', 'Warm Autumn', 'Deep Autumn',
        'Deep Winter', 'Cool Winter', 'Clear Winter',
    ]:
        result = recommender.recommend(season_name)
        assert 'all_colors' in result
        assert 'clothing' in result
        assert 'avoid' in result
        assert 'outfits' in result
        assert 'tips' in result
        assert 'fabrics' in result
        assert 'patterns' in result
        assert 'makeup' in result
        assert 'metals' in result
        assert len(result['all_colors']) >= 10
        assert len(result['avoid']) >= 5
        assert len(result['outfits']) >= 5
        assert len(result['tips']) >= 5
        assert len(result['clothing']) >= 6
        assert 'tops' in result['clothing']
        assert 'bottoms' in result['clothing']
        assert 'dresses' in result['clothing']
        assert 'shoes' in result['clothing']
        assert 'lips' in result['makeup']
        assert 'eyes' in result['makeup']

    print("[PASS] Recommendations: All 12 seasons generate valid palettes")


def test_recommendation_colors_valid():
    """Test that all color hex values are valid."""
    result = recommender.recommend('Warm Spring')
    for color in result['all_colors']:
        assert color['hex'].startswith('#'), f"Invalid hex: {color['hex']}"
        assert len(color['hex']) == 7, f"Hex wrong length: {color['hex']}"
        assert color['name'], "Color must have a name"

    # Test clothing type colors
    for ctype, colors in result['clothing'].items():
        for color in colors:
            assert color['hex'].startswith('#'), f"Invalid hex in {ctype}: {color['hex']}"
            assert color['name'], f"Missing name in {ctype}"

    # Test makeup colors
    for mtype, colors in result['makeup'].items():
        for hex_val, name in colors:
            assert hex_val.startswith('#'), f"Invalid makeup hex: {hex_val}"
            assert name, f"Missing makeup color name"

    print("[PASS] Recommendations: Color data is valid (clothing + makeup)")


# ============================================
# Run All Tests
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("ChromaSense AI — Test Suite")
    print("=" * 60)
    print()

    tests = [
        test_rgb_to_lab_white,
        test_rgb_to_lab_black,
        test_rgb_to_lab_skin_tones,
        test_ita_calculation,
        test_fitzpatrick_classification,
        test_undertone_warm,
        test_undertone_cool,
        test_season_spring,
        test_season_summer,
        test_season_autumn,
        test_season_winter,
        test_full_classification,
        test_recommendations_structure,
        test_recommendation_colors_valid,
    ]

    passed = 0
    failed = 0

    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"[FAIL] {test.__name__}: {e}")
            failed += 1
        except Exception as e:
            print(f"[ERROR] {test.__name__}: {e}")
            failed += 1

    print()
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed, {len(tests)} total")
    print("=" * 60)
