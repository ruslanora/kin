import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const TypographyParagraph: FunctionComponent<PropsType> = ({
  children,
}) => <p className="text-sm leading-tight tracking-normal">{children}</p>;

TypographyParagraph.displayName = 'Typography.Paragraph';
