import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fontwars.lol'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/_next/*', '/static/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 