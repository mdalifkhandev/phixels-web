# 🌐 Phixels.io - High-Performance Web Frontend

Phixels.io Web is the public-facing flagship platform of the Phixels ecosystem. It is a high-fidelity, modern web application designed to showcase premium engineering services with stunning aesthetics and seamless interactivity.

- **Live Demo**: [phixels-web-xi.vercel.app](https://phixels-web-xi.vercel.app)
- **Production Domain**: [phixels.agency](https://phixels.agency)

---

## 🚀 Key Features

### 💎 Premium User Experience (UX)
- **Fluid Animations**: Leveraging `Framer Motion` for smooth entry animations, parallax effects, and interactive hover states that bring the brand to life.
- **Glassmorphism Design**: A sophisticated dark-themed interface built on modern UI principles with custom gradients and high-contrast typography.
- **High-Fidelity Interactivity**: Micro-interactions and visual feedback across all navigation and call-to-action elements.

### ⚡ Dynamic Content & Styling Engine
- **Rich HTML Injection**: Advanced rendering logic that safely injects complex content from the CMS, supporting rich text, links, and custom formatting.
- **Inherited Styling Logic**: A specialized CSS architecture that ensures CMS-defined colors and gradients correctly override global defaults while maintaining typography standards.
- **Real-Time Updates**: The frontend reacts instantly to changes committed via the admin dashboard without requiring new builds.

### 📱 Performance & SEO Excellence
- **Vite Powered**: Optimized production bundles and ultra-fast load times.
- **Semantic Architecture**: Uses proper H1-H6 hierarchy and ARIA labels for maximum accessibility and search engine ranking.
- **Fully Responsive**: A mobile-first design that scales flawlessly from compact smartphones to ultra-wide desktop monitors.

---

## 🛠️ Technical Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios (Custom API Wrapper)

---

## ⚙️ How It Works

1.  **Bootstrapping**: The application initializes the `usePageContent` hook upon initial load.
2.  **Dynamic Fetching**: Content is retrieved asynchronously from the backend based on page-specific keys.
3.  **Stateful Distribution**: Fetched data is distributed through React state to specialized components like `Hero` and `ServicesGrid`.
4.  **Safe Rendering**: Rich content is rendered using optimized injection methods, ensuring that custom brand styling (like text gradients) is applied with 100% accuracy.

---

## 📦 Installation & Setup

```bash
# Clone and navigate
git clone https://github.com/mdalifkhandev/phixels-web.git
cd phixels-web

# Install dependencies
npm install

# Setup environment
# Refer to .env.example for required keys
npm run dev
```

---

*This project is part of my professional portfolio, demonstrating my ability to build visually stunning and technically robust React applications.*
