'use client';
import React, { useEffect, useRef } from 'react';
import CssTransition from '../shared/css-transition';
import useClasses from '../use-classes';
import useScale from '../use-scale';
import { isChildElement } from '../utils/collections';

interface Props {
  className?: string;
  visible?: boolean;
}

export type ModalWrapperProps = Props;

const ModalWrapper: React.FC<React.PropsWithChildren<ModalWrapperProps>> = ({
  className = '',
  children,
  visible = false,
  ...props
}: React.PropsWithChildren<ModalWrapperProps>) => {
  const { SCALE, UNIT, CLASS_NAMES } = useScale();
  const modalContent = useRef<HTMLDivElement>(null);
  const tabStart = useRef<HTMLDivElement>(null);
  const tabEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const activeElement = document.activeElement;
    const isChild = isChildElement(modalContent.current, activeElement);
    if (isChild) return;
    tabStart.current && tabStart.current.focus();
  }, [visible]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isTabDown = event.keyCode === 9;
    if (!visible || !isTabDown) return;
    const activeElement = document.activeElement;
    if (event.shiftKey) {
      if (activeElement === tabStart.current) {
        tabEnd.current && tabEnd.current.focus();
      }
    } else {
      if (activeElement === tabEnd.current) {
        tabStart.current && tabStart.current.focus();
      }
    }
  };

  return (
    <CssTransition name="wrapper" visible={visible} clearTime={300}>
      <div className={useClasses('wrapper', className, CLASS_NAMES)} role="dialog" tabIndex={-1} onKeyDown={onKeyDown} ref={modalContent} {...props}>
        <div tabIndex={0} className="hide-tab" aria-hidden="true" ref={tabStart} />
        {children}
        <div tabIndex={0} className="hide-tab" aria-hidden="true" ref={tabEnd} />
        <style jsx>{`
          .wrapper {
            max-width: 100%;
            vertical-align: middle;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            box-sizing: border-box;
            background-color: var(--color-background-1000);
            color: var(--color-foreground-1000);
            box-shadow: var(--theme-expressiveness-shadow-large);
            opacity: 0;
            outline: none;
            transform: translate3d(0px, -30px, 0px);
            transition:
              opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s,
              transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s;
            padding-top: var(--modal-wrapper-padding-top);
            padding-bottom: var(--modal-wrapper-padding-bottom);
            padding-left: var(--modal-wrapper-padding-left);
            padding-right: var(--modal-wrapper-padding-right);
          }

          .wrapper-enter {
            opacity: 0;
            transform: translate3d(0px, -30px, 0px);
          }

          .wrapper-enter-active {
            opacity: 1;
            transform: translate3d(0px, 0px, 0px);
          }

          .wrapper-leave {
            opacity: 1;
            transform: translate3d(0px, 0px, 0px);
          }

          .wrapper-leave-active {
            opacity: 0;
            transform: translate3d(0px, -30px, 0px);
          }

          .hide-tab {
            outline: none;
            overflow: hidden;
            width: 0;
            height: 0;
            opacity: 0;
          }

          ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'wrapper')}
          ${SCALE.padding(
            1.3125,
            value => `
            --modal-wrapper-padding-right: ${value.right};
            --modal-wrapper-padding-top: ${value.top};
            --modal-wrapper-padding-bottom: ${value.bottom};
            --modal-wrapper-padding-left: ${value.left};
            `,
            undefined,
            'wrapper',
          )}

          ${SCALE.w(1, value => `width: ${value};`, '100%', 'wrapper')}
          ${SCALE.font(1, value => `font-size: ${value};`, undefined, 'wrapper')}
          ${SCALE.h(1, value => `height: ${value};`, 'auto', 'wrapper')}
          ${SCALE.r(1, value => `border-radius: ${value};`, 'var(--layout-radius)', 'wrapper')}
          ${UNIT('wrapper')}
        `}</style>
      </div>
    </CssTransition>
  );
};

ModalWrapper.displayName = 'HimalayaModalWrapper';
export default ModalWrapper;
