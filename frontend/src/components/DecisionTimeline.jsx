import React from 'react';

const DecisionTimeline = ({ data }) => {
  const getDecisionColor = (decisionType) => {
    const colors = {
      'GRID_SUPPLY': 'bg-gray-100 border-gray-300 text-gray-800',
      'SOLAR_ONLY': 'bg-yellow-100 border-yellow-300 text-yellow-900',
      'SOLAR_TO_BATTERY': 'bg-green-100 border-green-300 text-green-900',
      'BATTERY_DISCHARGE': 'bg-orange-100 border-orange-300 text-orange-900',
      'SOLAR_AND_BATTERY': 'bg-blue-100 border-blue-300 text-blue-900',
      'SOLAR_AND_GRID': 'bg-purple-100 border-purple-300 text-purple-900',
      'DEFAULT': 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colors[decisionType] || colors['DEFAULT'];
  };

  const getDecisionBadgeColor = (decisionType) => {
    const colors = {
      'GRID_SUPPLY': 'bg-gray-200 text-gray-800',
      'SOLAR_ONLY': 'bg-yellow-200 text-yellow-900',
      'SOLAR_TO_BATTERY': 'bg-green-200 text-green-900',
      'BATTERY_DISCHARGE': 'bg-orange-200 text-orange-900',
      'SOLAR_AND_BATTERY': 'bg-blue-200 text-blue-900',
      'SOLAR_AND_GRID': 'bg-purple-200 text-purple-900',
      'DEFAULT': 'bg-gray-200 text-gray-800'
    };
    return colors[decisionType] || colors['DEFAULT'];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hour
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Decision Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Explanation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr 
              key={item.hour}
              className={`${getDecisionColor(item.decision_type)} border-l-4`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {item.hour}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDecisionBadgeColor(item.decision_type)}`}>
                  {item.decision_type.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4 text-sm max-w-md">
                {item.explanation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${item.cost_usd.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DecisionTimeline;
