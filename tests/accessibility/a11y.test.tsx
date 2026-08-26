import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../../src/pages/LandingPage';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';
import { Button } from '../../src/components/ui/Button';

describe('Accessibility & a11y Compliance Tests', () => {
  it('should ensure all interactive buttons have accessible text labels', () => {
    render(<Button>Continue to Next Step</Button>);
    expect(screen.getByRole('button', { name: /continue to next step/i })).toBeInTheDocument();
  });

  it('should have semantic heading hierarchy and landmark regions on LandingPage', () => {
    render(
      <StudyPlanProvider>
        <LandingPage />
      </StudyPlanProvider>
    );

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(4);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});
