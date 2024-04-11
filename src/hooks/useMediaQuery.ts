import { useState, useLayoutEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mediaMatch = window.matchMedia(query);
    const handler = (evt: MediaQueryListEvent) => setMatches(evt.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
