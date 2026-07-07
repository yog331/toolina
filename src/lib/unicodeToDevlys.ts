// unicodeToDevlys.ts
// Standard Unicode to Kruti Dev 010 (DevLys) conversion map

export const unicodeToDevlys = (text: string): string => {
  if (!text) return "";

  let modifiedText = text;

  // 1. Pre-process 'ि' (chhoti ee matra)
  // DevLys types it before the consonant, so we move it to the left.
  modifiedText = modifiedText.replace(/([क-हक़-ड़])\u093f/g, "\u093f$1");

  // 2. Pre-process 'र्' (half r / ra-ref)
  // DevLys places the ra-ref (Z) AFTER the consonant and any of its matras.
  modifiedText = modifiedText.replace(/र्([क-हक़-ड़][ािीुूृेैोौंँः]*?)/g, "$1Z");

  const mapping: { [key: string]: string } = {
    // Escapes / Punctuations
    '‘': "'", '’': "'", '“': '"', '”': '"',

    // Specific combined characters that should be evaluated early
    '\u0930\u094d\u0926\u094d\u0927': ')Z', // र्द्ध -> )Z
    'क़': 'क़', 'ख़': 'ख़', 'ग़': 'ग़', 'ज़': 'ज़', 'ड़': 'ड़', 'ढ़': 'ढ़', 'फ़': 'फ़',
    
    // Numbers
    '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', '०': '0',

    // Special exact matches (evaluated before half letters)
    'रू': ':', 'रु': '#', '्र': 'z', 'र्': 'Z',
    'क्ष': '{k', 'त्र': '«k', 'ज्ञ': 'K', 'श्र': 'J',
    'द्व': '}', 'द्य': '|', 'द्ध': ')', 'ट्र': 'Vª', 'ड्र': 'Mª',

    // Vowels
    'अ': 'v', 'आ': 'vk', 'इ': 'b', 'ई': 'bZ', 'उ': 'm', 'ऊ': 'mZ', 'ऋ': 'C',
    'ए': 'e', 'ऐ': 'eS', 'ओ': 'vks', 'औ': 'vkS', 'अं': 'va', 'अः': 'v%',

    // Consonants (full)
    'क': 'd', 'ख': '[k', 'ग': 'x', 'घ': '?k', 'ङ': '³',
    'च': 'p', 'छ': 'N', 'ज': 't', 'झ': '>', 'ञ': '¥',
    'ट': 'V', 'ठ': 'B', 'ड': 'M', 'ढ': '<', 'ण': '.k',
    'त': 'r', 'थ': 'Fk', 'द': 'n', 'ध': '/k', 'न': 'u',
    'प': 'i', 'फ': 'Q', 'ब': 'c', 'भ': 'Hk', 'म': 'e',
    'य': ';', 'र': 'j', 'ल': 'y', 'व': 'o', 'श': "'k", 'ष': '"k', 'स': 'l', 'ह': 'g',

    // Matras & modifiers
    'ा': 'k', 'ि': 'f', 'ी': 'h', 'ु': 'q', 'ू': 'w', 'ृ': '`',
    'े': 's', 'ै': 'S', 'ो': 'ks', 'ौ': 'kS', 'ं': 'a', 'ँ': '¡', 'ः': '%', '्': 'd', '़': '!',
    
    // Half consonants
    'क्क': 'Dd', 'ख्': '[', 'ग्': 'X', 'घ्': '?', 'च्': 'P', 'ज्': 'T', 'त्': 'R', 'थ्': 'F',
    'ध्': '/', 'न्': 'U', 'प्': 'I', 'फ्': '¶', 'ब्': 'C', 'भ्': 'H', 'म्': 'E', 'य्': '¸',
    'ल्': 'Y', 'व्': 'O', 'श्': "'", 'ष्': '"', 'स्': 'L'
  };

  // Convert mapping object to array of entries, sorting carefully:
  // We want specific conjuncts and special combinations to be processed first.
  const priorityKeys = ['रू', 'रु', '्र', 'र्', 'क्ष', 'त्र', 'ज्ञ', 'श्र', 'द्व', 'द्य', 'द्ध', 'ट्र', 'ड्र'];
  
  const entries = Object.entries(mapping).sort((a, b) => {
    // 1. High priority keys first
    const aPriority = priorityKeys.includes(a[0]);
    const bPriority = priorityKeys.includes(b[0]);
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    
    // 2. Then by length descending (to catch full match before substring match, e.g., 'क्क' before 'क')
    return b[0].length - a[0].length;
  });

  // Apply transformations
  for (const [unicode, devlys] of entries) {
    modifiedText = modifiedText.split(unicode).join(devlys);
  }

  // Cleanup stray devlys placeholders if needed (legacy behavior)
  modifiedText = modifiedText.replace(/d/g, "d"); 

  return modifiedText;
};
