import type { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ApplicationShell, Tracker } from './features';
import { useTheme } from './hooks';
import { CalendarPage, JobPage, SettingsPage } from './pages';

export const App: FunctionComponent = () => {
  useTheme();

  return (
    <MemoryRouter>
      <Routes>
        <Route element={<ApplicationShell />}>
          <Route path="/" element={<Tracker />} />
          <Route path="/job/:id" element={<JobPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/database" element={<></>} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
