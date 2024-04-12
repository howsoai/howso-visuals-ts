import { useState, useLayoutEffect, useMemo } from "react";

export function useMediaQuery(query: string) {
  // Run initially
  const mediaMatch = useMemo(() => window.matchMedia(query), [query]);
  const [matches, setMatches] = useState(mediaMatch.matches);

  // Add a listener for changes
  useLayoutEffect(() => {
    const handler = (evt: MediaQueryListEvent) => setMatches(evt.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  }, [mediaMatch, setMatches]);

  return matches;
}
