# Event Bazar

Event Bazar is a React-based event marketplace demo for browsing decor products, rental and sale options, WhatsApp enquiry flows, and generated quotation PDFs for event planning.

![React](https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3?logo=bootstrap&logoColor=white)
![Redux](https://img.shields.io/badge/State-Redux-764abc?logo=redux&logoColor=white)
![jsPDF](https://img.shields.io/badge/PDF-jsPDF-FF5E5B)

## Overview

This project is designed as a front-end showcase for an event decor marketplace. It includes:

- storefront browsing with product cards and category filters
- detailed product pages with sale and rental pricing
- WhatsApp enquiry generation with product and location details
- quotation PDF generation for product inquiries
- admin control panel for products, locations, gallery content, reviews, and sample users
- browser-local persistence for demo data

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── admin/
│   ├── components/
│   ├── data/
│   ├── landing/
│   ├── redux/
│   ├── shared/
│   ├── index.js
│   └── App.js
├── package.json
├── README.md
└── .gitignore
```

## Tech Stack

- React 18
- Create React App
- React Router DOM
- Redux + Redux Toolkit
- Bootstrap 5
- Font Awesome
- jsPDF for quotation generation
- LocalStorage for demo data persistence
- Google Fonts: Cormorant Garamond and DM Sans

## Prerequisites

Before running this project, make sure you have the following installed on your machine:

- Node.js 18+
- npm 9+
- Git

## Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/UdaykiranDev/eventbazar.git
cd eventbazar
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

4. Open the app in the browser

```text
http://localhost:3000
```

## Production Build

To create a production build:

```bash
npm run build
```

The build output is generated in the `build/` folder.

## Deploy to GitHub Pages

This repository is configured to deploy automatically to GitHub Pages whenever changes are pushed to `main`. The deployment workflow builds the app and publishes the `build/` folder.

1. Push your changes to the `main` branch:

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

2. In GitHub, open **Settings → Pages** for this repository and set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish.
4. Visit [https://udaykirandev.github.io/eventbazar/](https://udaykirandev.github.io/eventbazar/).

Routes use URL fragments (for example, `/#/product`) so app pages continue to work when opened or refreshed on GitHub Pages.

## App Features

### Storefront
- Browse products by category and service type
- Search and filter products by location, category, and sales/rental options
- View detailed product information
- View sample reviews and ratings per product
- Download PDF quotation for a selected product
- Enquire on WhatsApp with product details prefilled

### Admin Panel
- Manage product catalog entries
- Add, update, and delete categories
- Add and manage locations
- Manage gallery entries
- Manage reviews and sample customer feedback
- Manage sample users for UI demonstration

### Data Storage
The application currently stores data in browser localStorage for demo purposes. This means:

- catalog changes persist locally in the browser
- reviews, gallery items, locations, and users are saved in local storage
- data is not connected to a backend database by default

## WhatsApp and PDF Flow

The application creates a quotation PDF using jsPDF. The generated invoice/quote file can be downloaded locally and shared through supported mobile devices.

Important note:

- WhatsApp Web cannot automatically attach a local file from a website to a chat.
- In the browser, the PDF is downloaded first and then users can attach it manually in WhatsApp from the device or desktop client.
- For automatic file upload or server-side WhatsApp messaging, a backend such as WhatsApp Business API would be required.

## Future Reference Notes

This project is a front-end demo and not a full production backend system. It is ideal for:

- design exploration
- marketplace UI concept validation
- product catalog and inquiry flow prototypes
- event company showcase frontend demos

## Notes for Contributors

- keep UI updates and styling consistent with the event brand look
- prefer localStorage-based demo data unless a proper backend is added
- update the admin module when new catalogue data fields are introduced
- validate mobile responsiveness after adding new UI elements

## License

This project is intended for demo and showcase use.

## Contact

For project questions or future enhancement requests, use the project maintainer contact in the repository or your internal team communication channels.
