import { classNames } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import icon from './assets/icon.png';
import {
  FormScreen,
  FoundScreen,
  LoadingScreen,
  OfflineScreen,
  SavedScreen,
} from './screens';
import type {
  ColumnInfoType,
  CompanyResultType,
  CreateJobPayloadType,
  JobResultType,
  PopupStateType,
} from './types';
import { clearForm, loadSavedForm, persistForm } from './utils';

const API = 'http://127.0.0.1:6767';

export const App: FunctionComponent = () => {
  const [state, setState] = useState<PopupStateType>({ status: 'loading' });
  const [columns, setColumns] = useState<Array<ColumnInfoType>>([]);

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [columnId, setColumnId] = useState<number | null>(null);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [companyJobs, setCompanyJobs] = useState<Array<JobResultType>>([]);
  const [companyIsToAvoid, setCompanyIsToAvoid] = useState(false);

  useEffect(() => {
    void init();
  }, []);

  useEffect(() => {
    if (state.status !== 'not_found') return;

    persistForm({ url, title, companyName, columnId, description });
  }, [state.status, title, companyName, columnId, url, description]);

  useEffect(() => {
    if (!companyName.trim()) {
      setCompanyJobs([]);
      setCompanyIsToAvoid(false);
      return;
    }

    const timer = setTimeout(() => {
      void fetch(
        `${API}/company?name=${encodeURIComponent(companyName.trim())}`,
      )
        .then((r) => r.json())
        .then((d) => {
          const result = d as CompanyResultType;
          setCompanyJobs(result.jobs);
          setCompanyIsToAvoid(result.isToAvoid);
        })
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [companyName]);

  async function init(): Promise<void> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const currentUrl = tab?.url ?? '';

    try {
      const ping = await fetch(`${API}/ping`);

      if (!ping.ok) throw new Error('not ok');
    } catch {
      setState({ status: 'offline' });
    }

    const res = await fetch(`${API}/job?url=${encodeURIComponent(currentUrl)}`);
    const data = (await res.json()) as { job: JobResultType | null };

    if (data.job) {
      setState({ status: 'found', job: data.job });
      return;
    }

    const colRes = await fetch(`${API}/board/columns`);
    const colData = (await colRes.json()) as { columns: ColumnInfoType[] };

    setColumns(colData.columns);

    const saved = await loadSavedForm(currentUrl);

    setUrl(currentUrl);
    setTitle(saved?.title ?? '');
    setCompanyName(saved?.companyName ?? '');
    setDescription(saved?.description ?? '');
    setColumnId(saved?.columnId ?? colData.columns[0]?.id ?? null);

    setState({ status: 'not_found', url: currentUrl });
  }

  const handleSubmit = async () => {
    if (state.status !== 'not_found' || !companyName.trim()) return;

    setSaving(true);

    try {
      const payload: CreateJobPayloadType = {
        companyName,
        title,
        columnId: columnId ?? columns[0]?.id,
        url,
        description,
      };

      const res = await fetch(`${API}/job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const job = (await res.json()) as JobResultType;

      clearForm();
      setState({ status: 'saved', job });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={classNames('')}>
      <div
        className={classNames(
          'w-full flex flex-col items-center justify-center p-4',
        )}
      >
        <img
          alt="Kin"
          height={32}
          width={32}
          src={icon}
          className="flex shrink-0"
        />
      </div>
      <div className="w-full flex flex-1 flex-col items-stretch justify-start p-4">
        {(() => {
          switch (state.status) {
            case 'loading':
              return <LoadingScreen />;
            case 'offline':
              return <OfflineScreen />;
            case 'found':
              return <FoundScreen data={state.job} />;
            case 'saved':
              return <SavedScreen data={state.job} />;
            case 'not_found':
            default:
              return (
                <FormScreen
                  columns={columns}
                  title={title}
                  setTitle={setTitle}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  companyJobs={companyJobs}
                  companyIsToAvoid={companyIsToAvoid}
                  columnId={columnId}
                  setColumnId={setColumnId}
                  url={url}
                  setUrl={setUrl}
                  description={description}
                  setDescription={setDescription}
                  saving={saving}
                  onSubmit={() => void handleSubmit()}
                />
              );
          }
        })()}
      </div>
    </div>
  );
};
