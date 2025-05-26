import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Set initial size
      handleResize();

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = (windowSize.width || 0) < breakpoints.md;
  const isTablet =
    (windowSize.width || 0) >= breakpoints.md && (windowSize.width || 0) < breakpoints.lg;
  const isDesktop = (windowSize.width || 0) >= breakpoints.lg;

  const isBreakpoint = (breakpoint: Breakpoint) => {
    if (!windowSize.width) return false;
    return windowSize.width >= breakpoints[breakpoint];
  };

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
  };
};

export default useResponsive;
