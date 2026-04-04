import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const TypographyItalic: FunctionComponent<PropsType> = ({
  children,
}) => <span className="italic">{children}</span>;

TypographyItalic.displayName = 'Typography.Italic';
