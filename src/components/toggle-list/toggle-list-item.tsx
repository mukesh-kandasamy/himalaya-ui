'use client';
import React, { PropsWithChildren, createRef, useEffect, useMemo, useState } from 'react';
import useClasses from '../use-classes';
import useConfig from '../use-config';
import useScale, { ScaleResponsiveParameter, customResponsiveAttribute, withScale } from '../use-scale';
import { isCSSNumberValue } from '../utils/collections';
import useWarning from '../utils/use-warning';
import { ToggleListEvent } from './shared';
import ToggleListIcon from './toggle-list-icon';
import { useToggleListContext } from './toggle-list-provider';

interface Props {
  checked?: boolean;
  value: string | number;
  disabled?: boolean;
  onChange?: (e: ToggleListEvent) => void;
  icon?: React.ReactNode;
  gap?: ScaleResponsiveParameter<number | string>;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLLabelElement>, keyof Props>;
export type ToggleProps = Props & NativeAttrs;

const ToggleListItemComponent: React.FC<PropsWithChildren<ToggleProps>> = ({
  disabled = false,
  value: toggleValue,
  onChange,
  icon,
  children,
  gap = 0.25,
  ...props
}: ToggleProps) => {
  const { UNIT, SCALE, CLASS_NAMES } = useScale();
  const { value: groupValue, disabledAll, updateState } = useToggleListContext();
  const isDisabled = useMemo(() => disabled || disabledAll, [disabled, disabledAll]);
  const [selfChecked, setSelfChecked] = useState<boolean>(false);

  const { layout: layoutRoot } = useConfig();
  const optionRef = createRef<HTMLInputElement>();

  const changeHandler = (event: React.ChangeEvent) => {
    if (isDisabled) return;
    const selfEvent: ToggleListEvent = {
      target: {
        checked: !selfChecked,
      },
      stopPropagation: event.stopPropagation,
      preventDefault: event.preventDefault,
      nativeEvent: event,
    };
    setSelfChecked(!selfChecked);
    updateState && updateState(toggleValue as string | number);
    onChange && onChange(selfEvent);
  };

  if (toggleValue === undefined) {
    useWarning('Props "value" must be deinfed if in the Radio.Group.', 'Radio');
  }
  useEffect(() => {
    setSelfChecked(groupValue === toggleValue);
  }, [groupValue, toggleValue]);

  return (
    <label className={useClasses('toggle-list-item', { active: selfChecked, 'has-icon': icon !== undefined, CLASS_NAMES })} {...props}>
      <input ref={optionRef} type="radio" value={toggleValue} checked={selfChecked} onChange={changeHandler} />
      {children && <span className="name">{children}</span>}
      <ToggleListIcon>{icon}</ToggleListIcon>

      <style jsx>{`
        .name {
          display: inline-flex;
          user-select: none;
          display: inline-flex;
          align-items: center;
          padding: 0;
          margin: 0;
        }
        input {
          display: none;
        }
        .toggle-list-item-container {
          display: inline-flex;
          align-items: center;
        }
        .toggle-list-item {
          position: relative;
          overflow: hidden;
          min-width: min-content;
          cursor: pointer;
        }
        .toggle-list-item.active {
          background: var(--color-background-1000);
        }

        .has-icon .name {
          padding-left: var(--toggle-name-left);
        }

        ${SCALE.r(1, value => `border-radius: ${value};`, 'var(--layout-radius)', 'toggle-list-item')}
        ${SCALE.font(0.9, value => `font-size: ${value};`, undefined, 'toggle-list-item')}
        ${SCALE.h(1.5, value => `min-height: ${value};`, undefined, 'toggle-list-item')}
        ${SCALE.h(2.5, value => ` --ui-button-height: ${value};`, undefined, 'toggle-list-item')}

        ${SCALE.padding(
          {
            top: 0.25,
            right: 1,
            bottom: 0.25,
            left: 1,
          },
          value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`,
          undefined,
          'toggle-list-item',
        )}

        ${SCALE.pl(0.85, value => `--toggle-name-left: ${value};`, undefined, 'toggle-list-item')}
        ${customResponsiveAttribute(gap, 'toggle-list-item', layoutRoot.breakpoints, value =>
          !isCSSNumberValue(value) ? `gap: ${value};` : `gap: calc(var(--scale-unit-scale) * ${value}))`,
        )}
        ${SCALE.pl(0.45, value => ` --ui-button-icon-padding: ${value};`, undefined, 'toggle-list-item')}
        ${UNIT('toggle-list-item')}
      `}</style>
    </label>
  );
};

ToggleListItemComponent.displayName = 'HimalayaToggleListItem';
const ToggleListItem = withScale(ToggleListItemComponent);
export default ToggleListItem;
