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
const DEFAULT_DESCRIPTION = 'Get instant meal ideas based on your mood, discover recipes, find healthy alternatives, and plan your meals with AI assistance.';
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
  title = 'SousChef - Your AI Cooking Companion',
  description = 'Get instant meal ideas based on your mood and energy level',
  image = '/og-image.png'
}: SEOProps) {
  const imageUrl = `https://sous-chef.in${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}