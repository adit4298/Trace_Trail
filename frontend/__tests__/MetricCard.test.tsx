import { render, screen } from '@testing-library/react';

import { MetricCard } from '@/components/cards/MetricCard';
import type { MetricSummary } from '@/lib/types';

const baseMetric: MetricSummary = {
  id: 'risk-score',
  label: 'Risk Score',
  value: '23.4',
  change: 4.2,
  trend: 'up',
  target: 30,
  progress: 0.78,
  annotation: 'Lower is better'
};

describe('MetricCard', () => {
  it('renders metric value and change', () => {
    render(<MetricCard metric={baseMetric} />);

    expect(screen.getByText(baseMetric.label)).toBeInTheDocument();
    expect(screen.getByText(baseMetric.value)).toBeInTheDocument();
    expect(screen.getByText('+4.2%')).toBeInTheDocument();
  });

  it('caps progress at 100%', () => {
    const metric: MetricSummary = { ...baseMetric, progress: 1.5 };
    render(<MetricCard metric={metric} />);

    expect(screen.getByText('150%')).toBeInTheDocument();
  });
});

