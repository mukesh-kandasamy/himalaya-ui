'use client';
import { useRouteChange } from 'nextjs13-router-events';
import React, { useState } from 'react';
import { MobileMenuProviderProps } from '.';
import useClasses from '../use-classes';
import { MobileMenuContext } from './mobile-menu-context';

const MobileMenuProvider: React.FC<React.PropsWithChildren<MobileMenuProviderProps>> = ({ children, contentAnimationTime = 300 }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isDirection, setDirection] = useState<'left' | 'right'>('left');

  useRouteChange({
    onRouteChangeStart: () => {
      setIsEnabled(false);
    },
    onRouteChangeComplete: () => {
      setIsEnabled(false);
    },
  });

  return (
    <MobileMenuContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        direction: isDirection,
        setDirection,
      }}
    >
      <div
        className={useClasses('mobile-menu-container', {
          'mobile-menu-active': isEnabled,
        })}
      >
        {children}
      </div>

      <style jsx>{`
        .mobile-menu-container {
          width: 100%;
          min-height: 100%;
          transition: transform ${contentAnimationTime}ms ease-out;
        }
        .mobile-menu-active {
          transition: transform ${contentAnimationTime}ms ease-in;
        }
      `}</style>
    </MobileMenuContext.Provider>
  );
};

MobileMenuProvider.displayName = 'HimalayaMobileMenuProvider';
export default MobileMenuProvider;
