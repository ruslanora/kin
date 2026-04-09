'use client';

import { type FunctionComponent, useId } from 'react';

type PropsType = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const Range: FunctionComponent<PropsType> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="text-xs text-stone-500 dark:text-stone-400 shrink-0"
      >
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-stone-200 dark:bg-stone-800 accent-stone-700 dark:accent-stone-300"
      />
    </div>
  );
};
