import { classNames } from '@kin/ui';
import type { FunctionComponent, ReactNode } from 'react';

type HeadingType = 'h1' | 'h2' | 'h3';

type PropsType = {
  level?: HeadingType;
  as?: HeadingType;
  children?: ReactNode;
};

export const TypographyHeading: FunctionComponent<PropsType> = ({
  level = 'h1',
  as,
  children,
}) => {
  const Component = level;

  if (!as) as = level;

  return (
    <Component
      className={classNames(
        'tracking-normal whitespace-nowrap',
        as === 'h1' && 'text-2xl font-bold leading-9',
        as === 'h2' && 'text-lg font-bold leading-tight',
        as === 'h3' && 'text-sm leadinh-tight',
      )}
    >
      {children}
    </Component>
  );
};

TypographyHeading.displayName = 'Typography.Heading';
