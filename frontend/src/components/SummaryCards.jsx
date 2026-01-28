import React from 'react';

const SummaryCards = ({ baselineCost, optimizedCost, savings, savingsPercentage }) => {
  const cards = [
    {
      title: 'Baseline Cost',
      value: `$${baselineCost.toFixed(2)}`,
      subtitle: 'Grid-only scenario',
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      subtitleColor: 'text-gray-600'
    },
    {
      title: 'Optimized Cost',
      value: `$${optimizedCost.toFixed(2)}`,
      subtitle: 'With microgrid',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      subtitleColor: 'text-blue-600'
    },
    {
      title: 'Total Savings',
      value: `$${savings.toFixed(2)}`,
      subtitle: 'Cost reduction',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      subtitleColor: 'text-green-600'
    },
    {
      title: 'Savings Percentage',
      value: `${savingsPercentage.toFixed(1)}%`,
      subtitle: 'vs baseline',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      subtitleColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow p-6 border border-${card.color}-200`}
        >
          <h3 className={`text-sm font-medium ${card.subtitleColor} uppercase tracking-wide`}>
            {card.title}
          </h3>
          <p className={`mt-2 text-4xl font-bold ${card.textColor}`}>
            {card.value}
          </p>
          <p className={`mt-1 text-sm ${card.subtitleColor}`}>
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
