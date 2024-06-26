'use client';
import React from 'react';
import useClasses from '../use-classes';
import useScale, { withScale } from '../use-scale';

interface Props {
  disableAutoMargin?: boolean;
  className?: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type CardFooterProps = Props & NativeAttrs;

const CardFooterComponent: React.FC<React.PropsWithChildren<CardFooterProps>> = ({
  children,
  className = '',
  disableAutoMargin = false,
  ...props
}: CardFooterProps) => {
  const { SCALE, UNIT, CLASS_NAMES } = useScale();
  const classes = useClasses('card-footer', { 'auto-margin': !disableAutoMargin }, className, CLASS_NAMES);

  return (
    <footer className={classes} {...props}>
      {children}
      <style jsx>{`
        .card-footer {
          display: flex;
          align-items: center;
          overflow: hidden;
          color: inherit;
          background-color: inherit;
          border-top: 1px solid var(--color-border);
          border-bottom-left-radius: var(--card-border-radius);
          border-bottom-right-radius: var(--card-border-radius);
        }

        .auto-margin :global(*) {
          margin-top: 0;
          margin-bottom: 0;
          margin-right: var(--layout-gap-quarter);
        }

        ${SCALE.w(1, value => `width: ${value};`, 'auto', 'card-footer')}
        ${SCALE.h(1, value => `height: ${value};`, 'auto', 'card-footer')}
        ${SCALE.h(3.3, value => `min-height: ${value};`, undefined, 'card-footer')}
        ${SCALE.font(0.875, value => `font-size: ${value};`, undefined, 'card-footer')}

        ${SCALE.padding(
          {
            left: 1.31,
            right: 1.31,
            top: 0.66,
            bottom: 0.66,
          },
          value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`,
          undefined,
          'card-footer',
        )}
        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'card-footer')}
        ${UNIT('card-footer')}
      `}</style>
    </footer>
  );
};

CardFooterComponent.displayName = 'HimalayaCardFooter';
const CardFooter = withScale(CardFooterComponent);
export default CardFooter;
