import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/ui/Button';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { EmptyState } from '../src/components/ui/EmptyState';

describe('Reusable UI Components', () => {
  it('should render Button and handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Start Quiz</Button>);

    const button = screen.getByRole('button', { name: /start quiz/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render Button loading state with disabled interaction', () => {
    render(<Button isLoading>Generating Plan</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render Badge with correct variant styling', () => {
    render(<Badge variant="success">Mastered</Badge>);
    expect(screen.getByText('Mastered')).toBeInTheDocument();
  });

  it('should render Card with children content', () => {
    render(<Card><h3>Milestone 1</h3></Card>);
    expect(screen.getByText('Milestone 1')).toBeInTheDocument();
  });

  it('should render EmptyState with title and action trigger', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Past Quizzes"
        description="Take your first quiz to begin tracking weak areas."
        actionLabel="Take Quiz"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Past Quizzes')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /take quiz/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
