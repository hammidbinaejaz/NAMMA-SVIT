/**
 * Production Cleanup: Suppress harmless React warnings
 * 
 * Filters out:
 * - Recharts defaultProps deprecation warnings
 * - React-calendar hydration mismatches (aria-label date format differences)
 * - React DevTools download message (production only)
 * - General hydration warnings from date formatting
 * 
 * This runs client-side only and preserves actual errors and important warnings.
 */

if (typeof window !== 'undefined') {
  // Check if we're in development mode
  // Next.js replaces process.env.NODE_ENV at build time, so this works client-side
  // In production builds, it will be 'production', in dev builds it will be 'development'
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Helper to extract message from console args
  const getMessage = (args: any[]): string => {
    const firstArg = args[0];
    if (typeof firstArg === 'string') return firstArg;
    if (firstArg?.toString) return firstArg.toString();
    return String(firstArg);
  };

  // Suppress console.error warnings
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = getMessage(args);
    
    // Suppress Recharts defaultProps warnings
    if (message.includes('defaultProps') && message.includes('will be removed')) {
      return;
    }
    
    // Suppress react-calendar hydration warnings (aria-label date format differences)
    // Format: "aria-label did not match. Server: 'October 27, 2025' Client: '27 October 2025'"
    if (message.includes('aria-label') && (
      message.includes('did not match') || 
      message.includes('Server:') || 
      message.includes('Client:')
    )) {
      return;
    }
    
    // Suppress hydration mismatches specifically from react-calendar
    if (message.includes('Hydration') && (
      message.includes('react-calendar') ||
      message.includes('Calendar') ||
      message.includes('aria-label') ||
      /(January|February|March|April|May|June|July|August|September|October|November|December)/.test(message)
    )) {
      return;
    }
    
    // Call original for all other errors
    originalError.apply(console, args);
  };

  // Suppress console.warn warnings
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = getMessage(args);
    
    // Suppress defaultProps warnings (from Recharts, React DevTools, etc.)
    if (message.includes('defaultProps') && message.includes('will be removed')) {
      return;
    }
    
    // Suppress hydration warnings
    if (message.includes('Hydration') && (
      message.includes('aria-label') ||
      message.includes('Calendar') ||
      /(January|February|March|April|May|June|July|August|September|October|November|December)/.test(message)
    )) {
      return;
    }
    
    // Suppress form field warnings (value without onChange - handled by react-hook-form)
    if (message.includes('You provided a `value` prop to a form field without an `onChange` handler')) {
      return;
    }
    if (message.includes('value') && message.includes('onChange') && message.includes('read-only')) {
      return;
    }
    
    // Call original for all other warnings
    originalWarn.apply(console, args);
  };

  // Suppress console.info (for React DevTools message)
  const originalInfo = console.info;
  console.info = (...args: any[]) => {
    const message = getMessage(args);
    
    // Suppress React DevTools download message (only in production)
    if (!isDevelopment && (
      message.includes('Download the React DevTools') ||
      message.includes('reactjs.org/link/react-devtools') ||
      message.includes('React DevTools')
    )) {
      return;
    }
    
    // Call original for all other info messages
    originalInfo.apply(console, args);
  };

  // Suppress console.log for React DevTools (backup, in case it uses log instead of info)
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const message = getMessage(args);
    
    // Suppress React DevTools download message (only in production)
    if (!isDevelopment && (
      message.includes('Download the React DevTools') ||
      message.includes('reactjs.org/link/react-devtools') ||
      message.includes('React DevTools')
    )) {
      return;
    }
    
    // Call original for all other log messages
    originalLog.apply(console, args);
  };
}

