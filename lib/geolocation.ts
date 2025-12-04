/**
 * Utility functions for geolocation-based locale detection
 */

// French-speaking countries and regions
const FRENCH_SPEAKING_COUNTRIES = ['FR', 'BE', 'CH', 'MC', 'LU']; // France, Belgium, Switzerland, Monaco, Luxembourg
const FRENCH_SPEAKING_REGIONS: Record<string, string[]> = {
  CA: ['QC'], // Quebec, Canada
  CH: ['GE', 'VD', 'NE', 'JU'], // French-speaking Swiss cantons
};

/**
 * Check if a country/region combination indicates a French-speaking area
 */
export function isFrenchSpeakingRegion(
  country: string | null,
  region: string | null
): boolean {
  if (!country) return false;

  // Check if country is French-speaking
  if (FRENCH_SPEAKING_COUNTRIES.includes(country.toUpperCase())) {
    return true;
  }

  // Check region-specific cases (e.g., Quebec in Canada)
  const countryUpper = country.toUpperCase();
  if (FRENCH_SPEAKING_REGIONS[countryUpper]) {
    const regionUpper = region?.toUpperCase() || '';
    return FRENCH_SPEAKING_REGIONS[countryUpper].includes(regionUpper);
  }

  return false;
}

/**
 * Detect locale from Vercel geolocation headers
 */
export function detectLocaleFromHeaders(
  country: string | null,
  region: string | null
): 'en' | 'fr' | null {
  if (isFrenchSpeakingRegion(country, region)) {
    return 'fr';
  }
  return null; // Return null to use default locale
}

