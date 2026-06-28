import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { TabBar } from './TabBar';

function renderTabBar(active?: string) {
  return render(
    <MemoryRouter>
      <TabBar active={active} />
    </MemoryRouter>,
  );
}

describe('TabBar', () => {
  it('marks the active tab with aria-current', () => {
    renderTabBar('Discover');
    expect(screen.getByRole('link', { name: 'Discover' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders wired tabs as links and placeholders as buttons', () => {
    renderTabBar('Discover');
    expect(screen.getByRole('link', { name: 'Discover' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Decks' })).toBeInTheDocument();
    // "You" is not wired yet — still a placeholder button.
    expect(screen.getByRole('button', { name: 'You' })).toBeInTheDocument();
  });

  it('defaults the active tab to Discover', () => {
    renderTabBar();
    expect(screen.getByRole('link', { name: 'Discover' })).toHaveAttribute('aria-current', 'page');
  });
});
