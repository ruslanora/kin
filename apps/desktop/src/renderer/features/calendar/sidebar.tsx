import { Badge, classNames, Icon, IconButton, Typography } from '@kin/ui';
import { AnimatePresence, motion } from 'framer-motion';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatLongDate, formatTime } from '../../utils';
import { useCalendar } from './context';

export const Sidebar: FunctionComponent = () => {
  const { day, dayInterviews, handleDayOnClose } = useCalendar();
  const navigate = useNavigate();

  const handleEntryOnClick = (jobId: number) => {
    handleDayOnClose();
    navigate(`/job/${jobId}`);
  };

  return (
    <AnimatePresence>
      {day && (
        <motion.div
          key="interview-list-sidebar"
          initial={{ width: 0 }}
          animate={{ width: 384 }}
          exit={{ width: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={classNames(
            'overflow-hidden shrink-0',
            'bg-stone-50 dark:bg-stone-900',
            'border-l border-l-stone-200 dark:border-l-stone-800',
          )}
        >
          <div className="h-full w-96">
            <div className="h-full w-full flex flex-col overflow-hidden">
              <div
                className={classNames(
                  'flex flex-row items-start justify-between gap-2',
                  'p-2 py-4 shrink-0',
                )}
              >
                <div className="p-2">
                  <Typography.Heading level="h2" as="h3">
                    {formatLongDate(day)}
                  </Typography.Heading>
                </div>
                <IconButton icon="x" onClick={handleDayOnClose} />
              </div>

              <div className="flex-1 overflow-y-auto px-2 py-4">
                <div className="flex flex-col items-stretch justify-start">
                  {dayInterviews.map((interview) => (
                    <button
                      key={`${interview.id}-${interview.followUp}`}
                      type="button"
                      onClick={() => handleEntryOnClick(interview.jobId)}
                      className={classNames(
                        'w-full flex flex-row items-center justify-between gap-3',
                        'p-2 text-left',
                        'hover:opacity-70 transition-opacity cursor-pointer',
                        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 focus:z-10',
                      )}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex flex-row items-center gap-1.5">
                          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-5">
                            {formatTime(interview.scheduledAt)}
                            {interview.round ? ` · ${interview.round}` : ''}
                          </span>
                          {interview.isFollowUp && (
                            <Badge variant="warning">Follow Up</Badge>
                          )}
                        </div>
                        <span className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                          {interview.companyName}
                        </span>
                        {interview.jobTitle && (
                          <span className="text-xs leading-5 text-stone-500 dark:text-stone-400 truncate">
                            {interview.jobTitle}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-stone-400 dark:text-stone-500">
                        <Icon name="chevron-right" size={16} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
