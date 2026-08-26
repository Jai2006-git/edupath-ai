import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RebalanceModal } from '../../src/components/RebalanceModal';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Rebalance Schedule Modal', () => {
  it('should render all 4 adjustment reasons when open', () => {
    const handleClose = vi.fn();
    render(
      <StudyPlanProvider>
        <RebalanceModal isOpen={true} onClose={handleClose} />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/AI Schedule Rebalance/i)).toBeInTheDocument();
    expect(screen.getByText(/I fell behind \/ missed 1-2 study days/i)).toBeInTheDocument();
    expect(screen.getByText(/My exam date or priority changed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply ai rebalance/i })).toBeInTheDocument();
  });
});
