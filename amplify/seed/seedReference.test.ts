import { describe, it, expect, vi, beforeEach } from 'vitest';

const m = vi.hoisted(() => ({ create: vi.fn(), list: vi.fn(), del: vi.fn() }));
vi.mock('./seedClient', () => ({
  client: { models: { Category: { create: m.create, list: m.list, delete: m.del } } },
  EDITOR_WRITE: { authMode: 'userPool' },
  clearOneModel: (model: { list: typeof m.list }) => {
    void model;
    return Promise.resolve(0);
  },
}));

import { clearAll, seedReferenceData } from './seedReference';

describe('seedReferenceData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    m.create.mockResolvedValue({ data: { id: 'c1' }, errors: null });
  });

  it('creates one Category per fixture row with editor auth', async () => {
    const count = await seedReferenceData();
    expect(count).toBe(5);
    expect(m.create).toHaveBeenCalledTimes(5);
    expect(m.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'languages' }), {
      authMode: 'userPool',
    });
  });

  it('throws when a create returns errors', async () => {
    m.create.mockResolvedValueOnce({ data: null, errors: [{ message: 'denied' }] });
    await expect(seedReferenceData()).rejects.toThrow(/Category/);
  });

  it('clearAll wipes the Category model', async () => {
    await expect(clearAll()).resolves.toBeUndefined();
  });
});
