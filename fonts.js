/**
 * FONTX — Unicode Style Engine (300+ Unique Transformers)
 * Lightweight, zero-dependency local text generator
 */

const FONTX_ENGINE = (function() {

  function mapOffset(text, capitalStart, lowerStart, numberStart = null) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 65 && code <= 90 && capitalStart !== null) {
        result += String.fromCodePoint(capitalStart + (code - 65));
      } else if (code >= 97 && code <= 122 && lowerStart !== null) {
        result += String.fromCodePoint(lowerStart + (code - 97));
      } else if (code >= 48 && code <= 57 && numberStart !== null) {
        result += String.fromCodePoint(numberStart + (code - 48));
      } else {
        result += text[i];
      }
    }
    return result;
  }

  const SMALL_CAPS_MAP = {
    'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ',
    'n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'
  };

  const CIRCLED_MAP = {
    'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ',
    'N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ',
    'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ',
    'n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'⓯','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ',
    '0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'
  };

  const NEGATIVE_CIRCLED_MAP = {
    'A':'🅐','B':'🅑','C':'🅒','D':'🅓','E':'🅔','F':'🅕','G':'🅖','H':'🅗','I':'🅘','J':'🅙','K':'🅚','L':'🅛','M':'🅜',
    'N':'🅝','O':'🅞','P':'🅟','Q':'🅠','R':'🅡','S':'🅢','T':'𝅵','U':'🅤','V':'🅥','W':'🅦','X':'🅧','Y':'🅨','Z':'🅩',
    'a':'🅐','b':'🅑','c':'🅒','d':'🅓','e':'🅔','f':'🅕','g':'🅖','h':'🅗','i':'🅘','j':'🅙','k':'🅚','l':'🅛','m':'🅜',
    'n':'🅝','o':'🅞','p':'🅟','q':'🅠','r':'🅡','s':'🅢','t':'🅣','u':'🅤','v':'🅥','w':'🅦','x':'🅧','y':'🅨','z':'🅩',
    '0':'⓿','1':'❶','2':'❷','3':'❸','4':'❹','5':'❺','6':'❻','7':'❼','8':'❽','9':'❾'
  };

  const SQUARED_MAP = {
    'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄷','H':'🄸','I':'🄹','J':'🄺','K':'🄻','L':'🄼','M':'🄽',
    'N':'🄾','O':'🄿','P':'🅀','Q':'🅁','R':'🅂','S':'🅃','T':'🅄','U':'🅅','V':'🅆','W':'🅇','X':'🅈','Y':'🅯','Z':'🅰',
    'a':'🄰','b':'🄱','c':'🄲','d':'🄳','e':'🄴','f':'🄵','g':'🄷','h':'🄸','i':'🄹','j':'🄺','k':'🄻','l':'🄼','m':'🄽',
    'n':'🄾','o':'🄿','p':'🅀','q':'🅁','r':'🅂','s':'🅃','t':'🅄','u':'🅅','v':'🅆','w':'🅇','x':'🅈','y':'🅯','z':'🅰'
  };

  const FULLWIDTH_MAP = {
    '0':'０','1':'１','2':'２','3':'３','4':'４','5':'５','6':'６','7':'７','8':'８','9':'９',
    'A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ',
    'N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ',
    'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ',
    'n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ'
  };

  function applyCombiningMark(text, markChar) {
    return text.split('').map(c => c + markChar).join('');
  }

  function applyCustomMap(text, mapObj) {
    return text.split('').map(c => mapObj[c] || mapObj[c.toLowerCase()] || c).join('');
  }

  const BASE_TRANSFORMS = [
    { name: "SANS BOLD", fn: t => mapOffset(t, 0x1D5D4, 0x1D5EE, 0x1D7EC) },
    { name: "SANS ITALIC", fn: t => mapOffset(t, 0x1D608, 0x1D622, null) },
    { name: "SANS BOLD ITALIC", fn: t => mapOffset(t, 0x1D63C, 0x1D656, null) },
    { name: "SERIF BOLD", fn: t => mapOffset(t, 0x1D400, 0x1D41A, 0x1D7CE) },
    { name: "SERIF ITALIC", fn: t => mapOffset(t, 0x1D434, 0x1D44E, null) },
    { name: "SERIF BOLD ITALIC", fn: t => mapOffset(t, 0x1D468, 0x1D482, null) },
    { name: "MONOSPACE", fn: t => mapOffset(t, 0x1D670, 0x1D68A, 0x1D7F6) },
    { name: "DOUBLE STRUCK", fn: t => mapOffset(t, 0x1D538, 0x1D552, 0x1D7D8) },
    { name: "FRAKTUR BOLD", fn: t => mapOffset(t, 0x1D56C, 0x1D586, null) },
    { name: "SCRIPT BOLD", fn: t => mapOffset(t, 0x1D4D0, 0x1D4EA, null) },
    { name: "SMALL CAPS", fn: t => applyCustomMap(t, SMALL_CAPS_MAP) },
    { name: "FULLWIDTH", fn: t => applyCustomMap(t, FULLWIDTH_MAP) },
    { name: "CIRCLED", fn: t => applyCustomMap(t, CIRCLED_MAP) },
    { name: "NEGATIVE CIRCLED", fn: t => applyCustomMap(t, NEGATIVE_CIRCLED_MAP) },
    { name: "SQUARED", fn: t => applyCustomMap(t, SQUARED_MAP) },
    { name: "UNDERLINE", fn: t => applyCombiningMark(t, '\u0332') },
    { name: "DOUBLE UNDERLINE", fn: t => applyCombiningMark(t, '\u0333') },
    { name: "STRIKETHROUGH", fn: t => applyCombiningMark(t, '\u0336') },
    { name: "SLASH THROUGH", fn: t => applyCombiningMark(t, '\u0338') },
    { name: "OVERLINE", fn: t => applyCombiningMark(t, '\u0305') },
    { name: "DOT ABOVE", fn: t => applyCombiningMark(t, '\u0307') },
    { name: "RING ABOVE", fn: t => applyCombiningMark(t, '\u030A') },
    { name: "TILDE ABOVE", fn: t => applyCombiningMark(t, '\u0303') },
    { name: "WIDE SPACED", fn: t => t.split('').join(' ') },
    { name: "ULTRA WIDE", fn: t => t.split('').join('  ') }
  ];

  const DECORATIVE_PATTERNS = [
    { prefix: "『", suffix: "』", tag: "JAPANESE FRAME" },
    { prefix: "「", suffix: "」", tag: "CORNER BRACKETS" },
    { prefix: "【", suffix: "】", tag: "BLACK LENTICULAR" },
    { prefix: "《", suffix: "》", tag: "DOUBLE ANGLE" },
    { prefix: "〈", suffix: "〉", tag: "SINGLE ANGLE" },
    { prefix: "꧁", suffix: "꧂", tag: "SWIRL DECORATION" },
    { prefix: "༺", suffix: "༻", tag: "WINGED FRAME" },
    { prefix: "✦ ", suffix: " ✦", tag: "FOUR STAR" },
    { prefix: "★ ", suffix: " ★", tag: "BLACK STAR" },
    { prefix: "☆ ", suffix: " ☆", tag: "WHITE STAR" },
    { prefix: "亗 ", suffix: " 亗", tag: "BOSS CROWN" },
    { prefix: "乂 ", suffix: " 乂", tag: "CROSS MARK" },
    { prefix: "メ ", suffix: " メ", tag: "KATAKANA ME" },
    { prefix: "⚡ ", suffix: " ⚡", tag: "LIGHTNING" },
    { prefix: "☾ ", suffix: " ☽", tag: "CRESCENT MOON" },
    { prefix: "♡ ", suffix: " ♡", tag: "HEART EMBLEM" },
    { prefix: "♥ ", suffix: " ♥", tag: "SOLID HEART" },
    { prefix: "☠ ", suffix: " ☠", tag: "SKULL DANGER" },
    { prefix: "⚔ ", suffix: " ⚔", tag: "DUEL SWORDS" },
    { prefix: "☯ ", suffix: " ☯", tag: "YIN YANG" },
    { prefix: "❖ ", suffix: " ❖", tag: "DIAMOND FLOWER" },
    { prefix: "✿ ", suffix: " ✿", tag: "CHERRY BLOSSOM" },
    { prefix: "♛ ", suffix: " ♛", tag: "QUEEN CROWN" },
    { prefix: "♔ ", suffix: " ♔", tag: "KING CROWN" },
    { prefix: "꧁⚔ ", suffix: " ⚔꧂", tag: "SWORD LEGEND" },
    { prefix: "꧁亗 ", suffix: " 亗꧂", tag: "ROYAL BOSS" },
    { prefix: "꧁⚡ ", suffix: " ⚡꧂", tag: "THUNDER KING" },
    { prefix: "┊ ", suffix: " ┊", tag: "VERTICAL DASH" },
    { prefix: "░▒▓ ", suffix: " ▓▒░", tag: "SHADE BLOCKS" },
    { prefix: "◢ ", suffix: " ◣", tag: "TRIANGLE WINGS" },
    { prefix: "◆ ", suffix: " ◆", tag: "SOLID DIAMOND" },
    { prefix: "◈ ", suffix: " ◈", tag: "TARGET DIAMOND" },
    { prefix: "◯ ", suffix: " ◯", tag: "LARGE CIRCLE" },
    { prefix: "⚜ ", suffix: " ⚜", tag: "FLEUR DE LIS" },
    { prefix: "𓆩 ", suffix: " 𓆪", tag: "EGYPTIAN WINGS" },
    { prefix: "𓆩♥𓆪 ", suffix: " 𓆩♥𓆪", tag: "WINGED HEART" },
    { prefix: "︻╦╤─ ", suffix: "", tag: "AK47 STYLE" },
    { prefix: "✨ ", suffix: " ✨", tag: "SPARKLES" },
    { prefix: "🔥 ", suffix: " 🔥", tag: "FIRE POWER" },
    { prefix: "💎 ", suffix: " 💎", tag: "DIAMOND GEM" },
    { prefix: "👑 ", suffix: " 👑", tag: "ROYAL CROWN" },
    { prefix: "☣ ", suffix: " ☣", tag: "BIOHAZARD" },
    { prefix: "🧿 ", suffix: " 🧿", tag: "EVIL EYE" },
    { prefix: "༒ ", suffix: " ༒", tag: "TIBETAN CROSS" }
  ];

  function generateStyles(inputText) {
    if (!inputText || inputText.trim() === '') return [];

    const cleanText = inputText.trim();
    const results = [];
    const seen = new Set();

    function addResult(styledText, tag) {
      if (!styledText || seen.has(styledText)) return;
      seen.add(styledText);
      results.push({
        id: results.length + 1,
        text: styledText,
        tag: tag || "STYLE " + String(results.length + 1).padStart(3, '0')
      });
    }

    addResult(cleanText, "ORIGINAL RAW");

    const coreTransformed = [];
    BASE_TRANSFORMS.forEach(tf => {
      const transformed = tf.fn(cleanText);
      addResult(transformed, tf.name);
      coreTransformed.push(transformed);
    });

    DECORATIVE_PATTERNS.forEach((dec) => {
      addResult(`${dec.prefix}${cleanText}${dec.suffix}`, dec.tag);
    });

    const keyTransforms = [
      { text: BASE_TRANSFORMS[0].fn(cleanText), name: "SANS BOLD" },
      { text: BASE_TRANSFORMS[3].fn(cleanText), name: "SERIF BOLD" },
      { text: BASE_TRANSFORMS[10].fn(cleanText), name: "SMALL CAPS" },
      { text: BASE_TRANSFORMS[11].fn(cleanText), name: "FULLWIDTH" }
    ];

    keyTransforms.forEach(kt => {
      DECORATIVE_PATTERNS.forEach(dec => {
        addResult(`${dec.prefix}${kt.text}${dec.suffix}`, `${kt.name} / ${dec.tag}`);
      });
    });

    if (results.length < 350) {
      const extraSymbols = ["★", "⚡", "✦", "亗", "乂", "👑", "🔥", "💎", "🎯", "☠"];
      extraSymbols.forEach(sym => {
        coreTransformed.forEach((ct, idx) => {
          if (results.length < 380) {
            addResult(`${sym} ${ct} ${sym}`, `SYMBOL / ${BASE_TRANSFORMS[idx % BASE_TRANSFORMS.length].name}`);
          }
        });
      });
    }

    return results;
  }

  return { generate: generateStyles };
})();
      
