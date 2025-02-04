import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  canonical?: string;
}

const defaults = {
  title: 'SideChef - Your AI Powered Meal Planning Assistant',
  description: 'Get personalized meal plans, recipe suggestions, and healthy alternatives with AI.',
  url: 'https://mysidechef.com'
};

export function SEO({ 
  title = defaults.title,
  description = defaults.description,
  keywords = 'meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips',
  image = '/og-image-compressed.jpg',
  type = 'website' as const,
  canonical
}: SEOProps) {
  const fullTitle = title === defaults.title ? title : `${title} | MySideChef`;
  const url = canonical || defaults.url;
  const fullImage = image.startsWith('http') ? image : `${defaults.url}${image}`;

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
      <meta property="og:site_name" content="MySideChef" />

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