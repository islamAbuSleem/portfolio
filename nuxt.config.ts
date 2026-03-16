import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Enable TypeScript strict mode for better type safety
  typescript: {
    strict: true,
    typeCheck: false // Set to true if vue-tsc is installed
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    adminApiSecret: process.env.ADMIN_API_SECRET || '',
    // Public keys (client-side accessible)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://portfolio-usca.onrender.com'
    }
  },

  app: {
    head: {
      title: 'Senior Software Engineer Portfolio | Full-Stack Developer',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Senior software engineer portfolio showcasing expertise in full-stack development, system design, and scalable applications. View my projects and experience.' },
        { name: 'keywords', content: 'software engineer, full-stack developer, system design, web development, portfolio' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Senior Software Engineer Portfolio | Full-Stack Developer' },
        { property: 'og:description', content: 'Senior software engineer portfolio showcasing expertise in full-stack development, system design, and scalable applications.' },
        { property: 'og:url', content: 'https://yourportfolio.com' },
        { property: 'og:site_name', content: 'Software Engineer Portfolio' },
        { property: 'og:image', content: 'https://yourportfolio.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Senior Software Engineer Portfolio' },
        { name: 'twitter:description', content: 'Full-stack developer showcasing projects and expertise.' },
        { name: 'twitter:image', content: 'https://yourportfolio.com/og-image.png' },
        { name: 'author', content: 'Your Name' },
        { name: 'canonical', content: 'https://yourportfolio.com' }
      ],
      link: [
        { rel: 'canonical', href: 'https://yourportfolio.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap' },
        { rel: 'icon', href: '/favicon.ico' }
      ]
    }
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true
  }
})
