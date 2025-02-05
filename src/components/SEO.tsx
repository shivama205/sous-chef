import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'blog';
  canonical?: string;
  author?: string;
  language?: string;
}

const defaults = {
  title: 'MySideChef - Your AI Powered Meal Planning Assistant',
  description: 'Get personalized meal plans, recipe suggestions, and healthy alternatives with AI. Save time and eat better with MySideChef.',
  url: 'https://mysidechef.com',
  author: 'MySideChef Team',
  language: 'en'
};

export function SEO({ 
  title = defaults.title,
  description = defaults.description,
  keywords = 'meal planning, recipe finder, healthy cooking, AI kitchen assistant, meal suggestions, cooking tips, personalized recipes, diet planning',
  image = '/og-image-compressed.jpg',
  type = 'website' as const,
  canonical,
  author = defaults.author,
  language = defaults.language
}: SEOProps) {
  const fullTitle = title === defaults.title ? title : `${title}`;
  const url = canonical || defaults.url;
  const fullImage = image.startsWith('http') ? image : `${defaults.url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical || url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MySideChef" />
      <meta property="og:locale" content={language} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={description} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="theme-color" content="#22c55e" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
} 