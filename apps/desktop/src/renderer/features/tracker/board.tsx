import type { ColumnType } from '@kin/desktop/main/database/schema';
import { Reorder } from 'framer-motion';
import {
  type FunctionComponent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Column } from './column';
import { useTracker } from './context';

export const Board: FunctionComponent = () => {
  const { editing, columns, moveColumns } = useTracker();

  const [localOrder, setLocalOrder] = useState<Array<number>>(() =>
    columns.map((c) => c.id),
  );

  const localColumns = useMemo(() => {
    const contextMap = new Map(columns.map((c) => [c.id, c]));

    const filtered = localOrder
      .filter((id) => contextMap.has(id))
      .map((id) => contextMap.get(id)!);

    const localIds = new Set(filtered.map((c) => c.id));
    const added = columns.filter((c) => !localIds.has(c.id));

    return [...filtered, ...added];
  }, [columns, localOrder]);

  const prevEditing = useRef(editing);
  const localColumnsRef = useRef(localColumns);
  const scrollRef = useRef<HTMLUListElement>(null);
  const prevColumnCount = useRef(localColumns.length);

  useLayoutEffect(() => {
    localColumnsRef.current = localColumns;
  }, [localColumns]);

  useEffect(() => {
    if (localColumns.length > prevColumnCount.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }

    prevColumnCount.current = localColumns.length;
  }, [localColumns.length]);

  useEffect(() => {
    if (prevEditing.current && !editing) {
      moveColumns(localColumnsRef.current.map((column) => column.id));
    }

    prevEditing.current = editing;
  }, [editing, moveColumns]);

  const handleReorder = (reordered: Array<ColumnType>) => {
    setLocalOrder(reordered.map((c) => c.id));
  };

  return (
    <Reorder.Group
      ref={scrollRef}
      axis="x"
      values={localColumns}
      onReorder={handleReorder}
      className="h-full flex flex-1 items-start overflow-x-auto gap-2 px-4"
    >
      {localColumns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </Reorder.Group>
  );
};
