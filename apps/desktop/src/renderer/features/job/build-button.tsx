import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  onClick: () => void;
  icon: ReactNode;
  label: string;
};

export const BuildButton: FunctionComponent<PropsType> = ({
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 w-full min-h-32 px-6 py-8 rounded-md border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
  >
    <span className="text-stone-400 dark:text-stone-500">{icon}</span>
    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
      {label}
    </p>
  </button>
);
