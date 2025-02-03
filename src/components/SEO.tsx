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

const DEFAULT_TITLE = 'SousChef - Your AI Kitchen Assistant';
const DEFAULT_DESCRIPTION = 'Your AI-powered kitchen companion. Get personalized meal suggestions, discover recipes, find healthy alternatives, and make cooking smarter and more enjoyable.';
const DEFAULT_KEYWORDS = [
  'AI cooking assistant',
  'meal suggestions',
  'recipe finder',
  'healthy alternatives',
  'smart cooking',
  'personalized recipes',
  'kitchen AI',
  'cooking ideas',
  'recipe discovery',
  'cooking companion',
  'AI kitchen assistant',
  'cooking recommendations'
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
  "description": "Your AI-powered kitchen companion for smarter, more enjoyable cooking.",
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
  image = '/og-image.png',
  url = BASE_URL
}: SEOProps) {
  const imageUrl = `${BASE_URL}${image}`;
  const canonicalUrl = url || BASE_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Essential Open Graph Tags for WhatsApp */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}