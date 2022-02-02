import { useEffect, useState } from 'react';

import { ScreenSize } from 'enums/app';

const getProperties = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const isPhone = width <= ScreenSize.Phone;
  const isTablet = width >= ScreenSize.Tablet && width < ScreenSize.Desktop;
  const isDesktop = width >= ScreenSize.Desktop;

  return {
    isPhone,
    isTablet,
    isDesktop,
    width,
    height,
  };
};

export const useWindowProperties = () => {
  const [windowDimensions, setWindowDimensions] = useState(getProperties());

  useEffect(() => {
    const resizeEvent = 'resize';
    const handleResize = () => {
      setWindowDimensions(getProperties());
    };
    addEventListener(resizeEvent, handleResize);

    return () => removeEventListener(resizeEvent, handleResize);
  }, []);

  return windowDimensions;
};
