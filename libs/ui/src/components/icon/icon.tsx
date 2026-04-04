'use client';

import type { FunctionComponent } from 'react';
import type { IconType } from 'react-icons';
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiBold,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiDatabase,
  FiFastForward,
  FiFile,
  FiInfo,
  FiItalic,
  FiList,
  FiMail,
  FiPaperclip,
  FiPlus,
  FiSave,
  FiSearch,
  FiSettings,
  FiSidebar,
  FiSliders,
  FiTrash2,
  FiUpload,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { RxDragHandleDots1 } from 'react-icons/rx';

type IconRegisterType = {
  [key: string]: IconType;
};

const register: IconRegisterType = {
  activity: FiActivity,
  'arrow-left': FiArrowLeft,
  'arrow-right': FiArrowRight,
  bold: FiBold,
  'chevron-right': FiChevronRight,
  database: FiDatabase,
  italic: FiItalic,
  list: FiList,
  fastForward: FiFastForward,
  calendar: FiCalendar,
  sidebar: FiSidebar,
  search: FiSearch,
  file: FiFile,
  paperclip: FiPaperclip,
  plus: FiPlus,
  briefcase: FiBriefcase,
  users: FiUsers,
  settings: FiSettings,
  mail: FiMail,
  x: FiX,
  save: FiSave,
  sliders: FiSliders,
  trash: FiTrash2,
  upload: FiUpload,
  move: RxDragHandleDots1,
};

type PropsType = {
  name: string;
  size?: number;
};

export const Icon: FunctionComponent<PropsType> = ({ name, size }) => {
  const Component = name in register ? register[name] : FiInfo;
  return <Component size={size} />;
};
