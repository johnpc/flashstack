import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// App mounts the Discover route which fetches shelves; stub the data hook so
// the shell test stays focused on rendering without touching the SDK.
vi.mock('./features/discover/useShelves', () => ({
  useShelves: () => ({ data: [], isLoading: false }),
}));

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
  });
});
