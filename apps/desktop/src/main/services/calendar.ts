import { execSync } from 'child_process';
import log from 'electron-log';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeMacPermissions = require('node-mac-permissions');

export function isCalendarAuthorized(): boolean {
  return nodeMacPermissions.getAuthStatus('calendar') === 'authorized';
}

function runJxa(script: string): string {
  try {
    return execSync('osascript -l JavaScript', {
      input: script,
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    log.error('[calendar-service] JXA error:', error);
    return '';
  }
}

export function buildEventTitle(
  companyName: string,
  round?: string | null,
): string {
  return round
    ? `Interview at ${companyName} – ${round}`
    : `Interview at ${companyName}`;
}

export function buildFollowUpTitle(
  companyName: string,
  round?: string | null,
): string {
  return round
    ? `Follow-up – Interview at ${companyName} – ${round}`
    : `Follow-up – Interview at ${companyName}`;
}

export function createCalendarEvent(params: {
  title: string;
  scheduledAt: Date;
  note?: string | null;
}): string | null {
  const { title, scheduledAt, note } = params;
  const endDate = new Date(scheduledAt.getTime() + 60 * 60 * 1000);

  const script = `
    const app = Application('Calendar');
    let cal;
    const existingCals = app.calendars.whose({name: 'Kin'})();
    if (existingCals.length === 0) {
      cal = app.Calendar({name: 'Kin'});
      app.calendars.push(cal);
    } else {
      cal = existingCals[0];
    }
    const props = {
      summary: ${JSON.stringify(title)},
      startDate: new Date(${scheduledAt.getTime()}),
      endDate: new Date(${endDate.getTime()})
    };
    ${note ? `props.description = ${JSON.stringify(note)};` : ''}
    const event = app.Event(props);
    cal.events.push(event);
    event.uid();
  `;

  const uid = runJxa(script);
  return uid || null;
}

export function deleteCalendarEvent(uid: string): void {
  const script = `
    const app = Application('Calendar');
    for (const cal of app.calendars()) {
      const matches = cal.events.whose({uid: ${JSON.stringify(uid)}})();
      if (matches.length > 0) {
        app.delete(matches[0]);
        break;
      }
    }
  `;
  runJxa(script);
}
