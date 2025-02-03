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
  keywords = DEFAULT_KEYWORDS,
  image = '/og-image.png',
  url = BASE_URL,
  type = 'website'
}: SEOProps) {
  const imageUrl = `${BASE_URL}${image}`;
  const canonicalUrl = url || BASE_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="SousChef" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SousChef" />
      <meta property="og:locale" content="en_US" />
      
      {/* Facebook Specific */}
      <meta property="fb:app_id" content="your-fb-app-id" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@souschef" />
      <meta name="twitter:creator" content="@souschef" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${title} Interface`} />
      <meta name="twitter:domain" content="sous-chef.in" />

      {/* LinkedIn */}
      <meta property="linkedin:card" content="summary_large_image" />
      <meta property="linkedin:title" content={title} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={imageUrl} />
      
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={imageUrl} />
      <meta name="pinterest:domain_verify" content="your-pinterest-verify-code" />
      
      {/* WhatsApp */}
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:video:type" content="text/html" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(ORGANIZATION_DATA)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(generateWebPage({ title, description, absoluteUrl: canonicalUrl }))}
      </script>

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}