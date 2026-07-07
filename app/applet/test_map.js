const fs = require('fs');

const mapping = {
  '‘': "'", '’': "'", '“': '"', '”': '"',
  '\u0930\u094d\u0926\u094d\u0927': ')Z',
  'क़': 'क़', 'ख़': 'ख़', 'ग़': 'ग़', 'ज़': 'ज़', 'ड़': 'ड़', 'ढ़': 'ढ़', 'फ़': 'फ़',
  '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', '०': '0',
  'रू': ':', 'रु': '#',
  'अ': 'v', 'आ': 'vk', 'इ': 'b', 'ई': 'bZ', 'उ': 'm', 'ऊ': 'mZ', 'ऋ': 'C',
  'ए': 'e', 'ऐ': 'eS', 'ओ': 'vks', 'औ': 'vkS', 'अं': 'va', 'अः': 'v%',
  'क': 'd', 'ख': '[k', 'ग': 'x', 'घ': '?k', 'ङ': '³',
  'च': 'p', 'छ': 'N', 'ज': 't', 'झ': '>', 'ञ': '¥',
  'ट': 'V', 'ठ': 'B', 'ड': 'M', 'ढ': '<', 'ण': '.k',
  'त': 'r', 'थ': 'Fk', 'द': 'n', 'ध': '/k', 'न': 'u',
  'प': 'i', 'फ': 'Q', 'ब': 'c', 'भ': 'Hk', 'म': 'e',
  'य': ';', 'र': 'j', 'ल': 'y', 'व': 'o', 'श': "'k", 'ष': '"k', 'स': 'l', 'ह': 'g',
  'ा': 'k', 'ि': 'f', 'ी': 'h', 'ु': 'q', 'ू': 'w', 'ृ': '`',
  'े': 's', 'ै': 'S', 'ो': 'ks', 'ौ': 'kS', 'ं': 'a', 'ँ': '¡', 'ः': '%', '्': 'd', '़': '!',
  'क्ष': '{k', 'त्र': '«k', 'ज्ञ': 'K', 'श्र': 'J',
  'क्क': 'Dd', 'ख्': '[', 'ग्': 'X', 'घ्': '?', 'च': 'P', 'ज्': 'T', 'त्': 'R', 'थ्': 'F',
  'ध्': '/', 'न्': 'U', 'प्': 'I', 'फ्': '¶', 'ब्': 'C', 'भ्': 'H', 'म्': 'E', 'य्': '¸',
  'ल्': 'Y', 'व्': 'O', 'श्': "'", 'ष्': '"', 'स्': 'L',
  '्र': 'Z', 'र्': 'Z'
};

const entries = Object.entries(mapping).sort((a,b) => b[0].length - a[0].length);

function convert(text) {
  let modifiedText = text;
  // Move 'ि' (chhoti ee)
  modifiedText = modifiedText.replace(/([क-हक़-ड़])\u093f/g, "\u093f$1");
  // Move 'र्' (half r) to after the consonant and its matras
  modifiedText = modifiedText.replace(/र्([क-हक़-ड़][ािीुूृेैोौंँः]*?)/g, "$1Z");
  
  for (const [unicode, devlys] of entries) {
    modifiedText = modifiedText.split(unicode).join(devlys);
  }
  return modifiedText;
}

console.log("Expected: esa Vkbi djuk 'kq: djsa ;k viuh");
console.log("Actual  :", convert('में टाइप करना शुरू करें या अपनी'));
console.log("धर्म:", convert('धर्म'));
console.log("प्रकार:", convert('प्रकार'));

