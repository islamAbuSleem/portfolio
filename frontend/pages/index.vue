<template>
  <div class="space-y-0">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-dark-400">Loading portfolio...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-900 dark:text-dark-100 mb-2">Failed to Load</h2>
        <p class="text-gray-600 dark:text-dark-400 mb-4">{{ error }}</p>
        <button @click="refresh" class="btn-primary">
          Try Again
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Hero Section -->
      <section class="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <!-- Background Elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-20 right-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-4xl mx-auto text-center">
          <div class="mb-6 inline-block">
            <div class="px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 backdrop-blur">
              <p class="text-primary-400 text-sm font-medium">{{ profile?.tagline || 'Welcome to my portfolio' }}</p>
            </div>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span class="block text-gray-900 dark:text-dark-100">{{ profile?.fullName || 'Software' }}</span>
            <span class="gradient-text">{{ profile?.title || 'Engineer' }}</span>
          </h1>

          <p class="text-xl md:text-2xl text-gray-700 dark:text-dark-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ profile?.bio?.substring(0, 150) || 'Crafting elegant solutions to complex problems. Specialized in full-stack development, system design, and building scalable applications.' }}...
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#projects" class="btn-primary">
              View My Work
            </a>
            <a href="#contact" class="btn-secondary">
              Get In Touch
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200 dark:border-dark-700">
            <AnimatedCounter :endValue="stats.years" suffix="+" label="Years Experience" />
            <AnimatedCounter :endValue="stats.projects" suffix="+" label="Projects Completed" />
            <AnimatedCounter :endValue="stats.skills" suffix="+" label="Technical Skills" />
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-800/50">
        <div class="max-w-6xl mx-auto">
          <h2 class="section-title mb-12">About Me</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Image -->
            <div class="relative">
              <div class="aspect-square rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 overflow-hidden">
                <img 
                  v-if="profile?.avatarUrl"
                  :src="profile.avatarUrl" 
                  :alt="profile.fullName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                  <svg class="w-32 h-32 text-primary-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-6">
              <div class="prose dark:prose-invert max-w-none">
                <p class="text-lg text-gray-700 dark:text-dark-300 leading-relaxed whitespace-pre-line">
                  {{ profile?.bio || 'Passionate software engineer with experience building scalable applications.' }}
                </p>
              </div>

              <div v-if="profile?.location" class="flex items-center gap-2 text-gray-600 dark:text-dark-400">
                <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ profile.location }}</span>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4">
                <div class="card">
                  <p class="text-primary-400 font-semibold mb-2">Problem Solving</p>
                  <p class="text-gray-600 dark:text-dark-400 text-sm">Breaking down complex challenges into elegant solutions</p>
                </div>
                <div class="card">
                  <p class="text-primary-400 font-semibold mb-2">Leadership</p>
                  <p class="text-gray-600 dark:text-dark-400 text-sm">Mentoring teams and driving technical excellence</p>
                </div>
                <div class="card">
                  <p class="text-primary-400 font-semibold mb-2">Innovation</p>
                  <p class="text-gray-600 dark:text-dark-400 text-sm">Staying ahead with emerging technologies</p>
                </div>
                <div class="card">
                  <p class="text-primary-400 font-semibold mb-2">Collaboration</p>
                  <p class="text-gray-600 dark:text-dark-400 text-sm">Working effectively across teams and disciplines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <ExperienceTimeline />

      <!-- Projects Section -->
      <section id="projects" class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <h2 class="section-title mb-12">Featured Projects</h2>

          <!-- Projects Loading -->
          <div v-if="projectsLoading" class="text-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          </div>

          <!-- Projects Error -->
          <div v-else-if="projectsError" class="text-center py-10">
            <p class="text-gray-600 dark:text-dark-400">Failed to load projects</p>
          </div>

          <!-- Projects Grid -->
          <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="project in projects" 
              :key="project.id" 
              class="card group cursor-pointer"
            >
              <div class="aspect-video bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="project.imageUrls && project.imageUrls.length > 0"
                  :src="project.imageUrls[0]"
                  :alt="project.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-16 h-16 text-primary-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-dark-100 mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 dark:text-dark-400 mb-4">{{ project.description.substring(0, 120) }}...</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.techStack.slice(0, 4)" 
                  :key="tech" 
                  class="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full font-medium"
                >
                  {{ tech }}
                </span>
                <span v-if="project.techStack.length > 4" class="px-3 py-1 bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-dark-400 text-xs rounded-full">
                  +{{ project.techStack.length - 4 }}
                </span>
              </div>
              <div class="flex gap-4">
                <a 
                  v-if="project.liveUrl" 
                  :href="project.liveUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-400 hover:text-primary-300 font-medium text-sm"
                >
                  View Project →
                </a>
                <a 
                  v-if="project.repoUrl" 
                  :href="project.repoUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-400 hover:text-primary-300 font-medium text-sm"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>

          <!-- No Projects -->
          <div v-else class="text-center py-10">
            <p class="text-gray-600 dark:text-dark-400">No projects to display yet.</p>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-800/50">
        <div class="max-w-6xl mx-auto">
          <h2 class="section-title mb-12">Technical Skills</h2>

          <!-- Skills Loading -->
          <div v-if="skillsLoading" class="text-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          </div>

          <!-- Skills Error -->
          <div v-else-if="skillsError" class="text-center py-10">
            <p class="text-gray-600 dark:text-dark-400">Failed to load skills</p>
          </div>

          <!-- Skills Grid -->
          <div v-else-if="Object.keys(groupedSkills).length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(skills, category) in groupedSkills" :key="category" class="card">
              <h3 class="text-lg font-bold text-gray-900 dark:text-dark-100 mb-6 flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: getCategoryColor(category) + '20' }">
                  <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getCategoryColor(category) }"></span>
                </span>
                {{ category }}
              </h3>
              <ul class="space-y-3">
                <li v-for="skill in skills.slice(0, 6)" :key="skill.id" class="flex items-center gap-3">
                  <span 
                    class="w-2 h-2 rounded-full" 
                    :style="{ backgroundColor: skill.color || getCategoryColor(category) }"
                  ></span>
                  <span class="text-gray-700 dark:text-dark-300">{{ skill.name }}</span>
                  <span v-if="skill.level" class="text-xs text-gray-500 dark:text-dark-500 ml-auto">{{ skill.level }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- No Skills -->
          <div v-else class="text-center py-10">
            <p class="text-gray-600 dark:text-dark-400">No skills to display yet.</p>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h2 class="section-title mb-12 text-center">Get In Touch</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div v-if="profile?.email" class="card text-center">
              <div class="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-dark-100 mb-2">Email</h3>
              <a :href="`mailto:${profile.email}`" class="text-gray-600 dark:text-dark-400 hover:text-primary-400">{{ profile.email }}</a>
            </div>

            <div v-if="profile?.socialLinks?.linkedin" class="card text-center">
              <div class="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-dark-100 mb-2">LinkedIn</h3>
              <a :href="profile.socialLinks.linkedin" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-dark-400 hover:text-primary-400">Connect</a>
            </div>

            <div v-if="profile?.socialLinks?.github" class="card text-center">
              <div class="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-dark-100 mb-2">GitHub</h3>
              <a :href="profile.socialLinks.github" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-dark-400 hover:text-primary-400">View Projects</a>
            </div>
          </div>

          <!-- Contact Form -->
          <ContactForm v-if="profile?.showContact !== false" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Profile, Project, Skill } from '~/types/api'

const config = useRuntimeConfig()

// State
const loading = ref(true)
const error = ref('')
const profile = ref<Profile | null>(null)
const projects = ref<Project[]>([])
const skills = ref<Skill[]>([])
const projectsLoading = ref(true)
const skillsLoading = ref(true)
const projectsError = ref('')
const skillsError = ref('')

// Computed stats
const stats = computed(() => ({
  years: 10, // This could be calculated from experience data
  projects: projects.value.length || 50,
  skills: skills.value.length || 30
}))

// Group skills by category
const groupedSkills = computed(() => {
  const grouped: Record<string, Skill[]> = {}
  skills.value.forEach(skill => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = []
    }
    grouped[skill.category].push(skill)
  })
  return grouped
})

// Category colors
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Frontend': '#3b82f6',
    'Backend': '#10b981',
    'Database': '#f59e0b',
    'DevOps': '#ef4444',
    'Tools': '#8b5cf6',
    'Mobile': '#ec4899',
    'Other': '#6b7280',
  }
  return colors[category] || '#3b82f6'
}

// Fetch profile data
const fetchProfile = async () => {
  try {
    const { data, error: fetchError } = await useFetch<{
      status: string
      data: { profile: Profile }
    }>(`${config.public.apiBase}/api/profile`)

    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to fetch profile')
    }

    if (data.value?.data?.profile) {
      profile.value = data.value.data.profile
    }
  } catch (e: any) {
    console.error('Failed to fetch profile:', e)
    error.value = 'Failed to load profile data'
  }
}

// Fetch projects
const fetchProjects = async () => {
  projectsLoading.value = true
  projectsError.value = ''
  try {
    const { data, error: fetchError } = await useFetch<{
      status: string
      data: { projects: Project[] }
    }>(`${config.public.apiBase}/api/projects?limit=6`)

    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to fetch projects')
    }

    if (data.value?.data?.projects) {
      projects.value = data.value.data.projects
    }
  } catch (e: any) {
    console.error('Failed to fetch projects:', e)
    projectsError.value = 'Failed to load projects'
  } finally {
    projectsLoading.value = false
  }
}

// Fetch skills
const fetchSkills = async () => {
  skillsLoading.value = true
  skillsError.value = ''
  try {
    const { data, error: fetchError } = await useFetch<{
      status: string
      data: { skills: Skill[] }
    }>(`${config.public.apiBase}/api/skills?limit=50`)

    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to fetch skills')
    }

    if (data.value?.data?.skills) {
      skills.value = data.value.data.skills
    }
  } catch (e: any) {
    console.error('Failed to fetch skills:', e)
    skillsError.value = 'Failed to load skills'
  } finally {
    skillsLoading.value = false
  }
}

// Refresh all data
const refresh = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await fetchProfile()
    await Promise.all([
      fetchProjects(),
      fetchSkills()
    ])
  } catch (e: any) {
    error.value = e.message || 'Failed to load portfolio data'
  } finally {
    loading.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  refresh()
})

// SEO
useHead(() => ({
  title: profile.value?.seoTitle || `${profile.value?.fullName || 'Portfolio'} | ${profile.value?.title || 'Software Engineer'}`,
  meta: [
    { name: 'description', content: profile.value?.seoDescription || profile.value?.bio?.substring(0, 160) || 'Senior software engineer portfolio showcasing expertise in full-stack development.' },
    { name: 'keywords', content: profile.value?.metaKeywords || 'software engineer, full-stack developer, portfolio' },
    { property: 'og:title', content: profile.value?.seoTitle || `${profile.value?.fullName || 'Portfolio'} | ${profile.value?.title || 'Software Engineer'}` },
    { property: 'og:description', content: profile.value?.seoDescription || profile.value?.bio?.substring(0, 160) },
    { property: 'og:image', content: profile.value?.seoImage || profile.value?.avatarUrl || '' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.value?.fullName || 'Software Engineer',
        url: profile.value?.website || 'https://yourportfolio.com',
        image: profile.value?.avatarUrl || '',
        jobTitle: profile.value?.title || 'Software Engineer',
        sameAs: [
          profile.value?.socialLinks?.linkedin,
          profile.value?.socialLinks?.github,
          profile.value?.socialLinks?.twitter,
        ].filter(Boolean),
        description: profile.value?.bio?.substring(0, 200) || '',
      })
    }
  ]
}))
</script>