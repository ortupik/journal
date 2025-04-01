import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { NextAuth } from 'next-auth';
import { createTestRequest } from '../../../helpers/testApiHandler';
import { GET, PUT, DELETE } from '@/app/api/journal/[id]/route';
import prisma from 'prisma/client';

// Mock NextAuth and getServerSession
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
  NextAuth: jest.fn(() => (req, res) => Promise.resolve(new NextResponse()))
}));

// Mock Prisma
jest.mock('prisma/client', () => ({
  journal: {
    findFirst: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn()
  }
}));

describe('Journal API Integration Tests - /api/journal/:id', () => {
  const mockSession = {
    user: {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  const mockJournalEntry = {
    id: 'journal123',
    title: 'Test Journal',
    content: 'Test content',
    userId: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/journal/:id', () => {
    it('should return journal entry when authenticated and entry exists', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(
        mockJournalEntry
      );

      const req = createTestRequest('GET');
      const params = { id: 'journal123' };
      const response = await GET(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockJournalEntry);
      expect(prisma.journal.findFirst).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id }
      });
    });

    it('should return 401 Unauthorized when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('GET');
      const params = { id: 'journal123' };
      const response = await GET(req, { params });

      expect(response.status).toBe(401);
      expect(prisma.journal.findFirst).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when authenticated but entry does not exist', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('GET');
      const params = { id: 'nonexistent-id' };
      const response = await GET(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.findFirst).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id', userId: mockSession.user.id }
      });
    });

    it('should return 404 Not Found when authenticated but entry belongs to another user', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce({
        ...mockJournalEntry,
        userId: 'another-user'
      });

      const req = createTestRequest('GET');
      const params = { id: 'journal123' };
      const response = await GET(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.findFirst).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id }
      });
    });
  });

  describe('PUT /api/journal/:id', () => {
    const updateData = {
      title: 'Updated Journal Title',
      content: 'Updated journal content...'
    };

    it('should update journal when authenticated and data is valid', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.updateMany as jest.Mock).mockResolvedValueOnce({
        count: 1
      });
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(
        mockJournalEntry
      ); // To simulate entry existing and belonging to user

      const req = createTestRequest('PUT', updateData);
      const params = { id: 'journal123' };
      const response = await PUT(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'Journal entry updated successfully' });
      expect(prisma.journal.findFirst).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id }
      });
      expect(prisma.journal.updateMany).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id },
        data: updateData
      });
    });

    it('should return 401 Unauthorized when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('PUT', updateData);
      const params = { id: 'journal123' };
      const response = await PUT(req, { params });

      expect(response.status).toBe(401);
      expect(prisma.journal.updateMany).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when authenticated but entry does not exist', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('PUT', updateData);
      const params = { id: 'nonexistent-id' };
      const response = await PUT(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.updateMany).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when authenticated but entry belongs to another user', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce({
        ...mockJournalEntry,
        userId: 'another-user'
      });

      const req = createTestRequest('PUT', updateData);
      const params = { id: 'journal123' };
      const response = await PUT(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.updateMany).not.toHaveBeenCalled();
    });

    it('should return 500 if Prisma update fails', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(
        mockJournalEntry
      );
      (prisma.journal.updateMany as jest.Mock).mockRejectedValueOnce(
        new Error('Prisma error')
      );

      const req = createTestRequest('PUT', updateData);
      const params = { id: 'journal123' };
      const response = await PUT(req, { params });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Failed to update journal entry' });
    });
  });

  describe('DELETE /api/journal/:id', () => {
    it('should delete journal when authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.deleteMany as jest.Mock).mockResolvedValueOnce({
        count: 1
      });
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(
        mockJournalEntry
      ); // To simulate entry existing and belonging to user

      const req = createTestRequest('DELETE');
      const params = { id: 'journal123' };
      const response = await DELETE(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'Journal entry deleted successfully' });
      expect(prisma.journal.findFirst).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id }
      });
      expect(prisma.journal.deleteMany).toHaveBeenCalledWith({
        where: { id: 'journal123', userId: mockSession.user.id }
      });
    });

    it('should return 401 Unauthorized when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('DELETE');
      const params = { id: 'journal123' };
      const response = await DELETE(req, { params });

      expect(response.status).toBe(401);
      expect(prisma.journal.deleteMany).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when authenticated but entry does not exist', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const req = createTestRequest('DELETE');
      const params = { id: 'nonexistent-id' };
      const response = await DELETE(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.deleteMany).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when authenticated but entry belongs to another user', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce({
        ...mockJournalEntry,
        userId: 'another-user'
      });

      const req = createTestRequest('DELETE');
      const params = { id: 'journal123' };
      const response = await DELETE(req, { params });

      expect(response.status).toBe(404);
      expect(prisma.journal.deleteMany).not.toHaveBeenCalled();
    });

    it('should return 500 if Prisma delete fails', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (prisma.journal.findFirst as jest.Mock).mockResolvedValueOnce(
        mockJournalEntry
      );
      (prisma.journal.deleteMany as jest.Mock).mockRejectedValueOnce(
        new Error('Prisma error')
      );

      const req = createTestRequest('DELETE');
      const params = { id: 'journal123' };
      const response = await DELETE(req, { params });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Failed to delete journal entry' });
    });
  });
});
