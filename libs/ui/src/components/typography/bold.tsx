import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const TypographyBold: FunctionComponent<PropsType> = ({ children }) => (
  <span className="font-bold">{children}</span>
);

TypographyBold.displayName = 'Typography.Bold';
