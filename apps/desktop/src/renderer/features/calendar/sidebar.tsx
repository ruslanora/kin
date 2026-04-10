import { Badge, Drawer, Icon, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatLongDate, formatTime } from '../../utils';
import { useCalendar } from './context';

const noop = () => {};

export const Sidebar: FunctionComponent = () => {
  const { day, dayInterviews, handleDayOnClose } = useCalendar();
  const navigate = useNavigate();

  const handleEntryOnClick = (jobId: number) => {
    handleDayOnClose();
    navigate(`/job/${jobId}`);
  };

  return (
    <Drawer state={day !== null} open={noop} close={handleDayOnClose}>
      <Drawer.Header>
        {day && (
          <Typography.Heading level="h2" as="h3">
            {formatLongDate(day)}
          </Typography.Heading>
        )}
      </Drawer.Header>
      <Drawer.Body>
        <div className="flex flex-col items-stretch justify-start">
          {dayInterviews.map((interview) => (
            <button
              key={`${interview.id}-${interview.followUp}`}
              type="button"
              onClick={() => handleEntryOnClick(interview.jobId)}
              className="w-full flex flex-row items-center justify-between gap-3 p-2 text-left hover:opacity-70 transition-opacity cursor-pointer"
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
      </Drawer.Body>
    </Drawer>
  );
};
