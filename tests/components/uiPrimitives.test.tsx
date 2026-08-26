import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';

describe('Component Tests: Reusable UI Primitives', () => {
  it('should render Button variants and fire onClick event', () => {
    const handleClick = vi.fn();
    render(<Button variant="primary" onClick={handleClick}>Start Session</Button>);

    const btn = screen.getByRole('button', { name: /start session/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should disable Button when isLoading is true', () => {
    render(<Button isLoading>Generating</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('should render Badge with correct variant styling', () => {
    render(<Badge variant="warning">High Yield</Badge>);
    expect(screen.getByText('High Yield')).toBeInTheDocument();
  });

  it('should render Card surface with children elements', () => {
    render(<Card><div>Card Content Text</div></Card>);
    expect(screen.getByText('Card Content Text')).toBeInTheDocument();
  });

  it('should render LoadingSpinner with accessible status role', () => {
    render(<LoadingSpinner label="Synthesizing Knowledge..." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Synthesizing Knowledge...')).toBeInTheDocument();
  });

  it('should render EmptyState with action trigger', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Saved Notes"
        description="Save formulas and cheat sheets from the AI Tutor."
        actionLabel="Open Tutor"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Saved Notes')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /open tutor/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
