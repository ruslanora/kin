import type { FunctionComponent } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ApplicationShell } from './features';
import { CalendarPage } from './pages/calendar';

export const App: FunctionComponent = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route element={<ApplicationShell />}>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/job/:id" element={<></>} />
          <Route path="/calendar" element={<></>} />
          <Route path="/database" element={<></>} />
          <Route path="/settings" element={<></>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
