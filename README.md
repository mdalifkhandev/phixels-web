# 🌐 Phixels.io - High-Performance Web Frontend

Phixels.io Web is the public-facing flagship platform of the Phixels ecosystem. It is a high-fidelity, modern web application designed to showcase premium engineering services with stunning aesthetics and seamless interactivity.

- **Live Demo**: [phixels-web-xi.vercel.app](https://phixels-web-xi.vercel.app)
- **Production Domain**: [phixels.agency](https://phixels.agency)

---

## 🎯 Purpose and Vision
This project was built to bridge the gap between high-end digital design and enterprise-grade performance. The goal was to create a website that not only looks like a premium digital agency but also performs with ultra-fast load times and fully dynamic content management, allowing for instantaneous marketing updates without touching a single line of code.

---

## 🚀 Key Features

### 💎 Premium User Experience (UX)
- **Fluid Animations**: Leveraging `Framer Motion` for smooth entry animations, parallax effects, and interactive hover states that make the site feel "alive".
- **Glassmorphism Design**: A sophisticated dark theme using modern glassmorphism principles, custom gradients, and high-contrast typography.
- **Micro-interactions**: Subtle visual feedbacks on buttons, cards, and navigation to enhance engagement.

### ⚡ Dynamic Content Rendering
- **CMS Integration**: The frontend is fully decoupled and fetches its content (headings, descriptions, metrics, etc.) from a dedicated API.
- **Rich Text Support**: Renders complex formatted text, including custom gradients and solid colors directly from the admin dashboard.
- **Fallback Resilience**: Robust fallback logic ensure the site remains functional and beautiful even if the API is unreachable.

### 📱 Performance & SEO
- **Vite Powered**: Built on Vite for lightning-fast development and optimized production bundles.
- **Semantic HTML**: Uses proper H1-H6 hierarchy and ARIA labels for accessibility and SEO ranking.
- **Responsive Architecture**: A mobile-first approach ensuring a flawless experience on smartphones, tablets, and desktops.

---

## 🛠️ Technical Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios (Custom API Wrapper)

---

## ⚙️ How It Works

1.  **Bootstrapping**: Upon load, the application initializes the `usePageContent` hook.
2.  **Data Fetching**: The hook makes an asynchronous request to the `phixels.io-backend` to retrieve section data based on the current page key.
3.  **State Management**: Fetched content is stored in local React state and passed down to functional components like `Hero`, `ServicesGrid`, and `PortfolioTeaser`.
4.  **Safe Injection**: Content is injected using `dangerouslySetInnerHTML` to support the rich formatting provided by the CMS, with strict CSS encapsulation to prevent style leakage.

---

## 📦 Installation & Setup

```bash
# Clone and navigate
git clone https://github.com/mdalifkhandev/phixels-web.git
cd phixels-web

# Install dependencies
npm install

# Run development server
npm run dev
```

---

*This project is part of my professional portfolio, demonstrating my ability to build visually stunning and technically robust React applications.*
