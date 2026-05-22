/* ==========================================================================
   AOB Speakeasy — random oda adları + gizli takma adlar
   Listeleri serbestçe düzenle. Upstream'de olmayan dosya → çakışmasız.
   - aobRandomRoom():  oda adı  (örn. "TipsyBathtub4821")
   - aobSecretName():  komik gizli takma ad (örn. "Bugsy the Whisper")
   ========================================================================== */

/* ---- Oda adları: şık + komik karışık (speakeasy / prohibition vibe) ---- */
const AOB_ROOM_ADJECTIVES = [
    // şık
    'Velvet', 'Midnight', 'Golden', 'Secret', 'Hidden', 'Smoky', 'Jazz',
    'Crimson', 'Whisper', 'Gilded', 'Amber', 'Moonlit', 'Silk', 'Noir',
    // komik
    'Tipsy', 'Sneaky', 'Bootleg', 'Wobbly', 'Sloshed', 'Shady', 'Giggling',
    'Rowdy', 'Cheeky', 'Boozy', 'Dapper', 'Greasy',
];

const AOB_ROOM_NOUNS = [
    // şık
    'Lounge', 'Parlor', 'Speakeasy', 'Cellar', 'Booth', 'Den', 'Club',
    'Corner', 'Hideout', 'Saloon', 'Vault', 'Gallery', 'Alcove',
    // komik
    'Bathtub', 'Racket', 'Hooch', 'Jalopy', 'Shindig', 'Ruckus', 'Caper',
    'Stash', 'Flapper', 'Gizmo', 'Bamboozle',
];

function aobRandomRoom() {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const num = Math.floor(1000 + Math.random() * 9000); // 4 hane (çakışmayı azaltır)
    return `${pick(AOB_ROOM_ADJECTIVES)}${pick(AOB_ROOM_NOUNS)}${num}`;
}

/* ---- Gizli takma adlar: komik speakeasy karakterleri ---- */
const AOB_ALIAS_FIRST = [
    'Bugsy', 'Vinny', 'Lefty', 'Slim', 'Knuckles', 'Dutch', 'Fingers',
    'Babyface', 'Lucky', 'Moe', 'Rocco', 'Whisper', 'Mable', 'Pearl',
    'Rosie', 'Vera', 'Gins', 'Sticky', 'Tiny', 'Big',
];
const AOB_ALIAS_TAG = [
    'the Whisper', 'the Bartender', 'Two-Times', 'the Phantom', 'Martini',
    'the Mouth', 'No-Name', 'the Ghost', 'the Lush', 'Bootlegs',
    'the Crooner', 'Jazz Hands', 'Slick', 'the Shadow', 'Highball',
    'the Tab', 'Last-Call', 'the Mystery', 'Nobody', 'the Regular',
];

function aobSecretName() {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `${pick(AOB_ALIAS_FIRST)} ${pick(AOB_ALIAS_TAG)}`;
}
