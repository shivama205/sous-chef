import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  squareImage?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
  alternateUrls?: { lang: string; url: string }[];
  breadcrumbs?: BreadcrumbItem[];
}

const BASE_URL = 'https://sous-chef.in';

const DEFAULT_TITLE = 'SousChef - Your AI Cooking Companion';
const DEFAULT_DESCRIPTION = 'Get instant meal ideas based on your mood, discover recipes, find healthy alternatives, and plan your meals with AI assistance. Your personal sous chef for smarter, healthier cooking.';
const DEFAULT_KEYWORDS = [
  'AI cooking assistant',
  'meal suggestions',
  'recipe finder',
  'healthy alternatives',
  'meal planning',
  'cooking ideas',
  'personalized recipes',
  'mood-based meals',
  'smart kitchen assistant',
  'healthy cooking',
  'dietary recommendations',
  'nutrition assistant'
];

// Organization data for JSON-LD
const ORGANIZATION_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": "SousChef",
  "url": BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${BASE_URL}/logo-1.jpeg`,
    "width": 512,
    "height": 512
  },
  "description": "Your AI cooking companion for personalized meal ideas, recipe discovery, and healthier eating habits.",
  "sameAs": [
    "https://twitter.com/souschef",
    "https://facebook.com/souschef",
    "https://instagram.com/souschef"
  ]
};

// Generate WebPage JSON-LD
const generateWebPage = (props: SEOProps & { absoluteUrl: string }) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${props.absoluteUrl}#webpage`,
  "url": props.absoluteUrl,
  "name": props.title,
  "description": props.description,
  "isPartOf": {
    "@id": `${BASE_URL}/#website`
  },
  "inLanguage": "en-US",
  "publisher": {
    "@id": `${BASE_URL}/#organization`
  }
});

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = '/og-image.png',
  squareImage = '/og-image-square.png',
  url = '/',
  type = 'website',
  structuredData,
  noindex = false,
  alternateUrls = [],
  breadcrumbs = []
}: SEOProps) {
  const siteTitle = title.includes('SousChef') ? title : `${title} | SousChef`;
  const absoluteUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  const absoluteImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;
  const absoluteSquareImageUrl = squareImage.startsWith('http') ? squareImage : `${BASE_URL}${squareImage.startsWith('/') ? squareImage : `/${squareImage}`}`;

  // Prepare JSON-LD structured data
  const pageStructuredData = generateWebPage({
    title: siteTitle,
    description,
    absoluteUrl
  });

  const jsonLd = [
    ORGANIZATION_DATA,
    pageStructuredData,
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={absoluteUrl} />
      
      {/* Open Graph Meta Tags - Square Image First for WhatsApp */}
      <meta property="og:site_name" content="SousChef" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />

      {/* Square Image (1:1) for WhatsApp - Placed First */}
      <meta property="og:image" content={absoluteSquareImageUrl} />
      <meta property="og:image:secure_url" content={absoluteSquareImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content={siteTitle} />

      {/* Primary Image (16:9) for other platforms */}
      <meta property="og:image:url" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={siteTitle} />

      {/* WhatsApp Specific Meta Tags */}
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@souschef" />
      <meta name="twitter:creator" content="@souschef" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={siteTitle} />
      <meta name="twitter:domain" content={BASE_URL.replace('https://', '')} />

      {/* Robots Meta Tags */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Alternate Language URLs */}
      {alternateUrls.map(({ lang, url: altUrl }) => (
        <link 
          key={lang}
          rel="alternate" 
          hrefLang={lang} 
          href={altUrl.startsWith('http') ? altUrl : `${BASE_URL}${altUrl.startsWith('/') ? altUrl : `/${altUrl}`}`}
        />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* PWA Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="application-name" content="SousChef" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SousChef" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#18181b" />
    </Helmet>
  );
}