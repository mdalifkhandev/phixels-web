import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js/min';

/**
 * Validates a phone number based on the provided country ISO code.
 * @param phone The phone number string to validate.
 * @param countryIsoCode The ISO 3166-1 alpha-2 country code.
 * @returns boolean indicating if the phone number is valid.
 */
export const validatePhone = (phone: string, countryIsoCode: string) => {
  try {
    return isValidPhoneNumber(phone, countryIsoCode as CountryCode);
  } catch (error) {
    return false;
  }
};
