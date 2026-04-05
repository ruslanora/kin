import { type FunctionComponent, useEffect, useState } from 'react';

import type {
  ColumnInfoType,
  CreateJobPayloadType,
  JobResultType,
  PopupStateType,
} from '../types';
import { Found } from './messages/found';
import { Loading } from './messages/loading';
import { NotFound } from './messages/not-found';
import { Offline } from './messages/offline';
import { Saved } from './messages/saved';

const API = 'http://127.0.0.1:6767';
const STORAGE_KEY = 'kin_form';

type SavedForm = {
  url: string;
  title: string;
  companyName: string;
  columnId: number | null;
  description: string;
};

const loadSavedForm = async (currentUrl: string): Promise<SavedForm | null> => {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const saved = result[STORAGE_KEY] as SavedForm | undefined;

  if (saved && saved.url === currentUrl) {
    return saved;
  }

  return null;
};

const persistForm = (form: SavedForm) => {
  void chrome.storage.local.set({ [STORAGE_KEY]: form });
};

const clearForm = () => {
  void chrome.storage.local.remove(STORAGE_KEY);
};

export const App: FunctionComponent = () => {
  const [state, setState] = useState<PopupStateType>({ status: 'loading' });
  const [columns, setColumns] = useState<ColumnInfoType[]>([]);

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [columnId, setColumnId] = useState<number | null>(null);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [companyJobs, setCompanyJobs] = useState<JobResultType[]>([]);

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
      return;
    }

    const timer = setTimeout(() => {
      void fetch(
        `${API}/company?name=${encodeURIComponent(companyName.trim())}`,
      )
        .then((r) => r.json())
        .then((d) => setCompanyJobs((d as { jobs: JobResultType[] }).jobs))
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [companyName]);

  const init = async () => {
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
  };

  const handleSubmit = async () => {
    if (state.status !== 'not_found' || !companyName.trim()) return;

    setSaving(true);

    try {
      const payload: CreateJobPayloadType = {
        title,
        companyName,
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

  if (state.status === 'loading') return <Loading />;

  if (state.status === 'offline') return <Offline />;

  if (state.status === 'found') return <Found job={state.job} />;

  if (state.status === 'saved') return <Saved job={state.job} />;

  return (
    <NotFound
      columns={columns}
      title={title}
      setTitle={setTitle}
      companyName={companyName}
      setCompanyName={setCompanyName}
      companyJobs={companyJobs}
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
};
