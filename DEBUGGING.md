# Debugging Guide for PFMA App

## Quick Debug Checklist

### Before Coding
- [ ] Check TypeScript errors: `npx tsc --noEmit`
- [ ] Run ESLint: `npm run lint`
- [ ] Verify dev server works: `npm run dev`

### While Coding
- [ ] Use `debugLog()` function for conditional logging
- [ ] Set breakpoints in browser DevTools
- [ ] Check Network tab for failed requests
- [ ] Use React DevTools for component state

### Google Maps Specific
- [ ] Verify API key is loaded: `console.log(window.google)`
- [ ] Check map initialization: `debugLog('Map initialized', mapInstance)`
- [ ] Monitor map events: Add listeners with debug logging
- [ ] Validate coordinates: Check lat/lng bounds

## Common Issues & Solutions

### TypeScript Errors
**Problem**: Unused variables/functions
**Solution**: Export what's needed, remove what's not, or use `// @ts-ignore`

### Google Maps Issues
**Problem**: Maps not loading
**Debug Steps**:
1. Check browser console for API errors
2. Verify API key in network requests
3. Ensure global `window.google` is available
4. Check CORS issues in network tab

### React Component Issues
**Problem**: Component crashes
**Debug Steps**:
1. Wrap in ErrorBoundary component
2. Add defensive null checks
3. Use React DevTools to inspect props/state
4. Check component lifecycle logs

## Debugging Tools Setup

### Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- Google Maps API Debugger

### VS Code Setup
- Install "Debugger for Chrome" extension
- Use launch.json configuration (already created)
- Set breakpoints with F9

## Debug Environment Variables
```
VITE_DEBUG=true          # Enable debug mode
VITE_LOG_LEVEL=debug     # Set logging level  
VITE_GOOGLE_MAPS_API_KEY # Your Maps API key
```

## Useful Debug Commands

```bash
# Start with debugging
npm run dev

# Type check only
npx tsc --noEmit

# Lint check
npm run lint

# Build and check for issues
npm run build

# Preview production build
npm run preview
```

## Debug Logging Best Practices

```typescript
// Use conditional debug logging
const debugLog = (message: string, ...args: any[]) => {
  if (import.meta.env.VITE_DEBUG === 'true') {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Log important state changes
debugLog('Map loaded', { lat, lng, zoom });
debugLog('API response', response);
debugLog('Error occurred', error);
```

## Performance Debugging

```typescript
// Measure function performance
console.time('mapInitialization');
initializeMap();
console.timeEnd('mapInitialization');

// Log memory usage
console.log('Memory usage:', performance.memory);
```