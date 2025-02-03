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

// Organization data for JSON-LD
const ORGANIZATION_DATA = {
  "@type": "Organization",
  "@id": "https://sous-chef.in/#organization",
  "name": "SousChef",
  "url": "https://sous-chef.in",
  "logo": {
    "@type": "ImageObject",
    "url": "https://sous-chef.in/logo-1.jpeg",
    "width": 512,
    "height": 512
  },
  "sameAs": [
    "https://twitter.com/souschef",
    "https://facebook.com/souschef",
    "https://instagram.com/souschef"
  ]
};

// Default website data for JSON-LD
const WEBSITE_DATA = {
  "@type": "WebSite",
  "@id": "https://sous-chef.in/#website",
  "url": "https://sous-chef.in",
  "name": "SousChef - AI-Powered Meal Planning Made Easy",
  "description": "Create personalized meal plans, find recipes, and get healthy alternatives with SousChef's AI-powered platform. Your personal AI chef for healthy eating.",
  "publisher": {
    "@id": "https://sous-chef.in/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://sous-chef.in/recipe-finder?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Generate breadcrumb list JSON-LD
const generateBreadcrumbList = (breadcrumbs: BreadcrumbItem[]) => ({
  "@type": "BreadcrumbList",
  "@id": "https://sous-chef.in/#breadcrumb",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.item.startsWith('http') ? item.item : `https://sous-chef.in${item.item}`
  }))
});

// Generate WebPage JSON-LD
const generateWebPage = (props: SEOProps) => ({
  "@type": "WebPage",
  "@id": `${props.url}#webpage`,
  "url": props.url,
  "name": props.title,
  "description": props.description,
  "isPartOf": {
    "@id": "https://sous-chef.in/#website"
  },
  "breadcrumb": {
    "@id": "https://sous-chef.in/#breadcrumb"
  },
  "inLanguage": "en-US"
});

export function SEO({
  title = 'SousChef - AI-Powered Meal Planning Made Easy',
  description = 'Create personalized meal plans, find recipes, and get healthy alternatives with SousChef\'s AI-powered platform. Your personal AI chef for healthy eating.',
  keywords = ['meal planning', 'healthy recipes', 'AI chef', 'nutrition', 'meal prep', 'diet planning', 'recipe finder', 'healthy alternatives', 'cooking assistant'],
  image = '/og-image.png',
  squareImage = '/og-image-square.png',
  url = 'https://sous-chef.in',
  type = 'website',
  structuredData,
  noindex = false,
  alternateUrls = [],
  breadcrumbs = []
}: SEOProps) {
  const siteTitle = title.includes('SousChef') ? title : `${title} | SousChef`;
  const absoluteImageUrl = image.startsWith('http') ? image : `https://sous-chef.in${image}`;
  const absoluteSquareImageUrl = squareImage.startsWith('http') ? squareImage : `https://sous-chef.in${squareImage}`;
  const canonicalUrl = url.startsWith('http') ? url : `https://sous-chef.in${url}`;
  
  // Prepare JSON-LD structured data
  const jsonLd = [
    ORGANIZATION_DATA,
    WEBSITE_DATA,
    generateWebPage({ title: siteTitle, description, url: canonicalUrl }),
    ...(breadcrumbs.length > 0 ? [generateBreadcrumbList(breadcrumbs)] : []),
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Primary Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SousChef" />
      
      {/* Regular OG Image (16:9) */}
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteTitle} - Preview Image`} />
      
      {/* Square OG Image (1:1) for WhatsApp and other platforms */}
      <meta property="og:image" content={absoluteSquareImageUrl} />
      <meta property="og:image:secure_url" content={absoluteSquareImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content={`${siteTitle} - Preview Image (Square)`} />
      
      {/* Enhanced Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@souschef" />
      <meta name="twitter:creator" content="@souschef" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:src" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={`${siteTitle} - Preview Image`} />
      <meta name="twitter:domain" content="sous-chef.in" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language URLs */}
      {alternateUrls.map(({ lang, url }) => (
        <link 
          key={lang}
          rel="alternate" 
          hrefLang={lang} 
          href={url.startsWith('http') ? url : `https://sous-chef.in${url}`}
        />
      ))}

      {/* Enhanced JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* PWA Meta Tags */}
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