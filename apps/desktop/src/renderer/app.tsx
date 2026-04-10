import type { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ApplicationShell } from './features';
import {
  CalendarPage,
  DatabasePage,
  JobPage,
  MasterCoverLetter,
  MasterResume,
  SettingsPage,
  SupportPage,
  TrackerPage,
} from './pages';

export const App: FunctionComponent = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route element={<ApplicationShell />}>
          <Route path="/" element={<TrackerPage />} />
          <Route path="/job/:id" element={<JobPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/master-resume" element={<MasterResume />} />
          <Route
            path="/master-cover-letter"
            element={<MasterCoverLetter />}
          />{' '}
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
