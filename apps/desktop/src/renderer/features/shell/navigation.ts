import type { SectionType } from './types';

export const navigation: Array<SectionType> = [
  {
    name: 'Tracking',
    links: [
      { icon: 'fastForward', name: 'Tracker', href: '/' },
      { icon: 'calendar', name: 'Calendar', href: '/calendar' },
      { icon: 'database', name: 'Database', href: '/database' },
    ],
  },
  {
    name: 'Master Files',
    hidden: true,
    links: [
      { icon: 'file', name: 'Resume', href: '/master-resume' },
      { icon: 'paperclip', name: 'Cover Letter', href: '/master-cover-letter' },
    ],
  },
  {
    name: 'Features',
    hidden: true,
    links: [
      { icon: 'mail', name: 'Email Templates', href: '/email-templates' },
      { icon: 'globe', name: 'Browser Extension', href: '/extension' },
    ],
  },
];
