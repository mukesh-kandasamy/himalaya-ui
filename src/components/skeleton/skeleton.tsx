'use client';

import React from 'react';
import useClasses from '../use-classes';
import { useScale, withScale } from '../use-scale';

interface Props {
  squared?: boolean;
  rounded?: boolean;
  component?: keyof React.JSX.IntrinsicElements;
  className?: string;
  show?: boolean;
  minHeight?: number;
  animated?: boolean;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type SkeletonProps = Props & NativeAttrs;

const SkeletonComponent: React.FC<React.PropsWithChildren<SkeletonProps>> = ({
  component = 'span' as keyof React.JSX.IntrinsicElements,
  children,

  show = false,
  minHeight = 24,
  className = '',
  animated = true,
  ...props
}: React.PropsWithChildren<SkeletonProps>) => {
  const Component = component;
  const { UNIT, CLASS_NAMES, SCALE } = useScale();
  const classes = useClasses('skeleton', { show, stop: !animated, hasChildren: !!children }, className, CLASS_NAMES);

  return (
    <Component className={classes} {...props}>
      {children}
      <style jsx>{`
        .skeleton {
          display: block;
          min-height: ${minHeight}px;
          position: relative;
          overflow: hidden;
        }

        .skeleton,
        .skeleton:before {
          background-image: linear-gradient(
            270deg,
            var(--color-background-900),
            var(--color-background-800),
            var(--color-background-800),
            var(--color-background-900)
          );
          background-size: 400% 100%;
          -webkit-animation: loading 8s ease-in-out infinite;
          animation: loading 8s ease-in-out infinite;
          border-radius: 5px;
        }
        .skeleton.hasChildren:before {
          position: absolute;
          display: block;
          height: 100%;
          content: '';
          width: 100%;
          z-index: 2;
        }

        .skeleton.stop,
        .skeleton.stop:before {
          -webkit-animation: none;
          animation: none;
          background: var(--color-background-800);
        }

        .skeleton,
        .skeleton:before {
          border-radius: var(--skeleton-radius);
        }

        .skeleton.show,
        .skeleton.show:before {
          background: transparent;
          width: initial;
          height: initial;
        }
        @-webkit-keyframes loading {
          0% {
            background-position: 200% 0;
          }
          to {
            background-position: -200% 0;
          }
        }
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          to {
            background-position: -200% 0;
          }
        }

        ${SCALE.h(1, value => `height: ${value};`, 'initial', 'skeleton')}
        ${SCALE.w(1, value => `width: ${value};`, 'initial', 'skeleton')}
        ${SCALE.r(1, value => `--skeleton-radius: ${value};`, 'var(--layout-radius)', 'skeleton')}

        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'skeleton')}
        ${SCALE.padding(0, value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'skeleton')}
        ${UNIT('skeleton')}
      `}</style>
    </Component>
  );
};

SkeletonComponent.displayName = 'HimalayaSkeleton';
const Skeleton = withScale(SkeletonComponent);
export default Skeleton;
