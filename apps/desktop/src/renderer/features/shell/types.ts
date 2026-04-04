export type LinkType = {
  icon: string;
  name: string;
  href: string;
};

export type SectionType = {
  name: string;
  hidden?: boolean;
  links: Array<LinkType>;
};
