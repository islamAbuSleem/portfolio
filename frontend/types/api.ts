// ============================================
// Portfolio API Type Definitions
// ============================================

// Common Response Types
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error'
  data: T
}

export interface ApiError {
  status: 'fail' | 'error'
  message: string
}

// Pagination Types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginationLinks {
  self: string
  first: string
  last: string
  next?: string
  prev?: string
}

// Profile Types
export interface Profile {
  id: number
  fullName: string
  title: string
  tagline: string | null
  bio: string
  location: string | null
  email: string | null
  phone: string | null
  avatarUrl: string | null
  resumeUrl: string | null
  website: string | null
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    youtube?: string
    dev?: string
  } | null
  seoTitle: string | null
  seoDescription: string | null
  seoImage: string | null
  metaKeywords: string | null
  themeColor: string
  showResume: boolean
  showContact: boolean
  updatedAt: string
}

export interface ProfileResponse {
  profile: Profile
}

// Project Types
export interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  imageUrls: string[] | null
  year: number | null
  category: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectsListResponse {
  projects: Project[]
  pagination: PaginationInfo
  links: PaginationLinks
}

export interface ProjectResponse {
  project: Project
}

// Skill Types
export interface Skill {
  id: number
  name: string
  category: string
  level: string | null
  icon: string | null
  color: string | null
  createdAt: string
}

export interface SkillsListResponse {
  skills: Skill[]
  pagination: PaginationInfo
  links: PaginationLinks
}

export interface SkillResponse {
  skill: Skill
}

// Experience Types
export interface Experience {
  id: number
  company: string
  role: string
  period: string
  description: string
  technologies: string[]
  order: number
  createdAt: string
}

export interface ExperiencesListResponse {
  experiences: Experience[]
  pagination: PaginationInfo
  links: PaginationLinks
}

export interface ExperienceResponse {
  experience: Experience
}

// Message Types
export interface Message {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export interface CreateMessageRequest {
  name: string
  email: string
  subject?: string
  message: string
}

export interface MessagesListResponse {
  messages: Message[]
  pagination: PaginationInfo
  links: PaginationLinks
}

export interface MessageResponse {
  message: Message
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  name: string | null
  role: string
  createdAt: string
}

export interface LoginResponse {
  token: string
  data: {
    user: User
  }
}

// Upload Types
export interface UploadedImage {
  url: string
  publicId: string
}

export interface SingleUploadResponse {
  url: string
  publicId: string
}

export interface MultipleUploadResponse {
  results: number
  images: UploadedImage[]
}

// Resume Upload Response
export interface ResumeUploadResponse {
  resumeUrl: string
}