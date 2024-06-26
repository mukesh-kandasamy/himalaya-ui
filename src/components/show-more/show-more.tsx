'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import Button from '../button';
import { ChevronDown } from '../icons';
import { UIColorTypes } from '../themes';
import useClasses from '../use-classes';
import useScale, { withScale } from '../use-scale';

interface Props {
  expanded: boolean;
  onClick: () => void;
  showLines?: boolean;
  showMoreTitle?: string;
  showLessTitle?: string;
  type?: UIColorTypes;
}

const useRefDimensions = (ref: React.RefObject<HTMLDivElement>) => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      const boundingRect = ref?.current?.getBoundingClientRect();

      if (boundingRect != undefined) {
        const { height } = boundingRect;
        setHeight(height);
      }
    });

    resizeObserver.observe(ref.current);

    return function cleanup() {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return height;
};

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type ShowMoreProps = Props & NativeAttrs;

const ShowMore: React.FC<PropsWithChildren<ShowMoreProps>> = ({
  children,
  expanded,
  onClick,
  className,
  showLines = true,
  showMoreTitle = 'Show more',
  showLessTitle = 'Show less',
  type = 'secondary',
  ...props
}) => {
  const [iconRotated, setIconRotated] = useState(false);
  const { SCALE, UNIT, CLASS_NAMES } = useScale();

  const ref = React.createRef<HTMLDivElement>();
  const dimensions = useRefDimensions(ref);

  const toggleIconRotation = () => {
    setIconRotated(!iconRotated);
  };

  const buttonTitle = expanded ? showLessTitle : showMoreTitle;

  return (
    <div
      className={useClasses(`show-more`, expanded ? 'expanded' : 'collapsed', className, CLASS_NAMES)}
      {...props}
      onClick={() => {
        onClick();
        toggleIconRotation();
      }}
    >
      <div className="show-more-bar">
        {showLines && <div className="show-more-line" />}

        <Button
          type={type}
          scale={0.8}
          iconRight={
            <ChevronDown
              className={useClasses('chevon-icon', {
                rotate: expanded,
              })}
            />
          }
          auto
        >
          {buttonTitle}
        </Button>

        {showLines && <div className="show-more-line" />}
      </div>
      <div className="show-more-content">
        <div className="inner-height" ref={ref}>
          {children}
        </div>
      </div>
      <style jsx>{`
        .inner-height {
          display: block;
          width: 100%;
        }
        .show-more {
          width: 100%;
          display: block;
        }
        .show-more-bar {
          display: flex;
          align-items: center;
          cursor: pointer;
          width: 100%;
          flex-wrap: nowrap;
        }

        .show-more-line {
          width: 100%;
          height: 1.5px;
          background-color: var(--color-border-1000);
        }

        .show-more-content {
          height: 0;
          transition: height 0.3s ease;
          overflow: hidden;
          width: 100%;
          display: block;
        }
        .show-more :global(.chevon-icon) {
          transition: transform 0.3s ease-in-out;
        }
        .show-more :global(.rotate) {
          transform: rotate(180deg);
        }

        .expanded {
          .show-more-content {
            height: ${dimensions}px;
          }
        }

        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'show-more')}
        ${SCALE.padding(0, value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'show-more')}
        ${UNIT('show-more')}
      `}</style>
    </div>
  );
};

ShowMore.displayName = 'HimalayaShowMore';
export default withScale(ShowMore);
