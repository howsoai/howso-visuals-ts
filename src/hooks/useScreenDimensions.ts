import { useDeferredValue, useEffect, useState } from "react";

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const deferred = useDeferredValue(dimensions);
  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setDimensions]);

  return { current: dimensions, deferred };
};
