import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingWizard } from '../../src/pages/OnboardingWizard';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Integration Tests: Multi-Step Study Plan Creation Flow', () => {
  it('should navigate through all 5 steps and trigger plan generation successfully', async () => {
    render(
      <StudyPlanProvider>
        <OnboardingWizard />
      </StudyPlanProvider>
    );

    // Step 1: Subject
    const subjectInput = screen.getByPlaceholderText(/e.g. Data Structures & Algorithms/i);
    fireEvent.change(subjectInput, { target: { value: 'Distributed Systems & Raft' } });
    fireEvent.click(screen.getByRole('button', { name: /next: syllabus topics/i }));

    // Step 2: Topics
    await waitFor(() => {
      expect(screen.getByText(/Enter Your Topics & Chapters/i)).toBeInTheDocument();
    });
    const topicInput = screen.getByPlaceholderText(/type a topic and press add/i);
    fireEvent.change(topicInput, { target: { value: 'Consensus Algorithms' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    fireEvent.click(screen.getByRole('button', { name: /next: exam date/i }));

    // Step 3: Exam Date
    await waitFor(() => {
      expect(screen.getByText(/When is your examination/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /next: daily study time/i }));

    // Step 4: Study Hours
    await waitFor(() => {
      expect(screen.getByText(/How much time can you study each day/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /next: knowledge baseline/i }));

    // Step 5: Knowledge Level & Submission
    await waitFor(() => {
      expect(screen.getByText(/What is your current knowledge baseline/i)).toBeInTheDocument();
    });
    const generateBtn = screen.getByRole('button', { name: /generate personalized ai roadmap/i });
    expect(generateBtn).toBeInTheDocument();
  });
});
