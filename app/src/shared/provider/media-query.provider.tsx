'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

type MediaQueryContextType = Readonly<{
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  deviceType: DeviceType;
  notMobile: boolean;
}>;

const MediaQueryContext = createContext<MediaQueryContextType | undefined>(
  undefined
);

type Props = Readonly<{
  children: ReactNode;
}>;

function MediaQueryProvider({ children }: Props) {
  const getDeviceType = useCallback((): DeviceType => {
    if (typeof window === 'undefined') return 'desktop';

    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 640px) and (max-width: 1023px)'
    );

    if (mobileQuery.matches) return 'mobile';
    if (tabletQuery.matches) return 'tablet';
    return 'desktop';
  }, []);

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());

  const value = useMemo(
    () => ({
      isDesktop: deviceType === 'desktop',
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      notMobile: deviceType !== 'mobile',
      deviceType,
    }),
    [deviceType]
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 640px) and (max-width: 1023px)'
    );

    const updateDeviceType = () => {
      setDeviceType(getDeviceType());
    };

    mobileQuery.addEventListener('change', updateDeviceType);
    tabletQuery.addEventListener('change', updateDeviceType);
    updateDeviceType();

    return () => {
      mobileQuery.removeEventListener('change', updateDeviceType);
      tabletQuery.removeEventListener('change', updateDeviceType);
    };
  }, [getDeviceType]);

  return <MediaQueryContext value={value}>{children}</MediaQueryContext>;
}

export { MediaQueryContext, MediaQueryProvider };
