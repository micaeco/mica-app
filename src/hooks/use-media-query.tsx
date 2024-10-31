import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Define update function
    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Listen for changes
    media.addEventListener("change", updateMatches);

    // Cleanup on unmount
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
