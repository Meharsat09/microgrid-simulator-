import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const runSimulation = async (config = {}) => {
  try {
    const defaultConfig = {
      solar_capacity: 6.0,
      battery: {
        capacity: 10.0,
        min_soc: 0.2,
        max_soc: 0.95,
        max_charge_rate: 5.0,
        max_discharge_rate: 5.0,
        efficiency: 0.95,
        initial_soc: 0.5
      },
      grid_carbon_intensity: 0.42
    };

    const response = await axios.post(
      `${API_BASE_URL}/simulate`,
      { ...defaultConfig, ...config }
    );

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
