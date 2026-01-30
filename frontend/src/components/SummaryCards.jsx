import React from 'react';

const SummaryCards = ({ baselineCost, optimizedCost, savings, savingsPercentage }) => {
  const cards = [
    {
      title: 'Baseline Cost',
      value: `₹${(baselineCost * 83).toFixed(2)}`,
      subtitle: 'Grid-only scenario',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      isHighlight: false
    },
    {
      title: 'Optimized Cost',
      value: `₹${(optimizedCost * 83).toFixed(2)}`,
      subtitle: 'With microgrid optimization',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      isHighlight: true
    },
    {
      title: 'Total Savings',
      value: `₹${(savings * 83).toFixed(2)}`,
      subtitle: 'Absolute cost reduction',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      isHighlight: false
    },
    {
      title: 'Efficiency Gain',
      value: `${savingsPercentage.toFixed(1)}%`,
      subtitle: 'Relative to baseline',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      isHighlight: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-scada-surface rounded border transition-all ${card.isHighlight
              ? 'border-amber-500'
              : 'border-scada-border hover:border-amber-500/50'
            } p-6`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-scada-textMuted uppercase tracking-wider">
              {card.title}
            </h3>
            <div className={`${card.isHighlight ? 'text-amber-400' : 'text-scada-textMuted'}`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-3xl lg:text-4xl font-bold mb-2 ${card.isHighlight ? 'text-amber-400' : 'text-scada-text'
            }`}>
            {card.value}
          </p>
          <p className="text-sm text-scada-textMuted font-medium">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
