import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thirdleaf.in';

  // Core static marketing and informational pages
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/careers',
    '/changelog',
    '/contact',
    '/docs',
    '/help',
    '/pricing',
    '/privacy',
    '/roadmap',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Note: If you have dynamic blog posts, you would fetch them here 
  // and append them to the sitemap array.

  return [...staticRoutes];
}
