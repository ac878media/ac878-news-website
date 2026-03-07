# AC878 News Website

**878时讯 | AC878 News** - Chinese-Australian news portal built with Next.js

## 🌐 Live Site
- **Production:** https://news.ac878.com.au
- **Main Site:** https://ac878.com.au

## 🛠️ Technology Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **CMS:** WordPress (Headless)
- **Deployment:** Vercel
- **Content:** Automated publishing via AI pipeline

## 📰 Features
- **Responsive Design:** Mobile-first Chinese news portal
- **Automated Publishing:** AI-powered content pipeline
- **Multi-Category:** Australian, Business, China/HK, International news
- **Bilingual Support:** Chinese primary, English navigation
- **Real-time Updates:** Continuous content refresh
- **Radio Integration:** AC878 FM live stream integration

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ac878media/ac878-news-website.git
cd ac878-news-website

# Install dependencies
npm install

# Run development server
npm run dev
```

### Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure
```
src/
├── components/     # Reusable React components
├── pages/         # Next.js pages
├── styles/        # CSS and Tailwind styles
├── lib/           # Utilities and API functions
└── types/         # TypeScript type definitions
```

## 🔧 Configuration
- **WordPress API:** Content management
- **Automated Publishing:** Via OpenClaw pipeline
- **Deployment:** Auto-deploy via Vercel

## 📊 Content Pipeline
The website content is automatically managed by:
- **RSS Aggregation:** From multiple Australian news sources
- **AI Translation:** English → Simplified Chinese
- **Quality Control:** Deduplication and validation
- **Scheduled Publishing:** Every 30 minutes during business hours

## 🎯 Features
- **Mobile Responsive:** Optimized for all devices
- **Fast Loading:** Optimized Next.js performance
- **SEO Optimized:** Meta tags and structured data
- **Accessibility:** WCAG compliant design
- **Chinese Typography:** Proper CJK character handling

## 📱 Related Apps
- **iOS App:** [AC878 on App Store](https://apps.apple.com/au/app/ac878-australian-chinese-radio/id6741985210)
- **Android App:** [AC878 on Google Play](https://play.google.com/store/apps/details?id=appac878comau.wpapp)

## 📧 Contact
- **Email:** info@ac878.com.au
- **Address:** Suite 11, 89-97 Jones St, Ultimo NSW 2007
- **Radio:** FM 87.8 Sydney

---

Built with ❤️ by AC878 Media Group