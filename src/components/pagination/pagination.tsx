'use client';

import useClasses from '../use-classes';
import React, { useEffect, useMemo } from 'react';
import useScale, { withScale } from '../use-scale';
import { pickChild } from '../utils/collections';
import useCurrentState from '../utils/use-current-state';
import { PaginationConfig, PaginationContext, PaginationUpdateType } from './pagination-context';
import PaginationNext from './pagination-next';
import PaginationPages from './pagination-pages';
import PaginationPrevious from './pagination-previous';
import { UIColorTypes } from '../themes/presets';

interface Props {
  page?: number;
  initialPage?: number;
  count?: number;
  limit?: number;
  type?: UIColorTypes;
  onChange?: (val: number) => void;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>;
export type PaginationProps = Props & NativeAttrs;

const PaginationComponent: React.FC<React.PropsWithChildren<PaginationProps>> = ({
  page: customPage,
  initialPage = 1,
  count = 1,
  limit = 7,
  children,
  onChange,
  type = 'default',
  className = undefined,
  ...props
}: React.PropsWithChildren<PaginationProps>) => {
  const { UNIT, SCALE, CLASS_NAMES } = useScale();
  const [page, setPage, pageRef] = useCurrentState(initialPage);
  const [, prevChildren] = pickChild(children, PaginationPrevious);
  const [, nextChildren] = pickChild(children, PaginationNext);

  const [prevItem, nextItem] = useMemo(() => {
    const hasChildren = (c: any) => React.Children.count(c) > 0;
    const prevDefault = <PaginationPrevious>prev</PaginationPrevious>;
    const nextDefault = <PaginationNext>next</PaginationNext>;
    return [hasChildren(prevChildren) ? prevChildren : prevDefault, hasChildren(nextChildren) ? nextChildren : nextDefault];
  }, [prevChildren, nextChildren]);

  const update = (type: PaginationUpdateType) => {
    if (type === 'prev' && pageRef.current > 1) {
      setPage(last => last - 1);
    }
    if (type === 'next' && pageRef.current < count) {
      setPage(last => last + 1);
    }
  };
  const values = useMemo<PaginationConfig>(
    () => ({
      isFirst: page <= 1,
      isLast: page >= count,
      update,
    }),
    [page, count],
  );

  useEffect(() => {
    onChange && onChange(page);
  }, [page]);
  useEffect(() => {
    if (customPage !== undefined) {
      setPage(customPage);
    }
  }, [customPage]);

  return (
    <PaginationContext.Provider value={values}>
      <nav className={useClasses('pagination', className, type ? 'color-' + type : null, CLASS_NAMES)} {...props}>
        {prevItem}
        <PaginationPages count={count} current={page} limit={limit} setPage={setPage} />
        {nextItem}
      </nav>
      <style jsx>{`
        .pagination {
          font-variant: tabular-nums;
          font-feature-settings: 'tnum';
        }

        .pagination :global(button:last-of-type) {
          margin-right: 0;
        }

        .pagination.color-default {
          --color-base: var(--color-foreground-1000);
          --color-contrast: var(--color-background-1000);
          --color-shade: var(--color-foreground-800);
          --color-tint: var(--color-foreground-600);
        }

        ${SCALE.font(2, value => `--pagination-size: ${value};`, undefined, 'pagination')}
        ${SCALE.font(0.875, value => `font-size: ${value};`, undefined, 'pagination')}
        ${SCALE.w(1, value => `width: ${value};`, 'auto', 'pagination')}
        ${SCALE.h(1, value => `height: ${value};`, 'auto', 'pagination')}
        ${SCALE.padding(0, value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'pagination')}
        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'pagination')}
        ${UNIT('pagination')}
      `}</style>
    </PaginationContext.Provider>
  );
};

PaginationComponent.displayName = 'HimalayaPagination';
const Pagination = withScale(PaginationComponent);
export default Pagination;
