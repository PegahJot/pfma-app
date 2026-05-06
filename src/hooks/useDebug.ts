import { useEffect, useRef } from 'react';

interface DebugInfo {
  [key: string]: any;
}

export function useDebug(componentName: string, props: DebugInfo = {}) {
  const renderCount = useRef(0);
  const prevProps = useRef<DebugInfo>({});

  useEffect(() => {
    renderCount.current += 1;
    
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.group(`🔍 ${componentName} Debug Info`);
      console.log('Render count:', renderCount.current);
      console.log('Current props:', props);
      
      // Log changed props
      const changedProps = Object.keys(props).filter(
        key => prevProps.current[key] !== props[key]
      );
      
      if (changedProps.length > 0) {
        console.log('Changed props:', changedProps.map(key => ({
          prop: key,
          from: prevProps.current[key],
          to: props[key]
        })));
      }
      
      console.groupEnd();
      
      prevProps.current = { ...props };
    }
  });

  // Return debug utilities
  return {
    log: (message: string, data?: any) => {
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`[${componentName}] ${message}`, data);
      }
    },
    renderCount: renderCount.current
  };
}

// Usage example:
// const debug = useDebug('MapComponent', { lat, lng, zoom });
// debug.log('Map initialized', mapInstance);