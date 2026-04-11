/**
 * Migration Script to upload hospital_directory.csv data into Supabase
 * Usage: node scripts/migrateToSupabase.js
 */
require('dotenv').config();
const csvLoader = require('../services/csvLoader');
const supabase = require('../config/supabaseClient');

async function migrate() {
  console.log('🚀 Starting Data Migration to Supabase...');

  if (!supabase) {
    console.error('❌ Supabase client is not initialized. Check your credentials in .env');
    process.exit(1);
  }

  // Load hospitals locally using the existing CSV loader
  console.log('📋 Loading hospitals from CSV...');
  await csvLoader.loadHospitals();
  const hospitals = csvLoader.getAllHospitals();

  console.log(`✅ Loaded ${hospitals.length} valid hospitals from CSV.`);

  if (hospitals.length === 0) {
    console.log('⚠️ No hospitals to migrate.');
    process.exit(0);
  }

  // Insert in batches of 1000
  const BATCH_SIZE = 1000;
  let totalInserted = 0;

  for (let i = 0; i < hospitals.length; i += BATCH_SIZE) {
    const batch = hospitals.slice(i, i + BATCH_SIZE).map(h => ({
      name: h.name,
      address: h.address,
      latitude: h.latitude,
      longitude: h.longitude
    }));

    console.log(`⏳ Uploading batch ${i} to ${Math.min(i + BATCH_SIZE, hospitals.length)}...`);
    const { data, error } = await supabase.from('hospitals').insert(batch);

    if (error) {
      console.error('❌ Error inserting batch:', error.message);
      process.exit(1);
    }
    
    totalInserted += batch.length;
  }

  console.log(`🎉 Migration Complete! Inserted ${totalInserted} hospitals into Supabase.`);
  process.exit(0);
}

migrate();
