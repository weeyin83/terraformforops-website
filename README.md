# Terraform for Ops Website

A curated hub for Terraform articles and resources for operations teams, featuring content from [Techielass.com](https://techielass.com).

## 🌐 Live Site

Visit the live site at: [https://terraformforops.com](https://terraformforops.com)

## 📋 Overview

This website automatically aggregates and displays Terraform-related articles from Techielass.com's RSS feed, providing a focused resource for operations professionals learning Infrastructure as Code.

## 🚀 Features

- **Automated Content**: Dynamically fetches Terraform articles from RSS feed
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards, and structured data
- **Fast Loading**: Hosted on Azure Static Web Apps with global CDN
- **Accessibility**: Semantic HTML and ARIA-compliant structure
- **Buy Me a Coffee Integration**: Support widget for content creator

## 🛠️ Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **RSS Parsing**: Client-side XML parsing with CORS proxies
- **Styling**: Custom CSS with CSS variables for theming

## 📁 Project Structure

```
terraformforops-website/
├── index.html                  # Main page
├── styles.css                  # Styling
├── script.js                   # RSS feed fetching and rendering
├── sitemap.xml                 # SEO sitemap
├── robots.txt                  # Search engine directives
├── staticwebapp.config.json    # Azure Static Web Apps configuration
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml  # Deployment workflow
└── images/                     # Image assets
```

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/weeyin83/terraformforops-website.git
   cd terraformforops-website
   ```

2. **Run a local server**
   
   Using Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Or using Node.js (if you have `http-server` installed):
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🚢 Deployment

The site is automatically deployed to Azure Static Web Apps via GitHub Actions when changes are pushed to the `main` branch.

### Deployment Workflow

1. Push changes to `main` branch
2. GitHub Actions triggers build workflow
3. Azure Static Web Apps deploys the site
4. Changes are live at terraformforops.com

### Manual Deployment

If you need to deploy manually, you can use the Azure Static Web Apps CLI:

```bash
npm install -g @azure/static-web-apps-cli
swa deploy
```

## 📝 Configuration

### RSS Feed Source

The RSS feed URL is configured in [script.js](script.js):

```javascript
const RSS_FEED_URL = 'https://www.techielass.com/tag/terraform/feed/';
```

### Terraform Keywords

Content filtering keywords are defined in [script.js](script.js):

```javascript
const TERRAFORM_KEYWORDS = [
    'terraform', 'tf', 'infrastructure as code', 
    'iac', 'terraform cloud', 'terraform enterprise', 
    'terragrunt', 'hcl'
];
```

### Color Theme

The site's color scheme can be customized in [styles.css](styles.css):

```css
:root {
    --primary-color: #7B42BC;
    --secondary-color: #5C4EE5;
    --text-color: #333;
    --bg-color: #f5f5f5;
    --card-bg: #ffffff;
}
```

## 🔍 SEO Features

- Comprehensive meta tags for search engines
- Open Graph tags for social media sharing
- Twitter Card integration
- XML sitemap for search engine crawlers
- robots.txt for crawler directives
- Structured data (JSON-LD) for rich snippets
- Semantic HTML for better accessibility

## 🤝 Contributing

This is a personal project showcasing Terraform content from Techielass.com. If you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

All article content belongs to the original author, Sarah Lean. The website code is available for reference and learning purposes.

## 👤 Author

**Sarah Lean** (Techielass)
- Website: [techielass.com](https://techielass.com)
- Portfolio: [sarahlean.com](https://www.sarahlean.com)
- Twitter: [@techielass](https://twitter.com/techielass)

## ☕ Support

If you find this resource helpful, consider [buying Sarah a coffee](https://www.buymeacoffee.com/techielass)!

## 🐛 Known Issues

- RSS feed fetching may occasionally fail due to CORS proxy limitations
- Some blog post images may not load properly due to source website configuration

## 📞 Contact

For questions or issues, please open an issue on the GitHub repository.