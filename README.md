# Toolina - All-In-One Web Tools

Toolina is a modern, fast, and privacy-first collection of everyday web tools. Designed for professionals and casual users alike, it offers a wide array of utilities—ranging from calculators and formatters to PDF manipulators and developers' tools.

🌐 **Live Application:** [https://toolina.in](https://toolina.in)

## Features

- **Privacy-First (Client-Side Processing)**: Most tools operate entirely within your browser. Your data is not sent to external servers, ensuring maximum privacy and security.
- **Modern & Fast User Interface**: Built with React and styled with Tailwind CSS, offering a clean, responsive, and intuitive experience across desktop, tablet, and mobile devices.
- **Categorized Dashboard**: Tools are cleanly grouped into categories making it easy to find what you need.

## Available Tools

Here is the complete suite of tools available on Toolina:

### Government Utility Tools
- [**Rajasthan Govt Salary Calculator**](https://toolina.in/raj-salary) - Professional salary audit for Rajasthan state employees based on 7th CPC Revised Pay Rules 2017. *(📱 Also available as a [Mobile App on Google Play](https://play.google.com/store/apps/details?id=com.yogicalculator.rajsalpro))*
- [**Central Govt Salary Calculator**](https://toolina.in/central-salary) - Precision pay finder for Central Government staff featuring DA, HRA, and TPTA calculations.
- [**NPS Calculator**](https://toolina.in/nps-calc) - Estimate your National Pension System corpus and monthly pension with high-precision maturity audit.
- [**7th Pay Matrix (Central)**](https://toolina.in/7th-pay-matrix-central) - Interactive 7th CPC matrix for Central Govt employees to verify pay levels, cells, and annual increments.
- [**7th Pay Matrix (Rajasthan)**](https://toolina.in/7th-pay-matrix-rajasthan) - Complete L-1 to L-24 pay matrix for Rajasthan Govt employees with official 3% annual increment audit.
- [**Rajasthan Govt Calendar**](https://toolina.in/raj-calendar) - Official Rajasthan state holiday list featuring Gazetted, Restricted, and upcoming Long Weekend planners.
- [**Rajasthan Sale Deed Calculator**](https://toolina.in/raj-sale-deed) - Calculate property sale deed registry charges, stamp duty, and cesses based on Rajasthan jurisdiction.
- [**Rajasthan Gift Deed Calculator**](https://toolina.in/raj-gift-deed) - Calculate Rajasthan Gift Deed stamp duty and registration fees for family and non-family members.
- [**Rajasthan Lease Deed Calculator**](https://toolina.in/raj-lease-deed) - Calculate exact stamp duty and registration fees for Lease Deeds and Rent Agreements in Rajasthan.

### Financial Utility Calculators
- [**EMI Calculator**](https://toolina.in/emi-calc) - Calculate monthly loan repayments, total interest, and view detailed amortization schedules for Home, Car, or Personal loans.
- [**Income Tax Calculator**](https://toolina.in/income-tax-calc) - Calculate your income tax liability under Old vs New Regime for FY 2024-25 and FY 2025-26.

### Health Calculators
- [**BMI Calculator**](https://toolina.in/bmi-calc) - Instant Body Mass Index assessment with WHO health categories, ideal weight ranges, and status breakdown.

### File, PDF & Image Tools
- [**PDF to Image Converter**](https://toolina.in/pdf-to-image) - Convert PDF document pages into high-quality JPG or PNG images instantly in your browser.
- [**Image to PDF**](https://toolina.in/image-to-pdf) - Quickly convert and combine multiple JPG, PNG, or WebP images into a single professional PDF document.
- [**Merge PDF**](https://toolina.in/merge-pdf) - Combine multiple PDF files into one single document securely in your browser without uploading.
- [**Split PDF**](https://toolina.in/split-pdf) - Extract pages from your PDF or split a large PDF into multiple smaller files securely offline.
- [**Compress PDF**](https://toolina.in/compress-pdf) - Reduce PDF file size securely offline without uploading.
- [**Remove PDF Pages**](https://toolina.in/remove-pdf-pages) - Delete specific pages from a PDF document securely offline.
- [**Add Text Watermark to PDF**](https://toolina.in/add-pdf-watermark) - Add a custom text watermark to your PDF document securely offline.
- [**Image Converter & Resizer**](https://toolina.in/img-conv) - Batch photo resizer and format converter optimized for govt forms (Passport size) and web performance.

### Developer & Technical Utilities
- [**URL Indexing Tool**](https://toolina.in/url-indexing) - Bulk submit URLs directly to Google Search Console via Indexing API from your browser.
- [**CSV to JSON Converter**](https://toolina.in/csv-json) - Developer-grade bulk CSV to JSON transformer. High-performance, private, and 100% browser-based.

### General Utility Tools
- [**Age Calculator**](https://toolina.in/age-calc) - Precise chronological age finder for government job applications (SSO/UPSC/SSC) and personal milestones.
- [**Utility Bill Calculator**](https://toolina.in/utility-bill) - Tiered slab calculator for electricity, water, and gas bills with detailed tax and fixed charge audit.
- [**DevLys to Unicode Converter**](https://toolina.in/devlys-unicode) - Professional Hindi font converter. Transform DevLys 010 legacy text to standard Unicode (Mangal) instantly.
- [**QR Code Generator**](https://toolina.in/qr-gen) - Secure, tracking-free QR generator for WiFi, URLs, and business contacts with professional PNG export.
- [**Solar Cost Calculator**](https://toolina.in/solar-calc) - Calculate Rooftop Solar ROI, PM Surya Ghar subsidy, and payback period with precision using this solar cost calculator for Indian homes.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository or download the source code.
2. Navigate into the project directory:
   ```bash
   cd toolina
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The compiled assets will be available in the `dist` directory. You can preview the production build using:

```bash
npm run start
```
(If a start script is configured, otherwise you can serve the `dist` directory using a static file server).

## Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Icons:** Lucide React
- **Routing:** React Router DOM

## Adding a New Tool

1. Create a new component in the `tools/` directory (e.g., `tools/MyNewTool.tsx`).
2. Include the `AccompanyingText`, `StarRatingWidget`, and `ShareWidget` components if applicable.
3. Import and add your new tool to the routing system in `App.tsx`.
4. Register your tool in the `tools` array inside `constants.tsx` to make it appear on the dashboard.

## License

This project is open-source and free to use.
