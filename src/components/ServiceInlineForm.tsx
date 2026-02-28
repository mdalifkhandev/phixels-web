import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Calendar, Check, ChevronDown, Clock, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BOOKED_SLOTS, COUNTRY_CODES } from '../constants/common';
import { FileUpload } from './FileUpload';
import { Button } from './ui/Button';

const GAS_DEPLOYMENT_URL =
  import.meta.env.VITE_GAS_DEPLOYMENT_URL || 'https://script.google.com/macros/s/AKfycbzYH-TfT_uR-2uxR8G2my7KElsR_x0f9GekGO35oSqq-qXkjI8k1zPSRvbIrATJDCg/exec';

const budgetOptions = [
  'Less than $1k',
  '$1k - $3k',
  '$3k - $10k',
  '$10k - $20k',
  '$20k - $50k',
  'More than $50k',
];

const validatePhone = (phone: string, countryCode: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const minLength = countryCode === '+1' ? 10 : 7;
  const maxLength = countryCode === '+1' ? 10 : 15;
  return cleaned.length >= minLength && cleaned.length <= maxLength && /^\d+$/.test(cleaned);
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

async function submitData(formDataPayload: Record<string, string>) {
  const params = new URLSearchParams();
  Object.keys(formDataPayload).forEach((key) => {
    params.append(key, formDataPayload[key] || '');
  });

  const response = await fetch(GAS_DEPLOYMENT_URL, {
    method: 'POST',
    mode: 'cors',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function ServiceInlineForm({ serviceTitle }: { serviceTitle: string }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const budgetDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    date: '',
    time: '',
    overview: '',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        budgetDropdownRef.current &&
        !budgetDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBudgetDropdown(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
        setCountrySearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.name.toLowerCase().startsWith(countrySearch.toLowerCase()),
  );

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    };
  });

  const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      nextErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone, selectedCountry.code)) {
      nextErrors.phone = `Please enter a valid phone number for ${selectedCountry.name}`;
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Work Email is required';
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = 'Please enter a valid work email address';
    }

    if (!formData.budget) {
      nextErrors.budget = 'Please select your budget range';
    }

    if (!formData.overview.trim()) {
      nextErrors.overview = 'Project description is required';
    } else if (formData.overview.trim().length < 10) {
      nextErrors.overview = 'Please provide a more detailed description (min. 10 chars)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isSlotBooked = (dateStr: string, timeStr: string) =>
    BOOKED_SLOTS.some((slot) => slot.date.includes(dateStr) && slot.time === timeStr);

  const handleFirstStepSubmit = async () => {
    if (!validateStep1()) return;
    setIsSubmitting(true);
    try {
      const newRequestId = crypto.randomUUID();
      setRequestId(newRequestId);

      const allFilesData = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            data: base64,
          };
        }),
      );

      const payload = {
        formType: 'service-inline',
        fullName: formData.name,
        email: formData.email,
        phone: `${selectedCountry.code.replace('+', '')} ${formData.phone}`,
        country: selectedCountry.name,
        budget: formData.budget,
        description: `[${serviceTitle}] ${formData.overview}`,
        filesData: JSON.stringify(allFilesData),
        requestId: newRequestId,
        isFinal: 'false',
      };

      await submitData(payload);
      setStep(2);
    } catch (error) {
      setSuccessMessage('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const allFilesData = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            data: base64,
          };
        }),
      );

      const payload = {
        formType: 'service-inline',
        fullName: formData.name,
        email: formData.email,
        phone: `${selectedCountry.code.replace('+', '')} ${formData.phone}`,
        country: selectedCountry.name,
        budget: formData.budget,
        description: `[${serviceTitle}] ${formData.overview}`,
        filesData: JSON.stringify(allFilesData),
        meetingDate: formData.date,
        meetingTime: formData.time,
        requestId: requestId || crypto.randomUUID(),
        isFinal: 'true',
      };

      await submitData(payload);
      setSuccessMessage('Your booking has been submitted successfully.');
    } catch (error) {
      setSuccessMessage('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/95 p-5 md:p-6 shadow-2xl">
      <div className="mb-5">
        <h3 className="text-base font-bold text-white uppercase tracking-wide">
          Step {step} -{' '}
          {step === 1
            ? 'Project Basics'
            : step === 2
            ? 'Select Date'
            : step === 3
            ? 'Select Time'
            : 'Review & Confirm'}
        </h3>
        <div className="flex gap-2 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step >= i ? 'bg-[color:var(--bright-red)]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[color:var(--vibrant-green)]/20 flex items-center justify-center mx-auto mb-3">
            <Check className="text-[color:var(--vibrant-green)]" size={24} />
          </div>
          <p className="text-sm text-white">{successMessage}</p>
        </div>
      ) : (
        <>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-white focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-white/10 focus:border-[color:var(--bright-red)]'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1 relative" ref={countryDropdownRef}>
                  <label className="text-xs text-gray-400">Phone *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className={`bg-white/5 border rounded-lg px-3 py-2.5 text-white flex items-center gap-2 ${
                        errors.phone ? 'border-red-500' : 'border-white/10'
                      }`}
                    >
                      <span>{selectedCountry.flag}</span>
                      <span className="text-sm">{selectedCountry.code}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-white focus:outline-none ${
                        errors.phone
                          ? 'border-red-500'
                          : 'border-white/10 focus:border-[color:var(--bright-red)]'
                      }`}
                      placeholder="123 456 7890"
                    />
                  </div>
                  {showCountryDropdown && (
                    <div className="absolute z-50 mt-2 w-64 max-h-56 overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl custom-scrollbar">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search countries..."
                        className="w-full px-3 py-2 bg-white/5 border-b border-white/10 text-white text-sm focus:outline-none"
                      />
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code + country.country}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                            setCountrySearch('');
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-white/10 text-sm flex items-center gap-2"
                        >
                          <span>{country.flag}</span>
                          <span className="text-white flex-1">{country.name}</span>
                          <span className="text-gray-400">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Work Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-white focus:outline-none ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-white/10 focus:border-[color:var(--bright-red)]'
                    }`}
                    placeholder="john@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1 relative" ref={budgetDropdownRef}>
                  <label className="text-xs text-gray-400">Budget Range</label>
                  <button
                    type="button"
                    onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-left text-white flex items-center justify-between"
                  >
                    <span className={formData.budget ? 'text-white' : 'text-gray-500'}>
                      {formData.budget || 'Select Budget'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {showBudgetDropdown && (
                    <div className="absolute z-50 mt-2 left-0 right-0 bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden">
                      {budgetOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, budget: option });
                            setShowBudgetDropdown(false);
                            if (errors.budget) setErrors({ ...errors, budget: '' });
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.budget && (
                    <p className="text-red-500 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.budget}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Project Description *</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => {
                    setFormData({ ...formData, overview: e.target.value });
                    if (errors.overview) setErrors({ ...errors, overview: '' });
                  }}
                  className={`w-full h-20 bg-white/5 border rounded-lg px-3 py-2.5 text-white focus:outline-none resize-none ${
                    errors.overview
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-[color:var(--bright-red)]'
                  }`}
                  placeholder="Briefly describe your project vision..."
                />
                {errors.overview && (
                  <p className="text-red-500 text-[10px] flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.overview}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Attachments (Optional)</label>
                <FileUpload files={files} onFilesChange={setFiles} compact />
              </div>

              <Button
                onClick={handleFirstStepSubmit}
                disabled={isSubmitting}
                className="w-full"
                variant="primary"
                glow
              >
                {isSubmitting ? 'Processing...' : "Let's Connect"}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <p className="text-sm text-gray-400">Select a date for discussion</p>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setFormData({ ...formData, date: d.full })}
                    className={`p-2 rounded-lg border transition-all ${
                      formData.date === d.full
                        ? 'bg-[color:var(--bright-red)] border-[color:var(--bright-red)] text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-[color:var(--neon-yellow)]'
                    }`}
                  >
                    <div className="text-[11px] opacity-70">{d.day}</div>
                    <div className="text-base font-bold">{d.date}</div>
                  </button>
                ))}
              </div>
              <div>
                <Button onClick={() => setStep(3)} disabled={!formData.date} className="w-full">
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> {formData.date}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = isSlotBooked(formData.date, time);
                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`p-2.5 rounded-lg border text-sm flex items-center justify-center gap-2 ${
                        isBooked
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5'
                          : formData.time === time
                          ? 'bg-[color:var(--bright-red)] border-[color:var(--bright-red)] text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-[color:var(--neon-yellow)]'
                      }`}
                    >
                      <Clock size={14} />
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                >
                  Back
                </button>
                <Button onClick={() => setStep(4)} disabled={!formData.time} className="flex-1">
                  Review & Confirm
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden text-sm">
                <div className="p-3 border-b border-white/10">
                  <p className="text-white font-medium mb-1">Contact Info</p>
                  <p className="text-gray-300">{formData.name} • {formData.email}</p>
                  <p className="text-gray-400">
                    {selectedCountry.code} {formData.phone}
                  </p>
                  <p className="text-gray-400">{formData.budget}</p>
                </div>

                <div className="p-3 border-b border-white/10 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium mb-1">Appointment</p>
                    <p className="text-gray-400">{formData.date}</p>
                    <p className="text-gray-400">{formData.time}</p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                    aria-label="Edit appointment"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>

                <div className="p-3">
                  <p className="text-white font-medium mb-1">Project Note</p>
                  <p className="text-gray-400 line-clamp-2">{formData.overview}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                >
                  Back
                </button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={!formData.time || isSubmitting}
                  className="flex-1"
                  glow
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

