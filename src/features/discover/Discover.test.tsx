import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const hook = vi.hoisted(() => ({ value: {} as ReturnType<typeof useShelvesMock> }));
function useShelvesMock() {
  return { data: [{ slug: 'lang', title: 'Languages', sortOrder: 1 }], isLoading: false };
}
vi.mock('./useShelves', () => ({ useShelves: () => hook.value }));
// Discover renders the editor-only EditorLink, which probes Cognito groups —
// stub it so the shelf test stays focused and SDK-free.
vi.mock('../admin/EditorLink', () => ({ EditorLink: () => null }));

import { Discover } from './Discover';
import { useShelves } from './useShelves';
void useShelves;

function renderDiscover() {
  return render(
    <MemoryRouter>
      <Discover />
    </MemoryRouter>,
  );
}

describe('Discover', () => {
  beforeEach(() => {
    hook.value = useShelvesMock();
  });

  it('renders a shelf per category', async () => {
    renderDiscover();
    await waitFor(() => expect(screen.getByText('Languages')).toBeInTheDocument());
    expect(screen.getAllByTestId('shelf')).toHaveLength(1);
  });

  it('shows a loading state while shelves load', () => {
    hook.value = { data: undefined as never, isLoading: true };
    renderDiscover();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
