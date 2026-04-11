import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import LocationInput from '../components/hospitals/LocationInput';
import HospitalCard from '../components/hospitals/HospitalCard';
import BackgroundWrapper from '../components/ui/BackgroundWrapper';
import GradientText from '../components/ui/GradientText';
import { findNearestHospitals } from '../services/api';

const HospitalLocator = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const handleSearch = async (locationData) => {
    setLoading(true);
    setHospitals([]);

    try {
      const response = await findNearestHospitals(locationData);
      const data = response.data || response;

      if (data && data.length > 0) {
        setHospitals(data);
        setUserLocation({
          latitude: locationData.latitude,
          longitude: locationData.longitude
        });
        toast.success(t('hospitals.toasts.found', { count: data.length }));
      } else {
        toast.info(t('hospitals.toasts.none_found'));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || t('hospitals.toasts.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setHospitals([]);
    setUserLocation(null);
  };

  return (
    <BackgroundWrapper>
      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-4 shadow-lg shadow-teal-500/10">
              <MapPin className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              <GradientText>{t('hospitals.title')}</GradientText>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              {t('hospitals.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          {hospitals.length === 0 && !loading && (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-teal-500/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <LocationInput onSubmit={handleSearch} loading={loading} />
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-teal-500/20 shadow-[0_0_30px_rgba(0,255,163,0.1)]">
              <Loader message={t('hospitals.loading')} size="default" />
            </Card>
          )}

          {/* Results */}
          {hospitals.length > 0 && !loading && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {hospitals.length} {t('hospitals.found_msg')}
                  </h2>
                  {userLocation && (
                    <p className="text-gray-400 text-sm mt-1">
                      {t('hospitals.near')} {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleNewSearch}
                  className="text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                >
                  ← {t('common.new_search')}
                </button>
              </div>

              {/* Hospital List */}
              <div className="space-y-4">
                {hospitals.map((hospital, index) => (
                  <HospitalCard
                    key={index}
                    hospital={hospital}
                    index={index}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {hospitals.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="text-center py-12 backdrop-blur-md bg-white/5 border border-white/10" hover={false}>
                <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {t('hospitals.empty_state')}
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </BackgroundWrapper>
  );
};

export default HospitalLocator;
