import fs from 'fs';

const files = [
  'tools/PDFToImage.tsx',
  'tools/ImageToPDF.tsx',
  'tools/MergePDF.tsx',
  'tools/SplitPDF.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Fixed escaped backticks');
