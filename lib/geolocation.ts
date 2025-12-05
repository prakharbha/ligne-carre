/**
 * Utility functions for detecting locale based on geolocation
 */

// French-speaking countries
const FRENCH_SPEAKING_COUNTRIES = ['FR', 'BE', 'CH', 'MC', 'LU'];

// French-speaking regions (country + region combinations)
const FRENCH_SPEAKING_REGIONS: Record<string, string[]> = {
  CA: ['QC'], // Quebec, Canada
  CH: ['GE', 'VD', 'NE', 'JU'], // French-speaking Swiss cantons
};

/**
 * Check if a country/region combination is French-speaking
 */
export function isFrenchSpeakingRegion(country: string | null, region: string | null): boolean {
  if (!country) return false;

  // Check if country is French-speaking
  if (FRENCH_SPEAKING_COUNTRIES.includes(country)) {
    return true;
  }

  // Check if region is French-speaking
  const regions = FRENCH_SPEAKING_REGIONS[country];
  if (regions && region && regions.includes(region)) {
    return true;
  }

  return false;
}

/**
 * Detect locale from geolocation headers
 * Returns 'fr' if French-speaking region detected, null otherwise
 */
export function detectLocaleFromHeaders(
  country: string | null,
  region: string | null
): 'fr' | null {
  if (isFrenchSpeakingRegion(country, region)) {
    return 'fr';
  }
  return null;
}

