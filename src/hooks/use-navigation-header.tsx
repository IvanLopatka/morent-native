/**
 * Returns Stack.Screen `options` configured to hide the old header
 * as the app now uses the fixed bottom navigation bar.
 */
export function useNavigationHeader() {
  return {
    headerShown: false,
  };
}
