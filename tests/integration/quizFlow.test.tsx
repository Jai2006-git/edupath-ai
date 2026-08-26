import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizView } from '../../src/pages/QuizView';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Integration Tests: Active Recall Quiz Execution Flow', () => {
  it('should start a quiz and allow answering questions with instant feedback', async () => {
    render(
      <StudyPlanProvider>
        <QuizView />
      </StudyPlanProvider>
    );

    // Start quiz
    const startBtn = screen.getByRole('button', { name: /generate ai active recall drill/i });
    fireEvent.click(startBtn);

    // Wait for quiz generation to finish
    await waitFor(() => {
      expect(screen.getByText(/Active Retrieval Drill/i)).toBeInTheDocument();
    });

    // Pick first option
    const optionBtns = screen.getAllByRole('button').filter(b => b.textContent?.includes('A') || b.textContent?.includes('B'));
    expect(optionBtns.length).toBeGreaterThan(0);
    fireEvent.click(optionBtns[0]);

    // Invariant Breakdown appears
    await waitFor(() => {
      expect(screen.getByText(/AI Pedagogical Invariant Breakdown/i)).toBeInTheDocument();
    });
  });
});
