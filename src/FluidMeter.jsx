import React, { useEffect, useRef } from 'react';

const FluidMeter = ({ id, fillPercentage, options }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.FluidMeter) {
      const fm = new window.FluidMeter();
      fm.init({
        targetContainer: containerRef.current,
        fillPercentage,
        options
      });
    } else {
      console.error("FluidMeter library is not loaded");
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [fillPercentage, options]);

  return <div ref={containerRef} id={id}></div>;
};

export default FluidMeter;
