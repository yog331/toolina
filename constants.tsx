
import React from 'react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'raj-salary',
    name: 'Rajasthan Govt Salary',
    description: 'Professional salary audit for Rajasthan state employees based on 7th CPC Revised Pay Rules 2017.',
    icon: '🏰',
    category: 'Govt',
    path: '/rajasthan-government-salary-calculator',
    isNew: false
  },
  {
    id: 'central-salary',
    name: 'Central Govt Salary',
    description: 'Precision pay finder for Central Government staff featuring DA, HRA, and TPTA calculations.',
    icon: '🏛️',
    category: 'Govt',
    path: '/central-government-salary-calculator',
    isNew: false
  },
  {
    id: 'devlys-unicode',
    name: 'DevLys to Unicode',
    description: 'Professional Hindi font converter. Transform DevLys 010 legacy text to standard Unicode (Mangal) instantly.',
    icon: '⌨️',
    category: 'Utility',
    path: '/devlys-to-unicode-hindi-font-converter',
    isNew: false
  },
  {
    id: 'emi-calc',
    name: 'EMI Calculator',
    description: 'Calculate monthly loan repayments, total interest, and view detailed amortization schedules for Home, Car, or Personal loans.',
    icon: '💳',
    category: 'Utility',
    path: '/loan-emi-calculator-amortization',
    isNew: false
  },
  {
    id: 'nps-calc',
    name: 'NPS Calculator',
    description: 'Estimate your National Pension System corpus and monthly pension with high-precision maturity audit.',
    icon: '🏦',
    category: 'Govt',
    path: '/national-pension-scheme-nps-calculator',
    isNew: false
  },
  {
    id: 'pay-matrix-central',
    name: '7th Pay Matrix (Central)',
    description: 'Interactive 7th CPC matrix for Central Govt employees to verify pay levels, cells, and annual increments.',
    icon: '📊',
    category: 'Govt',
    path: '/7th-pay-matrix-central-government',
    isNew: false
  },
  {
    id: 'pay-matrix-raj',
    name: '7th Pay Matrix (Raj)',
    description: 'Complete L-1 to L-24 pay matrix for Rajasthan Govt employees with official 3% annual increment audit.',
    icon: '📈',
    category: 'Govt',
    path: '/7th-pay-matrix-rajasthan-government',
    isNew: false
  },
  {
    id: 'income-tax-calc',
    name: 'Income Tax Calculator',
    description: 'Calculate your income tax liability under Old vs New Regime for FY 2024-25 and FY 2025-26.',
    icon: '🧾',
    category: 'Utility',
    path: '/income-tax-calculator-new-old-regime',
    isNew: true
  },
  {
    id: 'age-calc',
    name: 'Age Calculator',
    description: 'Precise chronological age finder for government job applications (SSO/UPSC/SSC) and personal milestones.',
    icon: '🎂',
    category: 'Utility',
    path: '/chronological-age-calculator',
    isNew: false
  },
  {
    id: 'bmi-calc',
    name: 'BMI Calculator',
    description: 'Instant Body Mass Index assessment with WHO health categories, ideal weight ranges, and status breakdown.',
    icon: '🏃',
    category: 'Health',
    path: '/body-mass-index-bmi-calculator',
    isNew: false
  },
  {
    id: 'utility-bill',
    name: 'Utility Bill Calculator',
    description: 'Tiered slab calculator for electricity, water, and gas bills with detailed tax and fixed charge audit.',
    icon: '💡',
    category: 'Utility',
    path: '/electricity-water-utility-bill-calculator',
    isNew: false
  },
  {
    id: 'qr-gen',
    name: 'QR Code Generator',
    description: 'Secure, tracking-free QR generator for WiFi, URLs, and business contacts with professional PNG export.',
    icon: '📱',
    category: 'Utility',
    path: '/qr-code-generator',
    isNew: false
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Detailed real-time word, character, sentence, paragraph, and readability analysis with full SEO keyword density reports.',
    icon: '📝',
    category: 'Utility',
    path: '/online-word-counter',
    isNew: true
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    description: 'Create high-density linear standard barcodes (CODE128, CODE39, EAN-13) in single or massive bulk packages offline.',
    icon: '🏷️',
    category: 'Utility',
    path: '/barcode-generator',
    isNew: true
  },
  {
    id: 'url-indexing',
    name: 'URL Indexing',
    description: 'Bulk submit URLs directly to Google Search Console via Indexing API from your browser.',
    icon: '⚡',
    category: 'Developer',
    path: '/google-indexing-api-bulk-submitter',
    isNew: true
  },
  {
    id: 'csv-json',
    name: 'CSV to JSON',
    description: 'Developer-grade bulk CSV to JSON transformer. High-performance, private, and 100% browser-based.',
    icon: '⚙️',
    category: 'Developer',
    path: '/csv-to-json-converter',
    isNew: true
  },
  {
    id: 'solar-calc',
    name: 'Solar Cost Calculator',
    description: 'Calculate Rooftop Solar ROI, PM Surya Ghar subsidy, and payback period with precision using this solar cost calculator for Indian homes.',
    icon: '☀️',
    category: 'Utility',
    path: '/rooftop-solar-subsidy-calculator',
    isNew: true
  },
  {
    id: 'img-conv',
    name: 'Image Converter',
    description: 'Batch photo resizer and format converter optimized for govt forms (Passport size) and web performance.',
    icon: '🖼️',
    category: 'Utility',
    path: '/passport-photo-image-converter-resizer',
    isNew: false
  },
  {
    id: 'raj-calendar',
    name: 'Rajasthan Govt Calendar',
    description: 'Official Rajasthan state holiday list featuring Gazetted, Restricted, and upcoming Long Weekend planners.',
    icon: '🗓️',
    category: 'Govt',
    path: '/rajasthan-government-holiday-calendar',
    isNew: false
  },
  {
    id: 'raj-sale-deed',
    name: 'Raj. Sale Deed Calculator',
    description: 'Calculate property sale deed registry charges, stamp duty, and cesses based on Rajasthan jurisdiction.',
    icon: '🧾',
    category: 'Govt',
    path: '/rajasthan-property-sale-deed-calculator',
    isNew: true
  },
  {
    id: 'raj-gift-deed',
    name: 'Raj. Gift Deed Calculator',
    description: 'Estimate gift deed stamp duty with family member concessions and registration fees for Rajasthan state.',
    icon: '🎁',
    category: 'Govt',
    path: '/rajasthan-property-gift-deed-calculator',
    isNew: true
  },
  {
    id: 'raj-lease-deed',
    name: 'Raj. Lease Deed Calculator',
    description: 'Calculate exact stamp duty and registration fees for Lease Deeds and Rent Agreements.',
    icon: '🏢',
    category: 'Govt',
    path: '/rajasthan-lease-deed-stamp-duty-calculator',
    isNew: true
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF document pages into high-quality JPG or PNG images instantly in your browser.',
    icon: '📄',
    category: 'PDF Tools',
    path: '/pdf-to-image-high-quality-converter',
    isNew: true
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Quickly convert and combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    icon: '🖼️',
    category: 'PDF Tools',
    path: '/image-to-pdf-combine-converter',
    isNew: true
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document securely in your browser without uploading.',
    icon: '📑',
    category: 'PDF Tools',
    path: '/merge-pdf-combine-documents',
    isNew: true
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your PDF or split a large PDF into multiple smaller files securely offline.',
    icon: '✂️',
    category: 'PDF Tools',
    path: '/split-pdf-extract-pages',
    isNew: true
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size securely offline without uploading.',
    icon: '🗜️',
    category: 'PDF Tools',
    path: '/compress-pdf-reduce-file-size',
    isNew: true
  },
  {
    id: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    description: 'Delete specific pages from a PDF document securely offline.',
    icon: '🗑️',
    category: 'PDF Tools',
    path: '/remove-pdf-pages-delete-securely',
    isNew: true
  },
  {
    id: 'add-pdf-watermark',
    name: 'Add Text Watermark',
    description: 'Add a custom text watermark to your PDF document securely offline.',
    icon: '©️',
    category: 'PDF Tools',
    path: '/add-watermark-to-pdf-online',
    isNew: true
  }
];
