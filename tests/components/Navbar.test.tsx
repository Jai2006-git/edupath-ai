import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../../src/components/Navbar';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Top Navigation Bar', () => {
  it('should render the EduPath logo and navigation elements', () => {
    const handleOpenSettings = vi.fn();
    render(
      <StudyPlanProvider>
        <Navbar onOpenSettings={handleOpenSettings} />
      </StudyPlanProvider>
    );

    expect(screen.getByText('EduPath')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('should render the Settings trigger button and trigger callback', () => {
    const handleOpenSettings = vi.fn();
    render(
      <StudyPlanProvider>
        <Navbar onOpenSettings={handleOpenSettings} />
      </StudyPlanProvider>
    );

    const settingsBtn = screen.getByLabelText(/settings & ai model/i);
    expect(settingsBtn).toBeInTheDocument();
    fireEvent.click(settingsBtn);
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });
});
