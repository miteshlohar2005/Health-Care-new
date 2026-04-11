import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Button from '../ui/Button';

const HospitalCard = ({ hospital, index, userLocation }) => {
  const { t } = useTranslation();
  const { name, address, distance, latitude, longitude, phone } = hospital;

  // Distance color coding
  const getDistanceColor = () => {
    if (!distance) return 'bg-gray-900/20 text-gray-400 border-gray-800';
    if (distance < 5) return 'bg-green-900/20 text-green-400 border-green-800';
    if (distance < 10) return 'bg-amber-900/20 text-amber-400 border-amber-800';
    return 'bg-red-900/20 text-red-400 border-red-800';
  };

  const openDirections = () => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      url += `&origin=${userLocation.latitude},${userLocation.longitude}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20">
              <MapPin className="w-7 h-7 text-teal-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {name}
              </h3>

              {/* Distance Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border whitespace-nowrap ${getDistanceColor()}`}>
                Distance: {distance?.toFixed(2)} km
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-2 line-clamp-2">
              {address}
            </p>
            <p className="text-teal-300 text-sm font-medium mb-4">
              Distance: {hospital.distance?.toFixed(2)} km
            </p>

            {/* Coordinates */}
            <p className="text-xs text-gray-500 mb-4">
              📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Navigation}
                onClick={openDirections}
                className="flex-1 sm:flex-none"
              >
                {t('hospitals.card.directions')}
              </Button>

              {phone && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Phone}
                  onClick={() => window.location.href = `tel:${phone}`}
                  className="flex-1 sm:flex-none"
                >
                  {t('hospitals.card.call')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default HospitalCard;
