'use client';
import React from 'react';
import TableCell from './table-cell';
import { useTableContext } from './table-context';
import { TableDataItemBase, TableOnCellClick, TableOnRowClick, TableRowClassNameHandler } from './table-types';
import useClasses from '../use-classes';

interface Props<TableDataItem extends TableDataItemBase> {
  hover: boolean;
  emptyText: string;
  onRow?: TableOnRowClick<TableDataItem>;
  onCell?: TableOnCellClick<TableDataItem>;
  data: Array<TableDataItem>;
  className?: string;
  rowClassName: TableRowClassNameHandler<TableDataItem>;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props<any>>;
export type TableBodyProps<TableDataItem extends TableDataItemBase> = Props<TableDataItem> & NativeAttrs;

const TableBody = <TableDataItem extends TableDataItemBase>({ data, hover, emptyText, onRow, onCell, rowClassName }: TableBodyProps<TableDataItem>) => {
  const { columns } = useTableContext<TableDataItem>();
  const rowClickHandler = (row: TableDataItem, index: number) => {
    onRow && onRow(row, index);
  };

  return (
    <tbody>
      {data.map((row, index) => {
        const className = rowClassName(row, index);
        return (
          <tr key={`tbody-row-${index}`} className={useClasses({ hover }, className)} onClick={() => rowClickHandler(row, index)}>
            <TableCell<TableDataItem> columns={columns} row={row} rowIndex={index} emptyText={emptyText} onCellClick={onCell} />
          </tr>
        );
      })}
      <style jsx>{`
        tr {
          transition: background-color 0.25s ease;
          font-size: inherit;
        }

        tr :global(td) {
          border-bottom: 1px solid var(--color-border-1000);
          color: var(--color-foreground-1000);
          font-size: calc(0.875 * var(--table-font-size));
          text-align: left;
        }
        tr.hover:hover :global(td) {
          border-bottom: 1px solid var(--color-background-800);
        }
        tr :global(.cell) {
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          flex-flow: row wrap;
          padding: var(--layout-gap-half) var(--layout-gap-quarter);
        }
      `}</style>
    </tbody>
  );
};

TableBody.displayName = 'HimalayaTableBody';
export default TableBody;
