import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  canonical?: string;
}

const defaultSEO = {
  title: 'SousChef - Your AI-Powered Kitchen Assistant',
  description: 'SousChef helps you plan meals, find recipes, and discover healthy alternatives. Get personalized meal suggestions and cooking tips from your AI kitchen assistant.',
  keywords: 'meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips',
  image: '/og-image.png',
  type: 'website' as const,
  url: 'https://sous-chef.in'
};

export function SEO({ 
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  type = defaultSEO.type,
  canonical
}: SEOProps) {
  const fullTitle = title === defaultSEO.title ? title : `${title} | SousChef`;
  const url = canonical || defaultSEO.url;
  const fullImage = image.startsWith('http') ? image : `${defaultSEO.url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical || url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SousChef" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
} 