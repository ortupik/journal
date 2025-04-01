// src/__tests__/helpers/testApiHandler.ts
import { createTestRequest } from '../../../helpers/testApiHandler';

describe('createTestRequest Helper', () => {
  it('should create a request object with the specified method', () => {
    const req = createTestRequest('GET');
    expect(req.method).toBe('GET');
  });

  it('should include the provided body as JSON if present', () => {
    const body = { data: 'test' };
    const req = createTestRequest('POST', body);
    expect(JSON.parse(req.body as string)).toEqual(body);
    expect(req.headers.get('Content-Type')).toBe('application/json');
  });

  it('should create a request object without a body if not provided', () => {
    const req = createTestRequest('DELETE');
    expect(req.body).toBeUndefined();
  });
});
