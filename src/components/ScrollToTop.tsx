import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Access the current location (URL path)
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the path changes (e.g., from /home to /product/apple)
    // reset the window scroll to the very top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything UI-wise
};

export default ScrollToTop;