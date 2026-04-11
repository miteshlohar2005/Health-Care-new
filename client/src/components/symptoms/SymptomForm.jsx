import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import VoiceInputButton from '../ui/VoiceInputButton';

const SymptomForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    symptoms: '',
    duration: ''
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: t('symptoms.form.options.male') },
    { value: 'female', label: t('symptoms.form.options.female') },
    { value: 'other', label: t('symptoms.form.options.other') },
    { value: 'prefer-not-to-say', label: t('symptoms.form.options.prefer_not_to_say') }
  ];

  const durationOptions = [
    { value: 'few-hours', label: t('symptoms.form.options.hours') },
    { value: '1-day', label: t('symptoms.form.options.days_1') },
    { value: '2-3-days', label: t('symptoms.form.options.days_2_3') },
    { value: '1-week', label: t('symptoms.form.options.weeks_1') },
    { value: '2-weeks', label: t('symptoms.form.options.weeks_2') },
    { value: '1-month', label: t('symptoms.form.options.months_1') }
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = t('symptoms.form.errors.age');
    }

    if (!formData.symptoms || formData.symptoms.trim().length < 10) {
      newErrors.symptoms = t('symptoms.form.errors.symptoms');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Age and Gender Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('symptoms.form.age')}
          type="number"
          placeholder={t('symptoms.form.age_placeholder')}
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
          error={errors.age}
          icon={User}
          required
          min="1"
          max="120"
        />

        <Select
          label={t('symptoms.form.gender')}
          options={genderOptions}
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          placeholder={t('symptoms.form.gender_placeholder')}
        />
      </div>

      {/* Symptoms */}
      <div className="relative">
        <Textarea
          label={t('symptoms.form.symptoms')}
          placeholder={t('symptoms.form.symptoms_placeholder')}
          value={formData.symptoms}
          onChange={(e) => handleChange('symptoms', e.target.value)}
          error={errors.symptoms}
          required
          rows={6}
        />
        <VoiceInputButton
          className="absolute right-2 bottom-2"
          onResult={(text) => {
            const newText = formData.symptoms ? `${formData.symptoms} ${text}` : text;
            handleChange('symptoms', newText);
          }}
        />
      </div>

      {/* Duration */}
      <Select
        label={t('symptoms.form.duration')}
        options={durationOptions}
        value={formData.duration}
        onChange={(e) => handleChange('duration', e.target.value)}
        placeholder={t('symptoms.form.duration_placeholder')}
        icon={Clock}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
        icon={Send}
        iconPosition="right"
      >
        {t('symptoms.form.submit')}
      </Button>

      {/* Privacy Notice */}
      <p className="text-sm text-gray-400 text-center">
        {t('symptoms.form.privacy')}
      </p>
    </motion.form>
  );
};

export default SymptomForm;
