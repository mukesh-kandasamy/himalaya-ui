'use client';

import React, { useMemo } from 'react';
import { GradientPositions, GradientPositionsEnum } from '../themes/presets';
import useClasses from '../use-classes';
import useScale from '../use-scale';
import { ButtonTypes } from '../utils/prop-types';
import { TextColor } from './shared';

export interface Props {
  tag: keyof React.JSX.IntrinsicElements;
  type?: ButtonTypes;
  stroke?: number | string;
  className?: string;
  color?: TextColor;
  gradientDegress?: GradientPositions;
  xs?: number;
  lineHeight?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

type NativeAttrs = Omit<React.DetailsHTMLAttributes<any>, keyof Props>;
export type TextChildProps = Props & NativeAttrs;

const TextChild: React.FC<React.PropsWithChildren<TextChildProps>> = ({
  children,
  tag,
  className = '',
  stroke,
  color,
  gradientDegress = GradientPositionsEnum.right,
  type = 'default' as ButtonTypes,
  ...props
}: React.PropsWithChildren<TextChildProps>) => {
  const Component = tag;

  const { getScaleProps, CLASS_NAMES, UNIT, SCALE } = useScale();
  const font = getScaleProps('font');
  const lineHeight = getScaleProps('lineHeight');

  const mx = getScaleProps(['m', 'ml', 'mr', 'mx', 'ml', 'mr', 'font']);
  const my = getScaleProps(['m', 'mt', 'mb', 'my', 'mt', 'mb']);
  const px = getScaleProps(['p', 'pl', 'pr', 'pl', 'pr', 'px']);
  const py = getScaleProps(['p', 'pt', 'pb', 'pt', 'pb', 'py']);

  const defaultColor = useMemo(() => {
    if (color && typeof color === 'string') {
      return `color: ` + color + ';';
    } else if (color && color['from'] !== undefined && color['to'] !== undefined) {
      const gradientDirection = typeof gradientDegress === 'number' ? gradientDegress + 'deg' : 'to ' + gradientDegress;

      return `background: linear-gradient(
            ${gradientDirection},
            ${color['from']},
            ${color['to']}
          );
          background-size: 100%;
          background-repeat: repeat;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -moz-background-clip: text;
          -moz-text-fill-color: transparent;`;
    }

    if (type === 'default') {
      return ``;
    }

    return `color: var(--color-base);`;
  }, [type, color, gradientDegress]);
  const classNames = useMemo<string>(() => {
    const keys = [
      { value: mx, className: 'mx' },
      { value: my, className: 'my' },
      { value: px, className: 'px' },
      { value: py, className: 'py' },
      { value: font, className: 'font' },
      { value: lineHeight, className: 'lineHeight' },
      { value: stroke, className: 'stroke' },
    ];
    const scaleClassNames = keys.reduce((pre, next) => {
      if (typeof next.value === 'undefined') return pre;
      return `${pre} ${next.className}`;
    }, '');
    return `${scaleClassNames} ${className}`.trim();
  }, [mx, my, px, py, font, className, stroke, lineHeight]);
  return (
    <Component className={useClasses('text', classNames, CLASS_NAMES, type ? 'color-' + type : null)} {...props}>
      {children}
      <style jsx>{`
        .stroke {
          color: transparent;
          -webkit-text-stroke: ${Number(stroke) ? stroke + 'px' : stroke} ${defaultColor !== 'inherit' ? `var(--color-foreground-1000)` : defaultColor};
        }

        ${tag} {
          ${defaultColor}
        }

        ${SCALE.ml(0, value => `margin-left: ${value};`, 'revert', 'mx')}
        ${SCALE.mr(0, value => `margin-right: ${value};`, 'revert', 'mx')}
        ${SCALE.mt(0, value => `margin-top: ${value};`, 'revert', 'my')}
        ${SCALE.mb(0, value => `margin-bottom: ${value};`, 'revert', 'my')}
        ${SCALE.pl(0, value => `padding-left: ${value};`, 'revert', 'px')}
        ${SCALE.pr(0, value => `padding-right: ${value};`, 'revert', 'px')}
        ${SCALE.pt(0, value => `padding-top: ${value};`, 'revert', 'py')}
        ${SCALE.pb(0, value => `padding-bottom: ${value};`, 'revert', 'py')}
        ${SCALE.w(1, value => `width: ${value};`, 'auto', 'text')}
        ${SCALE.h(1, value => `height: ${value};`, 'auto', 'text')}
        ${SCALE.font(1, value => `font-size: ${value}; --font-size: ${value};`, 'inherit', 'font')}
        ${SCALE.lineHeight(1, value => `line-height: ${value};`, 'inherit', 'lineHeight')}

        ${UNIT('text')}
      `}</style>
    </Component>
  );
};

TextChild.displayName = 'HimalayaTextChild';
export default TextChild;
