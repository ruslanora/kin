import { TypographyBold } from './bold';
import { TypographyHeading } from './heading';
import { TypographyItalic } from './italic';
import { TypographyParagraph } from './paragraph';

export const Typography = Object.assign(TypographyParagraph, {
  Heading: TypographyHeading,
  Paragraph: TypographyParagraph,
  Bold: TypographyBold,
  Italic: TypographyItalic,
});
