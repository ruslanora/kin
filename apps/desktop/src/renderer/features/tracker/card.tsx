import type { JobWithCompanyType } from '@kin/desktop/main/database/schema';
import { classNames, Icon, Rating } from '@kin/ui';
import { motion, type PanInfo, useDragControls } from 'framer-motion';
import { type FunctionComponent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTracker } from './context';

type PropsType = {
  job: JobWithCompanyType;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export const Card: FunctionComponent<PropsType> = ({
  job,
  onDragStart,
  onDragEnd,
}) => {
  const { moveJob } = useTracker();
  const navigate = useNavigate();
  const dragControls = useDragControls();
  const cardRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    onDragEnd();

    const element = cardRef.current;
    if (element) element.style.pointerEvents = 'none';
    const targetEl = document.elementFromPoint(info.point.x, info.point.y);
    if (element) element.style.pointerEvents = '';

    const targetColumn = targetEl?.closest('[data-column-id]');

    if (!targetColumn) return;

    const targetColumnId = Number(targetColumn.getAttribute('data-column-id'));

    const cards = Array.from(
      targetColumn.querySelectorAll('[data-job-id]'),
    ).filter((card) => Number(card.getAttribute('data-job-id')) !== job.id);

    let targetIndex = cards.length;

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();

      if (info.point.y < rect.top + rect.height / 2) {
        targetIndex = i;
        break;
      }
    }

    moveJob(job.id, job.columnId, targetColumnId, targetIndex);
  };

  const employmentInfo = [job.employmentType, job.workModel]
    .filter(Boolean)
    .join(' • ');

  return (
    <motion.div
      ref={cardRef}
      layout
      data-job-id={job.id}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragSnapToOrigin
      onDragStart={() => {
        dragged.current = true;
        onDragStart();
      }}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        navigate(`/job/${job.id}`);
      }}
      whileDrag={{ opacity: 0.85, scale: 1.02 }}
      className={classNames(
        'rounded-xl pt-3 pr-2 pl-3 pb-4',
        'bg-white dark:bg-stone-800',
        'border border-stone-200 dark:border-stone-700',
        'cursor-pointer select-none',
      )}
    >
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span
            className={classNames(
              'text-xs font-medium truncate',
              'text-stone-500 dark:text-stone-400',
            )}
          >
            {job.companyName}
          </span>
          <span
            className={classNames(
              'text-sm font-medium truncate',
              'text-stone-900 dark:text-stone-50',
            )}
          >
            {job.title ?? '—'}
          </span>
          {employmentInfo && (
            <span
              className={classNames(
                'text-xs truncate mt-0.5',
                'text-stone-400 dark:text-stone-500',
              )}
            >
              {employmentInfo}
            </span>
          )}
          {job.excitement > 0 && (
            <div className="mt-1.5">
              <Rating value={job.excitement} size={12} />
            </div>
          )}
        </div>
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="text-stone-500 dark:text-stone-400 shrink-0 cursor-grab active:cursor-grabbing"
        >
          <Icon name="move" size={18} />
        </div>
      </div>
    </motion.div>
  );
};
