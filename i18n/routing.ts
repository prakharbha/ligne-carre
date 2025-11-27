import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing.config';

// Re-export routing for convenience
export { routing };

// Create navigation helpers (client-side only)
// These should only be imported in client components
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

