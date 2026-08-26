import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RebalanceModal } from '../../src/components/RebalanceModal';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Integration Tests: Rebalance Schedule Modal & Apply Flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow selecting an adjustment reason and applying AI rebalance', () => {
    const handleClose = vi.fn();
    render(
      <StudyPlanProvider>
        <RebalanceModal isOpen={true} onClose={handleClose} />
      </StudyPlanProvider>
    );

    // Select reason
    const reasonBtn = screen.getByText(/I fell behind \/ missed 1-2 study days/i);
    fireEvent.click(reasonBtn);

    // Apply button
    const applyBtn = screen.getByRole('button', { name: /apply ai rebalance/i });
    expect(applyBtn).toBeInTheDocument();
    fireEvent.click(applyBtn);

    // Fast-forward animation timers
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(handleClose).toHaveBeenCalled();
  });
});
