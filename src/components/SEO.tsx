import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  twitterHandle?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/og-image.png',
  url = 'https://sous-chef.in',
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  twitterHandle,
}: SEOProps) {
  const siteTitle = `${title} | SousChef`;
  const canonicalUrl = `${url}${window.location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SousChef" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Article Specific Tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedAt && <meta property="article:published_time" content={publishedAt} />}
          {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
        </>
      )}

      {/* JSON-LD Structured Data */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description,
            image: image,
            author: {
              '@type': 'Person',
              name: author,
            },
            datePublished: publishedAt,
            dateModified: modifiedAt || publishedAt,
            publisher: {
              '@type': 'Organization',
              name: 'SousChef',
              logo: {
                '@type': 'ImageObject',
                url: 'https://sous-chef.in/logo.png',
              },
            },
          })}
        </script>
      )}
    </Helmet>
  );
} 