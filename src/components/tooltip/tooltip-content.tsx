'use client';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CssTransition from '../shared/css-transition';
import { UIColorTypes } from '../themes/presets';
import useClasses from '../use-classes';
import useScale from '../use-scale';
import { Placement } from '../utils/prop-types';
import useClickAnyWhere from '../utils/use-click-anywhere';
import usePortal from '../utils/use-portal';
import useResize from '../utils/use-resize';
import { getRect } from './helper';
import { TooltipPosition, defaultTooltipPosition, getPosition } from './placement';
import TooltipIcon from './tooltip-icon';

interface Props {
  parent?: MutableRefObject<HTMLElement | null> | undefined;
  placement: Placement;
  type?: UIColorTypes;
  visible: boolean;
  hideArrow: boolean;
  offset: number;
  className?: string;
  iconOffset: TooltipIconOffset;
}
export type TooltipIconOffset = {
  x: string;
  y: string;
};

const TooltipContent: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  parent,
  visible,
  offset,
  iconOffset,
  placement,
  type = 'default',
  className,
  hideArrow,
}) => {
  const { SCALE, UNIT, CLASS_NAMES } = useScale();
  const el = usePortal('tooltip');
  const selfRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<TooltipPosition>(defaultTooltipPosition);
  const hasShadow = type === 'default';
  const classes = useClasses('tooltip-content', className, type ? 'color-' + type : null, CLASS_NAMES);
  if (!parent) return null;

  const updateRect = () => {
    const position = getPosition(placement, getRect(parent), offset);
    setRect(position);
  };

  useResize(updateRect);
  useClickAnyWhere(() => updateRect());

  useEffect(() => {
    updateRect();
  }, [visible]);

  const preventHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  if (!el) return null;
  return createPortal(
    <CssTransition visible={visible}>
      <div className={classes} ref={selfRef} onClick={preventHandler}>
        <div className="inner">
          {!hideArrow && <TooltipIcon placement={placement} />}
          {children}
        </div>
        <style jsx>{`
          .tooltip-content {
            --tooltip-icon-offset-x: ${iconOffset.x};
            --tooltip-icon-offset-y: ${iconOffset.y};
            --tooltip-content-bg: var(--color-base);
            box-sizing: border-box;
            position: absolute;
            top: ${rect.top};
            left: ${rect.left};
            transform: ${rect.transform};
            background-color: var(--tooltip-content-bg);
            color: var(--color-contrast);
            padding: 0;
            z-index: 1000;
            box-shadow: ${hasShadow ? 'var(--theme-expressiveness-shadow-medium)' : 'none'};
            border: 1px solid var(--color-border);
          }

          .tooltip-content.popover > .inner {
            padding: var(--tooltip-popover-padding);
          }

          .tooltip-content.color-default {
            --color-base: var(--color-background-1000);
            --color-base-rgb: var(--color-background-1000-rgb);
            --color-contrast: var(--color-foreground-1000);
            --color-border: var(--color-border-1000);
          }

          .tooltip-content.transcluent-popover {
            backdrop-filter: blur(6px);
            background-color: rgba(var(--color-base-rgb), 0.6) !important;
            box-shadow:
              0 50px 100px -20px rgba(var(--color-base-rgb), 0.12),
              0 30px 60px -30px rgba(var(--color-base-rgb), 0.15) !important;
          }

          .inner {
            box-sizing: border-box;
            position: relative;
            height: 100%;
          }

          ${SCALE.r(1, value => `border-radius: ${value};`, 'var(--layout-radius)', 'tooltip-content')}
          ${SCALE.h(1, value => `height: ${value};`, 'auto', 'tooltip-content')}
          ${SCALE.w(1, value => `width: ${value};`, 'auto', 'tooltip-content')}

          ${SCALE.font(0.875, value => `font-size: ${value};`, undefined, 'tooltip-content')}

          ${SCALE.padding(
            {
              top: 0.5,
              bottom: 0.5,
              right: 0.75,
              left: 0.75,
            },
            value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`,
            undefined,
            'inner',
          )}

          ${SCALE.padding(0, value => `--tooltip-popover-padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'tooltip-content')}

          ${UNIT('tooltip-content')}
        `}</style>
      </div>
    </CssTransition>,
    el,
  );
};

export default TooltipContent;
