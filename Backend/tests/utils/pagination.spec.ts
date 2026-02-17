import { describe, it, expect } from 'vitest'
import { getPaginationParams, createPaginatedResponse, buildPaginationLinks, PaginationParams } from '../../src/utils/pagination'
import { Request } from 'express'

describe('Pagination Utils', () => {
  describe('getPaginationParams', () => {
    it('returns default pagination when no query params provided', () => {
      const req = { query: {} } as Request
      const result = getPaginationParams(req)
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        skip: 0
      })
    })

    it('returns correct pagination with custom page and limit', () => {
      const req = { query: { page: '2', limit: '20' } } as unknown as Request
      const result = getPaginationParams(req)
      
      expect(result).toEqual({
        page: 2,
        limit: 20,
        skip: 20
      })
    })

    it('enforces minimum page of 1', () => {
      const req = { query: { page: '0' } } as unknown as Request
      const result = getPaginationParams(req)
      
      expect(result.page).toBe(1)
    })

    it('enforces minimum limit of 1', () => {
      const req = { query: { limit: '0' } } as unknown as Request
      const result = getPaginationParams(req)
      
      expect(result.limit).toBe(1)
    })

    it('caps maximum limit at 100', () => {
      const req = { query: { limit: '200' } } as unknown as Request
      const result = getPaginationParams(req)
      
      expect(result.limit).toBe(100)
    })
  })

  describe('createPaginatedResponse', () => {
    it('creates correct paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }]
      const totalItems = 25
      const pagination: PaginationParams = { page: 2, limit: 10, skip: 10 }
      
      const result = createPaginatedResponse(data, totalItems, pagination)
      
      expect(result).toEqual({
        data,
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: true
        }
      })
    })

    it('sets hasNextPage to false on last page', () => {
      const data = [{ id: 1 }]
      const totalItems = 21
      const pagination: PaginationParams = { page: 3, limit: 10, skip: 20 }
      
      const result = createPaginatedResponse(data, totalItems, pagination)
      
      expect(result.pagination.hasNextPage).toBe(false)
      expect(result.pagination.hasPrevPage).toBe(true)
    })

    it('sets hasPrevPage to false on first page', () => {
      const data = [{ id: 1 }]
      const totalItems = 25
      const pagination: PaginationParams = { page: 1, limit: 10, skip: 0 }
      
      const result = createPaginatedResponse(data, totalItems, pagination)
      
      expect(result.pagination.hasPrevPage).toBe(false)
      expect(result.pagination.hasNextPage).toBe(true)
    })
  })

  describe('buildPaginationLinks', () => {
    it('builds correct pagination links', () => {
      const baseUrl = 'http://localhost:3001/api/projects'
      const pagination: PaginationParams = { page: 2, limit: 10, skip: 10 }
      const totalItems = 30
      
      const result = buildPaginationLinks(baseUrl, pagination, totalItems)
      
      expect(result).toEqual({
        self: 'http://localhost:3001/api/projects?page=2&limit=10',
        first: 'http://localhost:3001/api/projects?page=1&limit=10',
        last: 'http://localhost:3001/api/projects?page=3&limit=10',
        next: 'http://localhost:3001/api/projects?page=3&limit=10',
        prev: 'http://localhost:3001/api/projects?page=1&limit=10'
      })
    })

    it('excludes next link on last page', () => {
      const baseUrl = 'http://localhost:3001/api/projects'
      const pagination: PaginationParams = { page: 3, limit: 10, skip: 20 }
      const totalItems = 25
      
      const result = buildPaginationLinks(baseUrl, pagination, totalItems)
      
      expect(result.next).toBeUndefined()
      expect(result.prev).toBeDefined()
    })

    it('excludes prev link on first page', () => {
      const baseUrl = 'http://localhost:3001/api/projects'
      const pagination: PaginationParams = { page: 1, limit: 10, skip: 0 }
      const totalItems = 25
      
      const result = buildPaginationLinks(baseUrl, pagination, totalItems)
      
      expect(result.prev).toBeUndefined()
      expect(result.next).toBeDefined()
    })
  })
})
