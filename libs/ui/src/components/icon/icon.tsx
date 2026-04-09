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
  FiCheck,
  FiChevronRight,
  FiDatabase,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiFastForward,
  FiFileText,
  FiGlobe,
  FiHome,
  FiInfo,
  FiItalic,
  FiList,
  FiMail,
  FiMonitor,
  FiMoon,
  FiMove,
  FiPaperclip,
  FiPlus,
  FiSave,
  FiSearch,
  FiSettings,
  FiSidebar,
  FiSliders,
  FiSun,
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
  check: FiCheck,
  'chevron-right': FiChevronRight,
  database: FiDatabase,
  eye: FiEye,
  eyeOff: FiEyeOff,
  globe: FiGlobe,
  italic: FiItalic,
  list: FiList,
  fastForward: FiFastForward,
  calendar: FiCalendar,
  sidebar: FiSidebar,
  search: FiSearch,
  home: FiHome,
  sun: FiSun,
  moon: FiMoon,
  monitor: FiMonitor,
  'external-link': FiExternalLink,
  file: FiFileText,
  paperclip: FiPaperclip,
  plus: FiPlus,
  briefcase: FiBriefcase,
  users: FiUsers,
  settings: FiSettings,
  mail: FiMail,
  move2: FiMove,
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
