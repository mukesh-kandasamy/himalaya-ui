'use client';

import React, { useMemo } from 'react';
import Ellipsis from '../shared/ellipsis';
import useClasses from '../use-classes';
import useScale, { withScale } from '../use-scale';
import { useAutoCompleteContext } from './auto-complete-context';
import Check from '../icons/check';

interface Props {
  value: string;
  isLabelOnly?: boolean;
  hasCheckmark?: boolean;
}

export type AutoCompleteItemProps = Props & React.HTMLAttributes<any>;

const AutoCompleteItemComponent: React.FC<React.PropsWithChildren<AutoCompleteItemProps>> = ({
  value: identValue,
  children,
  isLabelOnly,
  hasCheckmark = true,
}: React.PropsWithChildren<AutoCompleteItemProps>) => {
  const { SCALE, UNIT, CLASS_NAMES } = useScale();
  const { value, updateValue, updateVisible } = useAutoCompleteContext();
  const selectHandler = () => {
    updateValue && updateValue(identValue);
    updateVisible && updateVisible(false);
  };
  const isActive = useMemo(() => value === identValue, [identValue, value]);
  const classes = useClasses(
    'item',
    {
      active: isActive,
      'label-only': isLabelOnly,
    },
    CLASS_NAMES,
  );

  return (
    <div className={classes} onClick={selectHandler}>
      {isLabelOnly ? <Ellipsis height={`var(--ellipse-height)`}>{children}</Ellipsis> : children}

      {isActive && hasCheckmark && (
        <div className="auto-check">
          <Check></Check>
        </div>
      )}
      <style jsx>{`
        .item {
          justify-content: flex-start;
          align-items: center;
          font-weight: normal;
          white-space: pre;
          background-color: var(--color-background-1000);
          color: var(--color-foreground-1000);
          user-select: none;
          border: 0;
          cursor: pointer;
          transition:
            background 0.2s ease 0s,
            border-color 0.2s ease 0s;

          display: flex;
          max-width: 100%;
          box-sizing: border-box;
          align-items: center;
          place-content: space-between;
          width: 100%;
        }

        .item:first-of-type {
          border-top-left-radius: var(--layout-radius);
          border-top-right-radius: var(--layout-radius);
        }

        .item:last-of-type {
          border-bottom-left-radius: var(--layout-radius);
          border-bottom-right-radius: var(--layout-radius);
        }

        .item:hover {
          background-color: var(--color-background-900);
        }

        .auto-check :global(svg) {
          width: 100%;
          height: 100%;
        }

        ${SCALE.padding(
          {
            top: 0,
            right: 0.75,
            left: 0.75,
            bottom: 0,
          },
          value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`,
          undefined,
          'item',
        )}
        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'item')}
        ${SCALE.font(0.875, value => `font-size: ${value};`, undefined, 'item')}
        ${SCALE.font(1, value => `width: ${value}; height: ${value};`, undefined, 'auto-check')}
        ${SCALE.w(1, value => `width: ${value};`, 'auto', 'item')}
        ${SCALE.h(1, value => `height: ${value};`, 'auto', 'item')}
        ${SCALE.h(2.5, value => `height: ${value};`, undefined, 'label-only')}
        ${SCALE.h(2, value => `--ellipse-height: ${value};`, undefined, 'item')}

        ${UNIT('item')}
      `}</style>
    </div>
  );
};

AutoCompleteItemComponent.displayName = 'HimalayaAutoCompleteItem';
const AutoCompleteItem = withScale(AutoCompleteItemComponent);
export default AutoCompleteItem;
