/**
 * Utility function to get the localized field value
 * @param obj - Object with _en and _fr fields
 * @param locale - Current locale ('en' | 'fr')
 * @param field - Field name without locale suffix
 * @returns The localized field value
 */
export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  locale: 'en' | 'fr',
  field: string
): any {
  const fieldKey = `${field}_${locale}` as keyof T;
  return obj[fieldKey] || '';
}

/**
 * Get localized value from object with _en/_fr pattern
 */
export function getLocalizedValue<T>(
  obj: { [key: string]: T },
  locale: 'en' | 'fr',
  baseKey: string
): T | undefined {
  const key = `${baseKey}_${locale}`;
  return obj[key];
}

/**
 * Extract plain text from PortableText blocks (for meta descriptions)
 */
export function extractTextFromPortableText(blocks: any[] | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => {
      return block.children
        .filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join('');
    })
    .join(' ')
    .trim()
    .substring(0, 160); // Limit to 160 characters for meta description
}

