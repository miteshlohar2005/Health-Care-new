const supabase = require('../config/supabaseClient');

const dbService = {
  getAllHospitals: async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Fetch hospitals from Supabase using only specified fields
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, address, latitude, longitude');
      
      if (error) {
        throw error;
      }
      
      // Ensure function returns clean numeric latitude and longitude
      return data.map(hospital => ({
        id: hospital.id,
        name: hospital.name,
        address: hospital.address,
        latitude: hospital.latitude ? parseFloat(hospital.latitude) : null,
        longitude: hospital.longitude ? parseFloat(hospital.longitude) : null
      }));
    } catch (error) {
      console.error('Error fetching hospitals from Supabase:', error);
      return [];
    }
  }
};

module.exports = dbService;
