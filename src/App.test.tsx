import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// App mounts the Discover route which fetches shelves; stub the data hook so
// the shell test stays focused on rendering without touching the SDK.
vi.mock('./features/discover/useShelves', () => ({
  useShelves: () => ({ data: [], isLoading: false }),
}));

// App wraps the tree in AuthProvider, which probes the Cognito session on mount
// via authClient — stub that SDK-touching module.
vi.mock('./features/auth/authClient', () => ({
  currentEmail: vi.fn().mockResolvedValue(null),
  currentGroups: vi.fn().mockResolvedValue([]),
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}));

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
  });
});
