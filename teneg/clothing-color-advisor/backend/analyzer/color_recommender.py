"""
Color recommendation engine — Extended Edition.

Generates comprehensive clothing color palettes based on seasonal color analysis.
Includes colors organized by clothing type, outfit combinations by occasion,
fabric & pattern recommendations, and makeup color suggestions.
"""

from typing import List


# ============================================================
# SEASON PALETTES — Complete 12-season data
# ============================================================
# Each season includes:
#   clothing: colors organized by garment type
#   avoid: colors to avoid with reasons
#   outfits: 6 outfit combinations by occasion
#   fabrics: recommended fabric types
#   patterns: recommended patterns
#   makeup: lip, eye, blush, and nail colors
#   metals: recommended jewelry metals

SEASON_PALETTES = {

# ────────────────────────────────────────
# SPRING SEASONS
# ────────────────────────────────────────

"Light Spring": {
    "clothing": {
        "tops": [
            ("#FFFDD0", "Cream"),
            ("#FFDAB9", "Peach"),
            ("#FFB6A3", "Light Coral"),
            ("#F4C2C2", "Baby Pink"),
            ("#87CEEB", "Sky Blue"),
            ("#98D8C8", "Mint"),
            ("#FFFACD", "Lemon Chiffon"),
            ("#E8D5B7", "Champagne"),
        ],
        "bottoms": [
            ("#C8B896", "Light Camel"),
            ("#D2B48C", "Tan"),
            ("#F5E6CC", "Warm Ivory"),
            ("#FFFDD0", "Cream"),
            ("#87CEEB", "Light Denim Blue"),
            ("#C4B896", "Warm Khaki"),
        ],
        "dresses": [
            ("#FFDAB9", "Peach"),
            ("#F4C2C2", "Baby Pink"),
            ("#98D8C8", "Mint"),
            ("#FFB6A3", "Coral"),
            ("#E8D5B7", "Champagne"),
            ("#ADD8E6", "Light Blue"),
            ("#FFFACD", "Lemon"),
        ],
        "outerwear": [
            ("#C8B896", "Light Camel"),
            ("#F5E6CC", "Warm Ivory"),
            ("#D2B48C", "Tan"),
            ("#FFFDD0", "Cream"),
            ("#B0C4B1", "Sage"),
        ],
        "shoes": [
            ("#D2B48C", "Tan"),
            ("#C8B896", "Camel"),
            ("#FFFDD0", "Cream"),
            ("#F5E6CC", "Nude Warm"),
            ("#FFB6A3", "Coral"),
        ],
        "accessories": [
            ("#FFD700", "Gold"),
            ("#FF7F50", "Coral"),
            ("#40E0D0", "Turquoise"),
            ("#F0E68C", "Light Gold"),
            ("#FFDAB9", "Peach"),
            ("#98D8C8", "Mint"),
        ],
    },
    "avoid": [
        ("#000000", "Black", "Too harsh — overpowers your light, delicate coloring"),
        ("#36454F", "Charcoal", "Too dark and heavy for your complexion"),
        ("#4A0020", "Dark Burgundy", "Too deep and cool for your warm, light palette"),
        ("#191970", "Midnight Blue", "Too dark and cool — drains color from your face"),
        ("#800080", "Deep Purple", "Too intense and cool for your warm undertone"),
        ("#C0C0C0", "Cool Silver", "Cool metal clashes with your warm undertone"),
    ],
    "outfits": [
        {"name": "Casual Weekend", "occasion": "casual", "colors": ["#FFFDD0", "#87CEEB", "#C8B896", "#FFD700"], "pieces": ["Cream cotton tee", "Sky blue jeans", "Camel sneakers", "Gold pendant necklace"]},
        {"name": "Office Chic", "occasion": "business", "colors": ["#D2B48C", "#FFDAB9", "#FFFDD0", "#F0E68C"], "pieces": ["Tan blazer", "Peach silk blouse", "Cream trousers", "Light gold earrings"]},
        {"name": "Spring Date Night", "occasion": "evening", "colors": ["#FFB6A3", "#F5E6CC", "#40E0D0"], "pieces": ["Coral wrap dress", "Warm ivory heels", "Turquoise earrings"]},
        {"name": "Brunch Look", "occasion": "casual", "colors": ["#98D8C8", "#FFFDD0", "#D2B48C"], "pieces": ["Mint blouse", "Cream skirt", "Tan sandals"]},
        {"name": "Garden Party", "occasion": "formal", "colors": ["#F4C2C2", "#E8D5B7", "#FFD700"], "pieces": ["Baby pink midi dress", "Champagne clutch", "Gold bracelet"]},
        {"name": "Summer Travel", "occasion": "casual", "colors": ["#FFFACD", "#87CEEB", "#FF7F50"], "pieces": ["Lemon linen shirt", "Sky blue shorts", "Coral sandals"]},
    ],
    "fabrics": ["Light cotton", "Linen", "Silk charmeuse", "Cashmere (light weight)", "Chiffon"],
    "patterns": ["Soft florals", "Watercolor prints", "Delicate stripes", "Paisley (light)", "Small polka dots"],
    "makeup": {
        "lips": [("#E8967A", "Peach Nude"), ("#F4A582", "Warm Coral"), ("#D4836D", "Soft Apricot"), ("#CC7A6E", "Warm Rose")],
        "eyes": [("#C8A882", "Warm Taupe"), ("#D4A574", "Soft Bronze"), ("#B8C8A0", "Sage Green"), ("#C4B0A0", "Warm Beige")],
        "blush": [("#F8B4A0", "Peach"), ("#F0A4A0", "Soft Coral"), ("#E8C0A8", "Warm Nude")],
        "nails": [("#FFDAB9", "Peach"), ("#F4C2C2", "Baby Pink"), ("#FFB6A3", "Coral"), ("#F0E68C", "Light Gold")],
    },
    "metals": ["Yellow gold", "Rose gold", "Brass", "Copper"],
},

"Warm Spring": {
    "clothing": {
        "tops": [
            ("#FFF8DC", "Cornsilk"),
            ("#FF7F50", "Coral"),
            ("#FF8C00", "Dark Orange"),
            ("#FFD700", "Golden Yellow"),
            ("#32CD32", "Lime Green"),
            ("#00CED1", "Dark Turquoise"),
            ("#E9967A", "Dark Salmon"),
            ("#FAEBD7", "Antique White"),
        ],
        "bottoms": [
            ("#DEB887", "Burlywood"),
            ("#D2691E", "Warm Brown"),
            ("#F5DEB3", "Wheat"),
            ("#CD853F", "Peru"),
            ("#FFF8DC", "Cornsilk"),
            ("#C8AD7F", "Warm Khaki"),
        ],
        "dresses": [
            ("#FF7F50", "Coral"),
            ("#FFD700", "Golden Yellow"),
            ("#00CED1", "Turquoise"),
            ("#E9967A", "Salmon"),
            ("#FF8C00", "Orange"),
            ("#FAEBD7", "Antique White"),
        ],
        "outerwear": [
            ("#DEB887", "Burlywood"),
            ("#D2691E", "Warm Brown"),
            ("#CD853F", "Peru"),
            ("#FAEBD7", "Antique White"),
            ("#C19A6B", "Camel"),
        ],
        "shoes": [
            ("#D2691E", "Warm Brown"),
            ("#CD853F", "Peru"),
            ("#DEB887", "Burlywood"),
            ("#C19A6B", "Camel"),
            ("#FFF8DC", "Cornsilk"),
        ],
        "accessories": [
            ("#FFD700", "Gold"),
            ("#FF7F50", "Coral"),
            ("#00CED1", "Turquoise"),
            ("#FF8C00", "Orange"),
            ("#B8860B", "Dark Gold"),
            ("#32CD32", "Green"),
        ],
    },
    "avoid": [
        ("#000000", "Black", "Too stark — choose warm dark brown instead"),
        ("#C0C0C0", "Cool Silver", "Clashes with your strong warm undertones"),
        ("#4B0082", "Indigo", "Too cool and dark for your warm palette"),
        ("#800020", "Burgundy", "Cool-based red drains your warmth"),
        ("#F0F8FF", "Icy Blue", "Cool-toned white washes out warm skin"),
        ("#808080", "Medium Gray", "Neutral gray dulls your golden warmth"),
    ],
    "outfits": [
        {"name": "Tropical Casual", "occasion": "casual", "colors": ["#FF7F50", "#FFF8DC", "#DEB887", "#FFD700"], "pieces": ["Coral tee", "Cornsilk shorts", "Burlywood sandals", "Gold hoop earrings"]},
        {"name": "Golden Office", "occasion": "business", "colors": ["#CD853F", "#FFF8DC", "#D2691E", "#B8860B"], "pieces": ["Peru blazer", "Cornsilk blouse", "Warm brown trousers", "Dark gold watch"]},
        {"name": "Sunset Dinner", "occasion": "evening", "colors": ["#FFD700", "#D2691E", "#FF8C00"], "pieces": ["Golden dress", "Warm brown heels", "Orange silk scarf"]},
        {"name": "Beach Day", "occasion": "casual", "colors": ["#00CED1", "#FFF8DC", "#FF7F50"], "pieces": ["Turquoise tank", "Cornsilk linen pants", "Coral flip flops"]},
        {"name": "Autumn Brunch", "occasion": "casual", "colors": ["#E9967A", "#C19A6B", "#32CD32"], "pieces": ["Salmon sweater", "Camel pants", "Green bag"]},
        {"name": "Cocktail Party", "occasion": "formal", "colors": ["#FF8C00", "#FAEBD7", "#FFD700"], "pieces": ["Orange cocktail dress", "Antique white clutch", "Gold statement necklace"]},
    ],
    "fabrics": ["Silk twill", "Linen", "Cotton sateen", "Suede (light)", "Jersey knit"],
    "patterns": ["Tropical prints", "Bold florals", "Warm stripes", "Geometric (warm tones)", "Animal print (warm)"],
    "makeup": {
        "lips": [("#E07050", "Warm Coral"), ("#C86040", "Terracotta"), ("#D47040", "Spiced Apricot"), ("#B85540", "Warm Brick")],
        "eyes": [("#C49040", "Warm Gold"), ("#A07840", "Bronze"), ("#8B7355", "Warm Brown"), ("#607848", "Olive Green")],
        "blush": [("#E89070", "Warm Peach"), ("#D08060", "Terracotta"), ("#C89070", "Warm Bronze")],
        "nails": [("#FF7F50", "Coral"), ("#FF8C00", "Orange"), ("#FFD700", "Gold"), ("#D2691E", "Warm Brown")],
    },
    "metals": ["Yellow gold", "Brass", "Copper", "Bronze"],
},

"Clear Spring": {
    "clothing": {
        "tops": [
            ("#FFFFF0", "Ivory"),
            ("#FF4040", "Bright Red"),
            ("#00BFFF", "Deep Sky Blue"),
            ("#FF69B4", "Hot Pink"),
            ("#FFA07A", "Light Salmon"),
            ("#48D1CC", "Medium Turquoise"),
            ("#FFB347", "Pastel Orange"),
            ("#7FFF00", "Chartreuse"),
        ],
        "bottoms": [
            ("#F5F5DC", "Beige"),
            ("#C8AD7F", "Light Khaki"),
            ("#8B7355", "Warm Taupe"),
            ("#FFFFF0", "Ivory"),
            ("#00BFFF", "True Blue"),
            ("#FFFFFF", "Bright White"),
        ],
        "dresses": [
            ("#FF4040", "Bright Red"),
            ("#FF69B4", "Hot Pink"),
            ("#00BFFF", "Sky Blue"),
            ("#48D1CC", "Turquoise"),
            ("#FFA07A", "Salmon"),
            ("#FFB347", "Pastel Orange"),
            ("#FFFFF0", "Ivory"),
        ],
        "outerwear": [
            ("#C8AD7F", "Light Khaki"),
            ("#8B7355", "Warm Taupe"),
            ("#F5F5DC", "Beige"),
            ("#FFFFF0", "Ivory"),
            ("#00BFFF", "Cobalt Blue"),
        ],
        "shoes": [
            ("#8B7355", "Warm Taupe"),
            ("#C8AD7F", "Light Khaki"),
            ("#FFFFF0", "Ivory"),
            ("#FF4040", "Red"),
            ("#F5F5DC", "Nude"),
        ],
        "accessories": [
            ("#FFD700", "Gold"),
            ("#FF4040", "Red"),
            ("#00BFFF", "Blue"),
            ("#FF69B4", "Hot Pink"),
            ("#48D1CC", "Turquoise"),
            ("#7FFF00", "Chartreuse"),
        ],
    },
    "avoid": [
        ("#696969", "Dim Gray", "Too muted — dulls your bright, clear coloring"),
        ("#8B8589", "Taupe Gray", "Too dusty and muted for your vivid palette"),
        ("#2F4F4F", "Dark Slate", "Too dark and cool for your warm clarity"),
        ("#800020", "Burgundy", "Too muted and dark — choose bright red instead"),
        ("#808080", "Medium Gray", "Neutral gray dampens your natural brightness"),
        ("#8B6969", "Dusty Rose", "Too muted — choose clear pink instead"),
    ],
    "outfits": [
        {"name": "Bold Casual", "occasion": "casual", "colors": ["#FFFFF0", "#FF4040", "#C8AD7F", "#FFD700"], "pieces": ["Ivory tee", "Bright red skirt", "Khaki sneakers", "Gold bracelet"]},
        {"name": "Power Office", "occasion": "business", "colors": ["#8B7355", "#00BFFF", "#FFFFF0", "#FFD700"], "pieces": ["Warm taupe suit", "Sky blue blouse", "Ivory camisole", "Gold earrings"]},
        {"name": "Party Night", "occasion": "evening", "colors": ["#FF69B4", "#FFFFF0", "#FFD700"], "pieces": ["Hot pink dress", "Ivory clutch", "Gold statement jewelry"]},
        {"name": "City Walk", "occasion": "casual", "colors": ["#48D1CC", "#F5F5DC", "#8B7355"], "pieces": ["Turquoise top", "Beige chinos", "Taupe loafers"]},
        {"name": "Spring Brunch", "occasion": "casual", "colors": ["#FFB347", "#FFFFF0", "#00BFFF"], "pieces": ["Pastel orange blouse", "Ivory jeans", "Blue bag"]},
        {"name": "Gala Event", "occasion": "formal", "colors": ["#FF4040", "#FFFFF0", "#FFD700"], "pieces": ["Bright red gown", "Ivory wrap", "Gold heels and clutch"]},
    ],
    "fabrics": ["Crisp cotton", "Silk", "Satin", "Poplin", "Polished denim"],
    "patterns": ["Bold stripes", "Color blocking", "Graphic prints", "Large florals (vivid)", "Clean geometric"],
    "makeup": {
        "lips": [("#E83838", "True Red"), ("#E06080", "Bright Pink"), ("#D05040", "Coral Red"), ("#C84060", "Fuchsia")],
        "eyes": [("#A08060", "Warm Bronze"), ("#607848", "Green"), ("#487098", "Teal Blue"), ("#B89060", "Gold Shimmer")],
        "blush": [("#E09080", "Bright Peach"), ("#D87888", "Bright Rose"), ("#E0A080", "Warm Apricot")],
        "nails": [("#FF4040", "Bright Red"), ("#FF69B4", "Hot Pink"), ("#00BFFF", "Sky Blue"), ("#FFD700", "Gold")],
    },
    "metals": ["Yellow gold", "Rose gold", "Bright brass"],
},

# ────────────────────────────────────────
# SUMMER SEASONS
# ────────────────────────────────────────

"Light Summer": {
    "clothing": {
        "tops": [
            ("#F5F5F5", "Soft White"),
            ("#FFB6C1", "Light Pink"),
            ("#B0C4DE", "Light Steel Blue"),
            ("#B4A7D6", "Soft Lavender"),
            ("#ADD8E6", "Light Blue"),
            ("#D8BFD8", "Thistle"),
            ("#F0E6EF", "Pale Mauve"),
            ("#ACE5EE", "Powder Blue"),
        ],
        "bottoms": [
            ("#D3D3D3", "Light Gray"),
            ("#B0A4A8", "Warm Gray"),
            ("#C4AEAD", "Silver Pink"),
            ("#F5F5F5", "Soft White"),
            ("#B0C4DE", "Steel Blue"),
            ("#C8C8D0", "Blue Gray"),
        ],
        "dresses": [
            ("#FFB6C1", "Light Pink"),
            ("#E6E6FA", "Lavender"),
            ("#B4A7D6", "Soft Lavender"),
            ("#ADD8E6", "Light Blue"),
            ("#DDA0DD", "Plum Blossom"),
            ("#D8BFD8", "Thistle"),
            ("#F5F5F5", "Soft White"),
        ],
        "outerwear": [
            ("#D3D3D3", "Light Gray"),
            ("#B0A4A8", "Warm Gray"),
            ("#C4AEAD", "Silver Pink"),
            ("#B0C4DE", "Steel Blue"),
            ("#F5F5F5", "Soft White"),
        ],
        "shoes": [
            ("#D3D3D3", "Light Gray"),
            ("#C4AEAD", "Silver Pink"),
            ("#B0A4A8", "Warm Gray"),
            ("#F5F5F5", "Soft White"),
            ("#B0C4DE", "Steel Blue"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#C8A2C8", "Lilac"),
            ("#E6E6FA", "Lavender"),
            ("#FFB6C1", "Light Pink"),
            ("#ADD8E6", "Light Blue"),
            ("#DDA0DD", "Plum Blossom"),
        ],
    },
    "avoid": [
        ("#000000", "Black", "Far too heavy — drains all color from your delicate face"),
        ("#FF4500", "Orange Red", "Too warm and intense for your cool, light palette"),
        ("#FF8C00", "Dark Orange", "Warm orange overwhelms your cool undertones"),
        ("#8B4513", "Saddle Brown", "Too warm and dark for your light coloring"),
        ("#FFD700", "Bright Gold", "Warm gold clashes with your cool undertone"),
        ("#FF0000", "Bright Red", "Too intense — choose soft rose instead"),
    ],
    "outfits": [
        {"name": "Soft Weekend", "occasion": "casual", "colors": ["#F5F5F5", "#B4A7D6", "#D3D3D3", "#C0C0C0"], "pieces": ["Soft white tee", "Lavender cardigan", "Light gray jeans", "Silver pendant"]},
        {"name": "Office Rose", "occasion": "business", "colors": ["#B0A4A8", "#FFB6C1", "#F5F5F5", "#C0C0C0"], "pieces": ["Gray blazer", "Light pink blouse", "White trousers", "Silver earrings"]},
        {"name": "Evening Glow", "occasion": "evening", "colors": ["#E6E6FA", "#C4AEAD", "#C0C0C0"], "pieces": ["Lavender dress", "Silver pink heels", "Silver clutch"]},
        {"name": "Pastel Brunch", "occasion": "casual", "colors": ["#ADD8E6", "#F5F5F5", "#D3D3D3"], "pieces": ["Light blue top", "White skirt", "Gray sandals"]},
        {"name": "Garden Tea", "occasion": "formal", "colors": ["#DDA0DD", "#F5F5F5", "#C8A2C8"], "pieces": ["Plum blossom dress", "White shrug", "Lilac clutch"]},
        {"name": "Seaside Day", "occasion": "casual", "colors": ["#ACE5EE", "#F5F5F5", "#C4AEAD"], "pieces": ["Powder blue linen top", "Soft white shorts", "Silver pink sandals"]},
    ],
    "fabrics": ["Chiffon", "Soft cotton", "Fine knit", "Silk crepe", "Voile"],
    "patterns": ["Soft watercolors", "Tiny florals", "Tone-on-tone stripes", "Pastel checks", "Muted paisley"],
    "makeup": {
        "lips": [("#C8808C", "Soft Rose"), ("#D0909C", "Pink Nude"), ("#B8707C", "Mauve"), ("#C09098", "Dusty Pink")],
        "eyes": [("#A098A8", "Cool Taupe"), ("#9898B0", "Soft Plum"), ("#88A0B0", "Blue Gray"), ("#B0A0B0", "Lavender")],
        "blush": [("#E0A0A8", "Soft Pink"), ("#D8A0B0", "Cool Rose"), ("#D0B0B8", "Pale Mauve")],
        "nails": [("#FFB6C1", "Light Pink"), ("#E6E6FA", "Lavender"), ("#B0C4DE", "Steel Blue"), ("#DDA0DD", "Plum")],
    },
    "metals": ["Silver", "White gold", "Platinum", "Rose gold (light)"],
},

"Cool Summer": {
    "clothing": {
        "tops": [
            ("#F0F0F0", "Cool White"),
            ("#6495ED", "Cornflower Blue"),
            ("#DB7093", "Pale Violet Red"),
            ("#8B8EE5", "Soft Periwinkle"),
            ("#5F9EA0", "Cadet Blue"),
            ("#BC8F8F", "Rosy Brown"),
            ("#9370DB", "Medium Purple"),
            ("#4682B4", "Steel Blue"),
        ],
        "bottoms": [
            ("#708090", "Slate Gray"),
            ("#A9A9A9", "Medium Gray"),
            ("#B0A4A8", "Mauve Gray"),
            ("#4682B4", "Steel Blue"),
            ("#F0F0F0", "Cool White"),
            ("#6E6E82", "Cool Charcoal"),
        ],
        "dresses": [
            ("#6495ED", "Cornflower Blue"),
            ("#C71585", "Rose"),
            ("#8B8EE5", "Periwinkle"),
            ("#6A5ACD", "Slate Blue"),
            ("#DB7093", "Pale Violet Red"),
            ("#5F9EA0", "Cadet Blue"),
            ("#8E4585", "Plum"),
        ],
        "outerwear": [
            ("#708090", "Slate Gray"),
            ("#4682B4", "Steel Blue"),
            ("#A9A9A9", "Medium Gray"),
            ("#6E6E82", "Cool Charcoal"),
            ("#B0A4A8", "Mauve Gray"),
        ],
        "shoes": [
            ("#708090", "Slate Gray"),
            ("#4682B4", "Navy Blue"),
            ("#A9A9A9", "Gray"),
            ("#6E6E82", "Charcoal"),
            ("#B0A4A8", "Mauve"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#C71585", "Rose"),
            ("#6A5ACD", "Slate Blue"),
            ("#8E4585", "Plum"),
            ("#6495ED", "Cornflower"),
            ("#9370DB", "Purple"),
        ],
    },
    "avoid": [
        ("#FF8C00", "Orange", "Warm orange directly clashes with your cool tones"),
        ("#FFD700", "Gold", "Warm gold jewelry overpowers cool undertones"),
        ("#8B4513", "Brown", "Warm brown drains color from your face"),
        ("#FF6347", "Tomato", "Too warm and intense for your cool palette"),
        ("#808000", "Olive", "Warm yellow-green conflicts with your cool base"),
        ("#B8860B", "Dark Goldenrod", "Too warm and yellow for your complexion"),
    ],
    "outfits": [
        {"name": "Cool Casual", "occasion": "casual", "colors": ["#F0F0F0", "#6495ED", "#708090", "#C0C0C0"], "pieces": ["Cool white tee", "Cornflower blue jeans", "Slate gray sneakers", "Silver bracelet"]},
        {"name": "Corporate Cool", "occasion": "business", "colors": ["#708090", "#C71585", "#F0F0F0", "#C0C0C0"], "pieces": ["Slate gray blazer", "Rose blouse", "Cool white pants", "Silver watch"]},
        {"name": "Evening Berry", "occasion": "evening", "colors": ["#8E4585", "#F0F0F0", "#C0C0C0"], "pieces": ["Plum evening dress", "Cool white wrap", "Silver statement necklace"]},
        {"name": "Gallery Visit", "occasion": "casual", "colors": ["#8B8EE5", "#A9A9A9", "#F0F0F0"], "pieces": ["Periwinkle sweater", "Gray trousers", "White sneakers"]},
        {"name": "Dinner Date", "occasion": "evening", "colors": ["#6A5ACD", "#B0A4A8", "#C0C0C0"], "pieces": ["Slate blue dress", "Mauve heels", "Silver earrings"]},
        {"name": "Weekend Market", "occasion": "casual", "colors": ["#5F9EA0", "#F0F0F0", "#708090"], "pieces": ["Cadet blue linen shirt", "White shorts", "Slate loafers"]},
    ],
    "fabrics": ["Matte cotton", "Silk crepe", "Linen blend", "Cashmere", "Ponte"],
    "patterns": ["Cool-toned stripes", "Abstract watercolor", "Geometric (cool)", "Houndstooth", "Toile"],
    "makeup": {
        "lips": [("#B83860", "Berry"), ("#C85080", "Cool Pink"), ("#983050", "Plum"), ("#A84060", "Raspberry")],
        "eyes": [("#808898", "Cool Gray"), ("#786888", "Plum"), ("#607080", "Slate"), ("#8888A8", "Periwinkle")],
        "blush": [("#D08898", "Cool Rose"), ("#C888A0", "Berry"), ("#D0A0A8", "Pink")],
        "nails": [("#C71585", "Rose"), ("#6A5ACD", "Slate Blue"), ("#8E4585", "Plum"), ("#6495ED", "Cornflower")],
    },
    "metals": ["Silver", "Platinum", "White gold", "Pewter"],
},

"Soft Summer": {
    "clothing": {
        "tops": [
            ("#DCDCDC", "Gainsboro"),
            ("#DCAE96", "Dusty Rose"),
            ("#B0C4B1", "Sage"),
            ("#A2B5CD", "Dusty Blue"),
            ("#CDA4DE", "Soft Orchid"),
            ("#8FBC8F", "Sea Green"),
            ("#B8A9C9", "Soft Mauve"),
            ("#C9B8A8", "Mushroom"),
        ],
        "bottoms": [
            ("#A9A9A9", "Gray"),
            ("#C4B7A6", "Soft Taupe"),
            ("#778899", "Light Slate"),
            ("#8E8E76", "Soft Olive"),
            ("#DCDCDC", "Light Gray"),
            ("#B0A8A0", "Warm Stone"),
        ],
        "dresses": [
            ("#DCAE96", "Dusty Rose"),
            ("#B0C4B1", "Sage"),
            ("#A2B5CD", "Dusty Blue"),
            ("#CDA4DE", "Soft Orchid"),
            ("#967BB6", "Soft Purple"),
            ("#C9B8A8", "Mushroom"),
            ("#B4C7DC", "Dusty Periwinkle"),
        ],
        "outerwear": [
            ("#C4B7A6", "Soft Taupe"),
            ("#A9A9A9", "Gray"),
            ("#778899", "Light Slate"),
            ("#C9B8A8", "Mushroom"),
            ("#8E8E76", "Soft Olive"),
        ],
        "shoes": [
            ("#C4B7A6", "Soft Taupe"),
            ("#A9A9A9", "Gray"),
            ("#778899", "Slate"),
            ("#C9B8A8", "Mushroom"),
            ("#B0A8A0", "Stone"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#967BB6", "Soft Purple"),
            ("#DCAE96", "Dusty Rose"),
            ("#A2B5CD", "Dusty Blue"),
            ("#B0C4B1", "Sage"),
            ("#CDA4DE", "Orchid"),
        ],
    },
    "avoid": [
        ("#000000", "Black", "Too harsh for your soft, blended coloring"),
        ("#FF0000", "Bright Red", "Too vivid — choose muted dusty rose instead"),
        ("#FF4500", "Orange", "Too warm and intense for your cool-muted palette"),
        ("#FFFF00", "Bright Yellow", "Too bright and warm for your soft tonality"),
        ("#00FF00", "Neon Green", "Electric colors overpower your gentle coloring"),
        ("#FF00FF", "Magenta", "Too vivid — choose soft orchid instead"),
    ],
    "outfits": [
        {"name": "Muted Weekend", "occasion": "casual", "colors": ["#C4B7A6", "#8FBC8F", "#DCDCDC", "#C0C0C0"], "pieces": ["Taupe tee", "Sage joggers", "Light gray sneakers", "Silver stud earrings"]},
        {"name": "Quiet Office", "occasion": "business", "colors": ["#778899", "#DCAE96", "#DCDCDC", "#C0C0C0"], "pieces": ["Slate blazer", "Dusty rose blouse", "Light gray trousers", "Silver pendant"]},
        {"name": "Soft Evening", "occasion": "evening", "colors": ["#967BB6", "#C4B7A6", "#C0C0C0"], "pieces": ["Soft purple dress", "Taupe heels", "Silver jewelry"]},
        {"name": "Art Gallery", "occasion": "casual", "colors": ["#B4C7DC", "#C9B8A8", "#A9A9A9"], "pieces": ["Dusty periwinkle sweater", "Mushroom pants", "Gray loafers"]},
        {"name": "Garden Walk", "occasion": "casual", "colors": ["#B0C4B1", "#DCDCDC", "#C4B7A6"], "pieces": ["Sage blouse", "Light gray skirt", "Taupe sandals"]},
        {"name": "Dinner Out", "occasion": "evening", "colors": ["#CDA4DE", "#778899", "#DCDCDC"], "pieces": ["Soft orchid top", "Slate trousers", "Light gray clutch"]},
    ],
    "fabrics": ["Soft jersey", "Brushed cotton", "Cashmere", "Matte silk", "Chambray"],
    "patterns": ["Muted florals", "Soft plaid", "Ombre", "Subtle tie-dye", "Tone-on-tone prints"],
    "makeup": {
        "lips": [("#B88888", "Dusty Rose"), ("#A88080", "Muted Mauve"), ("#C09888", "Soft Berry"), ("#B89090", "Rose Nude")],
        "eyes": [("#A89898", "Soft Taupe"), ("#9890A0", "Dusty Plum"), ("#88A098", "Sage"), ("#A0A0B0", "Soft Gray")],
        "blush": [("#D0A8A8", "Dusty Pink"), ("#C8A8B0", "Soft Mauve"), ("#D0B0A8", "Muted Peach")],
        "nails": [("#DCAE96", "Dusty Rose"), ("#B0C4B1", "Sage"), ("#CDA4DE", "Orchid"), ("#C4B7A6", "Taupe")],
    },
    "metals": ["Silver", "White gold", "Brushed silver", "Soft rose gold"],
},

# ────────────────────────────────────────
# AUTUMN SEASONS
# ────────────────────────────────────────

"Soft Autumn": {
    "clothing": {
        "tops": [
            ("#F5E6CC", "Warm Cream"),
            ("#D2B48C", "Tan"),
            ("#BC8F8F", "Rosy Brown"),
            ("#8FBC8F", "Sage Green"),
            ("#BDB76B", "Dark Khaki"),
            ("#CD853F", "Soft Terracotta"),
            ("#C3B091", "Sand"),
            ("#DAA520", "Goldenrod"),
        ],
        "bottoms": [
            ("#A0826D", "Soft Brown"),
            ("#B8A088", "Warm Taupe"),
            ("#C4A882", "Soft Gold"),
            ("#808000", "Olive"),
            ("#967969", "Dark Tan"),
            ("#F5E6CC", "Warm Cream"),
        ],
        "dresses": [
            ("#D2B48C", "Tan"),
            ("#BC8F8F", "Rosy Brown"),
            ("#8FBC8F", "Sage"),
            ("#CD853F", "Terracotta"),
            ("#DAA520", "Goldenrod"),
            ("#CC7722", "Amber"),
            ("#C3B091", "Sand"),
        ],
        "outerwear": [
            ("#A0826D", "Soft Brown"),
            ("#B8A088", "Warm Taupe"),
            ("#808000", "Olive"),
            ("#C4A882", "Soft Gold"),
            ("#967969", "Dark Tan"),
        ],
        "shoes": [
            ("#A0826D", "Soft Brown"),
            ("#B8A088", "Warm Taupe"),
            ("#967969", "Dark Tan"),
            ("#C4A882", "Soft Gold"),
            ("#808000", "Olive"),
        ],
        "accessories": [
            ("#CFB53B", "Old Gold"),
            ("#CD853F", "Terracotta"),
            ("#8FBC8F", "Sage"),
            ("#DAA520", "Goldenrod"),
            ("#CC7722", "Amber"),
            ("#BC8F8F", "Rosy Brown"),
        ],
    },
    "avoid": [
        ("#000000", "Black", "Too harsh and cool — choose warm dark brown instead"),
        ("#FF00FF", "Magenta", "Too cool and electric for your muted warm palette"),
        ("#0000FF", "Bright Blue", "Too cool and vivid — choose soft sage instead"),
        ("#FF1493", "Hot Pink", "Too bright and cool for your earthy tones"),
        ("#F0F8FF", "Icy White", "Cool white washes you out — choose warm cream"),
        ("#C0C0C0", "Silver", "Cool silver clashes — choose warm gold tones"),
    ],
    "outfits": [
        {"name": "Earth Tones", "occasion": "casual", "colors": ["#F5E6CC", "#808000", "#A0826D", "#CFB53B"], "pieces": ["Cream sweater", "Olive pants", "Soft brown boots", "Old gold earrings"]},
        {"name": "Office Natural", "occasion": "business", "colors": ["#B8A088", "#CD853F", "#F5E6CC", "#CFB53B"], "pieces": ["Warm taupe blazer", "Terracotta blouse", "Cream trousers", "Gold watch"]},
        {"name": "Autumn Dinner", "occasion": "evening", "colors": ["#DAA520", "#A0826D", "#F5E6CC"], "pieces": ["Goldenrod dress", "Soft brown heels", "Cream shawl"]},
        {"name": "Farmers Market", "occasion": "casual", "colors": ["#8FBC8F", "#C3B091", "#967969"], "pieces": ["Sage linen top", "Sand shorts", "Dark tan sandals"]},
        {"name": "Rustic Date", "occasion": "evening", "colors": ["#CC7722", "#B8A088", "#CFB53B"], "pieces": ["Amber wrap dress", "Warm taupe clutch", "Gold pendant"]},
        {"name": "Cozy Sunday", "occasion": "casual", "colors": ["#BC8F8F", "#F5E6CC", "#BDB76B"], "pieces": ["Rosy brown sweater", "Cream joggers", "Khaki sneakers"]},
    ],
    "fabrics": ["Brushed cotton", "Soft suede", "Cashmere", "Linen", "Corduroy (fine)"],
    "patterns": ["Muted plaid", "Earth-tone florals", "Subtle paisley", "Soft animal print", "Heathered textures"],
    "makeup": {
        "lips": [("#B88068", "Warm Nude"), ("#A87860", "Soft Terracotta"), ("#C09070", "Muted Peach"), ("#987060", "Warm Mauve")],
        "eyes": [("#A89068", "Soft Gold"), ("#908060", "Warm Khaki"), ("#787858", "Olive"), ("#A09080", "Taupe")],
        "blush": [("#D0A888", "Soft Peach"), ("#C89878", "Warm Sand"), ("#C8A890", "Nude Warm")],
        "nails": [("#CD853F", "Terracotta"), ("#8FBC8F", "Sage"), ("#DAA520", "Goldenrod"), ("#C3B091", "Sand")],
    },
    "metals": ["Brushed gold", "Antique gold", "Copper", "Bronze"],
},

"Warm Autumn": {
    "clothing": {
        "tops": [
            ("#FAEBD7", "Antique White"),
            ("#B7410E", "Rust"),
            ("#CC5500", "Burnt Orange"),
            ("#DAA520", "Goldenrod"),
            ("#228B22", "Forest Green"),
            ("#556B2F", "Dark Olive"),
            ("#8B0000", "Dark Red"),
            ("#D2691E", "Chocolate"),
        ],
        "bottoms": [
            ("#6B4226", "Rich Brown"),
            ("#8B7355", "Warm Taupe"),
            ("#556B2F", "Dark Olive"),
            ("#CD853F", "Peru"),
            ("#C19A6B", "Camel"),
            ("#8B6914", "Dark Goldenrod"),
        ],
        "dresses": [
            ("#B7410E", "Rust"),
            ("#DAA520", "Goldenrod"),
            ("#228B22", "Forest Green"),
            ("#CC5500", "Burnt Orange"),
            ("#8B0000", "Dark Red"),
            ("#FAEBD7", "Antique White"),
            ("#D2691E", "Chocolate"),
        ],
        "outerwear": [
            ("#6B4226", "Rich Brown"),
            ("#C19A6B", "Camel"),
            ("#556B2F", "Dark Olive"),
            ("#8B7355", "Warm Taupe"),
            ("#B7410E", "Rust"),
        ],
        "shoes": [
            ("#6B4226", "Rich Brown"),
            ("#8B7355", "Warm Taupe"),
            ("#C19A6B", "Camel"),
            ("#8B6914", "Dark Goldenrod"),
            ("#CD853F", "Peru"),
        ],
        "accessories": [
            ("#B8860B", "Antique Gold"),
            ("#B7410E", "Rust"),
            ("#228B22", "Forest Green"),
            ("#DAA520", "Goldenrod"),
            ("#CC5500", "Burnt Orange"),
            ("#8B0000", "Dark Red"),
        ],
    },
    "avoid": [
        ("#FF00FF", "Fuchsia", "Too cool and electric for your warm earthiness"),
        ("#0000CD", "Royal Blue", "Cool blue drains warmth from your face"),
        ("#C0C0C0", "Silver", "Cool silver clashes — wear gold or bronze instead"),
        ("#FF69B4", "Pink", "Too cool and bright for your deep warm palette"),
        ("#F0FFFF", "Icy White", "Cool white washes you out — choose cream or ivory"),
        ("#E6E6FA", "Lavender", "Too cool and light for your warm, rich coloring"),
    ],
    "outfits": [
        {"name": "Autumn Walk", "occasion": "casual", "colors": ["#FAEBD7", "#B7410E", "#6B4226", "#B8860B"], "pieces": ["Antique white sweater", "Rust jacket", "Rich brown pants", "Antique gold ring"]},
        {"name": "Harvest Office", "occasion": "business", "colors": ["#C19A6B", "#556B2F", "#FAEBD7", "#B8860B"], "pieces": ["Camel blazer", "Dark olive dress", "Antique white blouse", "Gold earrings"]},
        {"name": "Fireside Dinner", "occasion": "evening", "colors": ["#8B0000", "#FAEBD7", "#B8860B"], "pieces": ["Dark red velvet dress", "Antique white shawl", "Gold statement necklace"]},
        {"name": "Forest Hike", "occasion": "casual", "colors": ["#228B22", "#C19A6B", "#6B4226"], "pieces": ["Forest green fleece", "Camel pants", "Rich brown boots"]},
        {"name": "Thanksgiving", "occasion": "formal", "colors": ["#DAA520", "#8B7355", "#B7410E"], "pieces": ["Goldenrod blouse", "Warm taupe skirt", "Rust heels"]},
        {"name": "Weekend Market", "occasion": "casual", "colors": ["#CC5500", "#FAEBD7", "#556B2F"], "pieces": ["Burnt orange top", "Antique white jeans", "Olive jacket"]},
    ],
    "fabrics": ["Suede", "Corduroy", "Tweed", "Chunky knit", "Flannel", "Velvet"],
    "patterns": ["Plaid", "Tartan", "Animal print", "Paisley", "Earth-tone florals", "Herringbone"],
    "makeup": {
        "lips": [("#A84020", "Burnt Sienna"), ("#B03020", "Brick Red"), ("#984030", "Warm Brown"), ("#883828", "Deep Terracotta")],
        "eyes": [("#8B6914", "Bronze"), ("#6B5028", "Warm Brown"), ("#556B2F", "Olive"), ("#907040", "Copper")],
        "blush": [("#C07850", "Terracotta"), ("#B07848", "Warm Bronze"), ("#D09060", "Rich Peach")],
        "nails": [("#B7410E", "Rust"), ("#8B0000", "Dark Red"), ("#556B2F", "Dark Olive"), ("#DAA520", "Gold")],
    },
    "metals": ["Antique gold", "Bronze", "Copper", "Warm brass"],
},

"Deep Autumn": {
    "clothing": {
        "tops": [
            ("#F5DEB3", "Wheat"),
            ("#A52A2A", "Brown Red"),
            ("#006400", "Dark Green"),
            ("#B22222", "Firebrick"),
            ("#2E8B57", "Sea Green"),
            ("#CD853F", "Peru"),
            ("#D2691E", "Chocolate"),
            ("#B8860B", "Dark Goldenrod"),
        ],
        "bottoms": [
            ("#3B2F2F", "Dark Brown"),
            ("#5C4033", "Espresso"),
            ("#8B7355", "Dark Taupe"),
            ("#704214", "Sepia"),
            ("#2E4A2E", "Deep Forest"),
            ("#F5DEB3", "Wheat"),
        ],
        "dresses": [
            ("#A52A2A", "Brown Red"),
            ("#006400", "Dark Green"),
            ("#B22222", "Firebrick"),
            ("#D2691E", "Chocolate"),
            ("#2E8B57", "Sea Green"),
            ("#B8860B", "Dark Goldenrod"),
            ("#F5DEB3", "Wheat"),
        ],
        "outerwear": [
            ("#3B2F2F", "Dark Brown"),
            ("#5C4033", "Espresso"),
            ("#704214", "Sepia"),
            ("#2E4A2E", "Deep Forest"),
            ("#8B7355", "Dark Taupe"),
        ],
        "shoes": [
            ("#3B2F2F", "Dark Brown"),
            ("#5C4033", "Espresso"),
            ("#8B7355", "Taupe"),
            ("#704214", "Sepia"),
            ("#2E4A2E", "Forest"),
        ],
        "accessories": [
            ("#B8860B", "Dark Gold"),
            ("#8B6914", "Bronze"),
            ("#A52A2A", "Brown Red"),
            ("#006400", "Dark Green"),
            ("#B22222", "Firebrick"),
            ("#2E8B57", "Sea Green"),
        ],
    },
    "avoid": [
        ("#FF69B4", "Pink", "Too light and cool for your deep, warm coloring"),
        ("#E6E6FA", "Lavender", "Too cool and light — clashes with your depth"),
        ("#ADD8E6", "Light Blue", "Too light and cool for your rich palette"),
        ("#C0C0C0", "Silver", "Cool metal conflicts with your warm undertone"),
        ("#FFFF00", "Bright Yellow", "Too light and electric — choose deep gold instead"),
        ("#FFB6C1", "Light Pink", "Too delicate and cool for your bold coloring"),
    ],
    "outfits": [
        {"name": "Deep Luxe", "occasion": "casual", "colors": ["#3B2F2F", "#B22222", "#F5DEB3", "#B8860B"], "pieces": ["Dark brown leather jacket", "Firebrick sweater", "Wheat trousers", "Gold pendant"]},
        {"name": "Executive Edge", "occasion": "business", "colors": ["#5C4033", "#006400", "#F5DEB3", "#8B6914"], "pieces": ["Espresso suit", "Dark green blouse", "Wheat camisole", "Bronze cufflinks"]},
        {"name": "Grand Evening", "occasion": "evening", "colors": ["#A52A2A", "#F5DEB3", "#B8860B"], "pieces": ["Brown red gown", "Wheat shawl", "Gold chandelier earrings"]},
        {"name": "Autumn Layers", "occasion": "casual", "colors": ["#D2691E", "#8B7355", "#2E8B57"], "pieces": ["Chocolate sweater", "Taupe pants", "Sea green scarf"]},
        {"name": "Holiday Party", "occasion": "formal", "colors": ["#006400", "#B8860B", "#3B2F2F"], "pieces": ["Dark green velvet dress", "Gold belt", "Dark brown heels"]},
        {"name": "Weekend Rich", "occasion": "casual", "colors": ["#CD853F", "#5C4033", "#F5DEB3"], "pieces": ["Peru corduroy shirt", "Espresso jeans", "Wheat sneakers"]},
    ],
    "fabrics": ["Leather", "Velvet", "Heavy silk", "Tweed", "Suede", "Brocade"],
    "patterns": ["Rich plaid", "Deep florals", "Damask", "Paisley (deep)", "Bold stripes (warm)"],
    "makeup": {
        "lips": [("#802020", "Deep Brick"), ("#681818", "Oxblood"), ("#903020", "Warm Burgundy"), ("#783028", "Mahogany")],
        "eyes": [("#604020", "Rich Brown"), ("#504018", "Dark Bronze"), ("#2E4A2E", "Forest"), ("#786030", "Warm Copper")],
        "blush": [("#B07048", "Deep Peach"), ("#A06838", "Rich Bronze"), ("#C08050", "Warm Terracotta")],
        "nails": [("#A52A2A", "Brown Red"), ("#006400", "Dark Green"), ("#B8860B", "Dark Gold"), ("#3B2F2F", "Dark Brown")],
    },
    "metals": ["Antique gold", "Dark bronze", "Copper", "Burnished brass"],
},

# ────────────────────────────────────────
# WINTER SEASONS
# ────────────────────────────────────────

"Deep Winter": {
    "clothing": {
        "tops": [
            ("#FFFFFF", "Pure White"),
            ("#DC143C", "Crimson"),
            ("#0047AB", "Cobalt Blue"),
            ("#50C878", "Emerald"),
            ("#8B008B", "Dark Magenta"),
            ("#800020", "Burgundy"),
            ("#006B3C", "Bottle Green"),
            ("#4B0082", "Indigo"),
        ],
        "bottoms": [
            ("#1C1C1C", "Near Black"),
            ("#2C2C54", "Dark Navy"),
            ("#36454F", "Charcoal"),
            ("#2F4F4F", "Dark Slate"),
            ("#FFFFFF", "White"),
            ("#191970", "Midnight Blue"),
        ],
        "dresses": [
            ("#DC143C", "Crimson"),
            ("#50C878", "Emerald"),
            ("#8B008B", "Dark Magenta"),
            ("#0047AB", "Cobalt Blue"),
            ("#800020", "Burgundy"),
            ("#FFFFFF", "Pure White"),
            ("#4B0082", "Indigo"),
        ],
        "outerwear": [
            ("#1C1C1C", "Near Black"),
            ("#2C2C54", "Dark Navy"),
            ("#36454F", "Charcoal"),
            ("#2F4F4F", "Dark Slate"),
            ("#800020", "Burgundy"),
        ],
        "shoes": [
            ("#1C1C1C", "Black"),
            ("#2C2C54", "Dark Navy"),
            ("#36454F", "Charcoal"),
            ("#800020", "Burgundy"),
            ("#FFFFFF", "White"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#DC143C", "Crimson"),
            ("#50C878", "Emerald"),
            ("#8B008B", "Magenta"),
            ("#0047AB", "Cobalt"),
            ("#4B0082", "Indigo"),
        ],
    },
    "avoid": [
        ("#FFA500", "Orange", "Too warm — overpowers your cool, deep coloring"),
        ("#F0E68C", "Light Gold", "Too warm and light for your deep palette"),
        ("#DEB887", "Tan", "Warm tan washes out your cool contrast"),
        ("#FFD700", "Gold", "Warm gold clashes — choose silver or platinum"),
        ("#F5DEB3", "Wheat", "Too warm and muted for your bold coloring"),
        ("#BDB76B", "Khaki", "Warm khaki dulls your natural high contrast"),
    ],
    "outfits": [
        {"name": "Power Contrast", "occasion": "casual", "colors": ["#1C1C1C", "#DC143C", "#FFFFFF", "#C0C0C0"], "pieces": ["Black tee", "Crimson jacket", "White jeans", "Silver watch"]},
        {"name": "Executive Dark", "occasion": "business", "colors": ["#2C2C54", "#FFFFFF", "#0047AB", "#C0C0C0"], "pieces": ["Dark navy suit", "White shirt", "Cobalt blue tie/scarf", "Silver cufflinks"]},
        {"name": "Gala Night", "occasion": "evening", "colors": ["#50C878", "#1C1C1C", "#C0C0C0"], "pieces": ["Emerald gown", "Black heels", "Silver diamond necklace"]},
        {"name": "Winter Walk", "occasion": "casual", "colors": ["#36454F", "#DC143C", "#FFFFFF"], "pieces": ["Charcoal peacoat", "Crimson scarf", "White sneakers"]},
        {"name": "Cocktail Hour", "occasion": "evening", "colors": ["#8B008B", "#FFFFFF", "#C0C0C0"], "pieces": ["Dark magenta cocktail dress", "White clutch", "Silver earrings"]},
        {"name": "Art Opening", "occasion": "formal", "colors": ["#4B0082", "#FFFFFF", "#1C1C1C"], "pieces": ["Indigo silk blouse", "White trousers", "Black heels"]},
    ],
    "fabrics": ["Crisp cotton", "Heavy silk", "Leather", "Satin", "Cashmere (dark)", "Velvet"],
    "patterns": ["High-contrast stripes", "Bold geometric", "Color blocking", "Minimal prints", "Dramatic florals (dark background)"],
    "makeup": {
        "lips": [("#B01030", "True Red"), ("#801040", "Deep Berry"), ("#680828", "Wine"), ("#980830", "Crimson")],
        "eyes": [("#383848", "Charcoal"), ("#282838", "Navy"), ("#204030", "Dark Green"), ("#504060", "Deep Plum")],
        "blush": [("#C07080", "Deep Rose"), ("#B06070", "Berry"), ("#D08888", "Cool Pink")],
        "nails": [("#DC143C", "Crimson"), ("#1C1C1C", "Black"), ("#50C878", "Emerald"), ("#8B008B", "Magenta")],
    },
    "metals": ["Silver", "Platinum", "White gold", "Gunmetal"],
},

"Cool Winter": {
    "clothing": {
        "tops": [
            ("#FFFFFF", "Bright White"),
            ("#0000CD", "Royal Blue"),
            ("#FF1493", "Deep Pink"),
            ("#8A2BE2", "Blue Violet"),
            ("#008080", "Teal"),
            ("#DC143C", "Crimson"),
            ("#E0115F", "Ruby"),
            ("#F0F8FF", "Icy Blue"),
        ],
        "bottoms": [
            ("#000000", "True Black"),
            ("#2F4F4F", "Dark Slate"),
            ("#708090", "Slate Gray"),
            ("#191970", "Midnight"),
            ("#FFFFFF", "Bright White"),
            ("#E8E8E8", "Icy Gray"),
        ],
        "dresses": [
            ("#0000CD", "Royal Blue"),
            ("#FF1493", "Deep Pink"),
            ("#8A2BE2", "Blue Violet"),
            ("#E0115F", "Ruby"),
            ("#008080", "Teal"),
            ("#9400D3", "Dark Violet"),
            ("#FFFFFF", "Bright White"),
        ],
        "outerwear": [
            ("#000000", "True Black"),
            ("#2F4F4F", "Dark Slate"),
            ("#708090", "Slate Gray"),
            ("#191970", "Midnight"),
            ("#483D8B", "Slate Blue"),
        ],
        "shoes": [
            ("#000000", "Black"),
            ("#2F4F4F", "Dark Slate"),
            ("#708090", "Slate Gray"),
            ("#FFFFFF", "White"),
            ("#191970", "Navy"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#E0115F", "Ruby"),
            ("#8A2BE2", "Violet"),
            ("#FF1493", "Deep Pink"),
            ("#0000CD", "Royal Blue"),
            ("#9400D3", "Dark Violet"),
        ],
    },
    "avoid": [
        ("#FFA500", "Orange", "Warm orange overwhelms your cool, icy palette"),
        ("#FFD700", "Gold", "Warm gold conflicts with your cool undertone"),
        ("#8B4513", "Saddle Brown", "Warm brown drains color from your face"),
        ("#F0E68C", "Khaki", "Too warm and muted for your high-contrast look"),
        ("#DEB887", "Burlywood", "Warm beige dulls your natural cool brightness"),
        ("#808000", "Olive", "Warm olive clashes with your cool base"),
    ],
    "outfits": [
        {"name": "Icy Elegance", "occasion": "casual", "colors": ["#FFFFFF", "#0000CD", "#000000", "#C0C0C0"], "pieces": ["White blouse", "Royal blue jeans", "Black boots", "Silver bracelet"]},
        {"name": "Cool Power", "occasion": "business", "colors": ["#000000", "#FFFFFF", "#DC143C", "#C0C0C0"], "pieces": ["Black suit", "White shirt", "Crimson silk scarf", "Silver watch"]},
        {"name": "Berry Night", "occasion": "evening", "colors": ["#9400D3", "#FFFFFF", "#C0C0C0"], "pieces": ["Dark violet gown", "White faux fur wrap", "Silver chandelier earrings"]},
        {"name": "Cool Drama", "occasion": "evening", "colors": ["#FF1493", "#708090", "#FFFFFF"], "pieces": ["Deep pink dress", "Slate heels", "White clutch"]},
        {"name": "Violet Weekend", "occasion": "casual", "colors": ["#8A2BE2", "#E8E8E8", "#2F4F4F"], "pieces": ["Blue violet sweater", "Icy gray jeans", "Dark slate boots"]},
        {"name": "Teal Brunch", "occasion": "casual", "colors": ["#008080", "#FFFFFF", "#000000"], "pieces": ["Teal silk blouse", "White trousers", "Black loafers"]},
    ],
    "fabrics": ["Crisp cotton", "Satin", "Patent leather", "Structured wool", "Ice silk", "Metallic fabrics"],
    "patterns": ["Stark stripes", "Graphic prints", "Color blocking", "Polka dots (B&W)", "Geometric (cool)"],
    "makeup": {
        "lips": [("#C01050", "Cool Red"), ("#A82068", "Fuchsia"), ("#801848", "Deep Berry"), ("#B83070", "Bright Pink")],
        "eyes": [("#404058", "Cool Charcoal"), ("#384868", "Navy"), ("#504870", "Deep Purple"), ("#304848", "Dark Teal")],
        "blush": [("#D08090", "Cool Pink"), ("#C07888", "Berry"), ("#B87088", "Deep Rose")],
        "nails": [("#0000CD", "Royal Blue"), ("#FF1493", "Deep Pink"), ("#000000", "Black"), ("#9400D3", "Violet")],
    },
    "metals": ["Silver", "Platinum", "White gold", "Chrome"],
},

"Clear Winter": {
    "clothing": {
        "tops": [
            ("#FFFFFF", "Snow White"),
            ("#FF0000", "True Red"),
            ("#0000FF", "True Blue"),
            ("#FF00FF", "Magenta"),
            ("#FF1493", "Deep Pink"),
            ("#00CED1", "Dark Turquoise"),
            ("#9400D3", "Violet"),
            ("#7B68EE", "Med Slate Blue"),
        ],
        "bottoms": [
            ("#000000", "Jet Black"),
            ("#36454F", "Charcoal"),
            ("#1C1C1C", "Onyx"),
            ("#FFFFFF", "Snow White"),
            ("#191970", "Dark Navy"),
            ("#0000FF", "True Blue"),
        ],
        "dresses": [
            ("#FF0000", "True Red"),
            ("#FF00FF", "Magenta"),
            ("#0000FF", "True Blue"),
            ("#9400D3", "Violet"),
            ("#00CED1", "Turquoise"),
            ("#FF1493", "Deep Pink"),
            ("#FFFFFF", "Snow White"),
            ("#40E0D0", "Turquoise Green"),
        ],
        "outerwear": [
            ("#000000", "Jet Black"),
            ("#36454F", "Charcoal"),
            ("#1C1C1C", "Onyx"),
            ("#FFFFFF", "Snow White"),
            ("#FF0000", "True Red"),
        ],
        "shoes": [
            ("#000000", "Black"),
            ("#1C1C1C", "Onyx"),
            ("#FFFFFF", "White"),
            ("#FF0000", "Red"),
            ("#36454F", "Charcoal"),
        ],
        "accessories": [
            ("#C0C0C0", "Silver"),
            ("#FF0000", "Red"),
            ("#0000FF", "Blue"),
            ("#FF00FF", "Magenta"),
            ("#40E0D0", "Turquoise"),
            ("#9400D3", "Violet"),
        ],
    },
    "avoid": [
        ("#C4A882", "Muted Gold", "Muted tones dull your vivid, clear coloring"),
        ("#808080", "Medium Gray", "Too muted — choose black or white instead"),
        ("#DEB887", "Burlywood", "Warm muted beige washes out your high contrast"),
        ("#BC8F8F", "Rosy Brown", "Too dusty and muted for your clear palette"),
        ("#D2B48C", "Tan", "Warm tan dulls your natural vivid coloring"),
        ("#A9A9A9", "Dark Gray", "Dull gray lacks the clarity your coloring needs"),
    ],
    "outfits": [
        {"name": "High Contrast", "occasion": "casual", "colors": ["#000000", "#FF0000", "#FFFFFF", "#C0C0C0"], "pieces": ["Black jeans", "True red top", "White sneakers", "Silver hoop earrings"]},
        {"name": "Vivid Office", "occasion": "business", "colors": ["#36454F", "#0000FF", "#FFFFFF", "#C0C0C0"], "pieces": ["Charcoal blazer", "True blue blouse", "White trousers", "Silver watch"]},
        {"name": "Electric Night", "occasion": "evening", "colors": ["#FF00FF", "#1C1C1C", "#C0C0C0"], "pieces": ["Magenta cocktail dress", "Onyx clutch", "Silver statement necklace"]},
        {"name": "Vivid Day", "occasion": "casual", "colors": ["#FFFFFF", "#00CED1", "#000000"], "pieces": ["White tee", "Turquoise jacket", "Black leggings"]},
        {"name": "Red Carpet", "occasion": "formal", "colors": ["#FF0000", "#000000", "#C0C0C0"], "pieces": ["True red gown", "Black heels", "Diamond earrings"]},
        {"name": "Color Pop", "occasion": "casual", "colors": ["#9400D3", "#FFFFFF", "#36454F"], "pieces": ["Violet sweater", "White jeans", "Charcoal boots"]},
    ],
    "fabrics": ["High-shine satin", "Patent leather", "Crisp poplin", "Structured silk", "Lacquer finish", "Metallic fabrics"],
    "patterns": ["Bold stripes (B&W)", "Color blocking", "Graphic prints", "Pop art", "Stark geometric"],
    "makeup": {
        "lips": [("#E00020", "True Red"), ("#D01080", "Hot Pink"), ("#B81060", "Fuchsia"), ("#C00040", "Cherry")],
        "eyes": [("#282830", "Jet"), ("#302840", "Deep Plum"), ("#182838", "Midnight"), ("#102828", "Dark Teal")],
        "blush": [("#E08090", "Vivid Pink"), ("#D07080", "Clear Rose"), ("#C86878", "Bright Berry")],
        "nails": [("#FF0000", "True Red"), ("#000000", "Black"), ("#FF00FF", "Magenta"), ("#0000FF", "True Blue")],
    },
    "metals": ["Silver", "Platinum", "Crystal", "White gold"],
},

}  # end SEASON_PALETTES


class ColorRecommender:
    """Generates clothing color recommendations based on seasonal type."""

    def recommend(self, sub_season: str) -> dict:
        """Generate full color recommendation for a seasonal type."""
        palette = SEASON_PALETTES.get(sub_season)

        if palette is None:
            for key in SEASON_PALETTES:
                if sub_season.split()[-1] in key:
                    palette = SEASON_PALETTES[key]
                    break

        if palette is None:
            palette = SEASON_PALETTES["Warm Spring"]

        # Build flat recommended list for backward compatibility
        all_colors = []
        category_map = {
            "tops": "accent", "bottoms": "neutral", "dresses": "statement",
            "outerwear": "neutral", "shoes": "neutral", "accessories": "metallic",
        }
        seen = set()
        for clothing_type, colors in palette["clothing"].items():
            for hex_val, name in colors:
                if hex_val not in seen:
                    seen.add(hex_val)
                    all_colors.append({
                        "hex": hex_val, "name": name,
                        "category": category_map.get(clothing_type, "accent"),
                    })

        # Clothing by type
        clothing = {}
        for ctype, colors in palette["clothing"].items():
            clothing[ctype] = [{"hex": h, "name": n} for h, n in colors]

        # Avoid with reasons
        avoid = [{"hex": h, "name": n, "reason": r} for h, n, r in palette["avoid"]]

        # Outfits
        outfits = palette["outfits"]

        # Generate tips
        tips = self._generate_tips(sub_season)

        return {
            "all_colors": all_colors,
            "clothing": clothing,
            "avoid": avoid,
            "outfits": outfits,
            "tips": tips,
            "fabrics": palette.get("fabrics", []),
            "patterns": palette.get("patterns", []),
            "makeup": palette.get("makeup", {}),
            "metals": palette.get("metals", []),
        }

    @staticmethod
    def _generate_tips(sub_season: str) -> List[str]:
        """Generate styling tips based on seasonal type."""
        season_base = sub_season.split()[-1]
        modifier = sub_season.split()[0]

        tips = []

        if season_base == "Spring":
            tips.append("Opt for warm metals like gold, brass, and copper in your jewelry.")
            tips.append("Choose fabrics with a natural sheen — silk, satin, and light cotton.")
            tips.append("Your makeup palette should lean toward peach, coral, and warm tones.")
            tips.append("White should be warm: ivory, cream, or off-white — not stark blue-white.")
            tips.append("Pair your colors with warm-toned denim in honey or warm indigo washes.")
        elif season_base == "Summer":
            tips.append("Silver, white gold, and platinum jewelry complement your cool undertones.")
            tips.append("Soft, flowing fabrics like chiffon and matte cotton suit you well.")
            tips.append("Choose rose, mauve, and cool pink tones for makeup.")
            tips.append("Your ideal white is soft or blue-white, not warm ivory.")
            tips.append("Cool-wash or gray-toned denim flatters you more than warm-wash denim.")
        elif season_base == "Autumn":
            tips.append("Rich metals — antique gold, bronze, and copper — enhance your warmth.")
            tips.append("Textured fabrics like suede, corduroy, and chunky knits are your allies.")
            tips.append("Earth-toned makeup with warm bronzers looks natural on you.")
            tips.append("Choose warm white tones: cream, ecru, antique white, or oatmeal.")
            tips.append("Your best denim is warm-wash, raw, or brown-toned — avoid cool gray denim.")
        elif season_base == "Winter":
            tips.append("Cool metals — silver, platinum, and white gold — amplify your contrast.")
            tips.append("Structured fabrics with clean lines — crisp cotton, leather, satin.")
            tips.append("Bold lip colors in berry, true red, or wine look striking on you.")
            tips.append("You are one of the few types who can wear pure black and stark white well.")
            tips.append("High-contrast outfits work better than monochromatic blending for you.")

        if modifier == "Light":
            tips.append("Keep your overall look light — avoid large areas of dark or heavy color.")
            tips.append("Your best contrast is between medium and light, not dark and light.")
        elif modifier == "Deep":
            tips.append("You can carry bold, rich colors that would overwhelm lighter types.")
            tips.append("Dark, saturated colors close to your face create a powerful look.")
        elif modifier == "Warm":
            tips.append("Stay within warm hues — even your neutrals should have a golden cast.")
            tips.append("Mix warm tones freely — golden with orange, rust with olive, etc.")
        elif modifier == "Cool":
            tips.append("Stick to blue-based and rosy tones; avoid anything with yellow warmth.")
            tips.append("Your neutral palette should lean toward gray and cool taupe, not beige.")
        elif modifier == "Clear":
            tips.append("Embrace contrast and saturation — clear, vivid colors are your power move.")
            tips.append("Avoid dusty, muted, or washed-out colors — they dull your natural vibrancy.")
        elif modifier == "Soft":
            tips.append("Blend tones softly — avoid sharp contrasts and overly bright colors.")
            tips.append("Layering similar muted tones creates your most flattering look.")

        return tips
