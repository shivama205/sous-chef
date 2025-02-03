import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
}

export function SEO({
  title = 'SousChef - AI-Powered Meal Planning Made Easy',
  description = 'Create personalized meal plans, find recipes, and get healthy alternatives with SousChef\'s AI-powered platform. Your personal AI chef for healthy eating.',
  keywords = ['meal planning', 'healthy recipes', 'AI chef', 'nutrition', 'meal prep', 'diet planning'],
  image = '/og-image.png',
  url = 'https://sous-chef.in',
  type = 'website',
  structuredData
}: SEOProps) {
  const siteTitle = title.includes('SousChef') ? title : `${title} | SousChef`;
  const canonicalUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SousChef" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@souschef_ai" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}