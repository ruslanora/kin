import http from 'node:http';

import { asc, eq, getTableColumns, isNull, max, sql } from 'drizzle-orm';

import { getDb } from './database/client';
import { boards, columns, companies, jobs } from './database/schema';

const PORT = 6767;
const HOST = '127.0.0.1';

let server: http.Server | null = null;

const ALLOWED_ORIGINS = ['http://localhost'];

const setCorsHeaders = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void => {
  const origin = req.headers.origin ?? '';

  if (
    origin.startsWith('chrome-extension://') ||
    ALLOWED_ORIGINS.includes(origin)
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const sendJson = (
  res: http.ServerResponse,
  status: number,
  data: unknown,
): void => {
  const body = JSON.stringify(data);

  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });

  res.end(body);
};

const readBody = (req: http.IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
};

const handleRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url ?? '/', `http://${HOST}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET' && pathname === '/ping') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/job') {
    const url = parsedUrl.searchParams.get('url');
    if (!url) {
      sendJson(res, 400, { error: 'Missing url param' });
      return;
    }

    try {
      const db = getDb();
      const job = db
        .select({
          ...getTableColumns(jobs),
          companyName: companies.name,
          columnName: columns.name,
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(columns, eq(jobs.columnId, columns.id))
        .where(eq(jobs.url, url))
        .get();

      sendJson(res, 200, { job: job ?? null });
    } catch (err) {
      sendJson(res, 500, { error: String(err) });
    }
    return;
  }

  if (req.method === 'GET' && pathname === '/company') {
    const name = parsedUrl.searchParams.get('name');
    if (!name || !name.trim()) {
      sendJson(res, 200, { jobs: [] });
      return;
    }

    try {
      const db = getDb();
      const results = db
        .select({
          ...getTableColumns(jobs),
          companyName: companies.name,
          columnName: columns.name,
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(columns, eq(jobs.columnId, columns.id))
        .where(sql`lower(${companies.name}) = lower(${name.trim()})`)
        .all();

      sendJson(res, 200, { jobs: results });
    } catch (err) {
      sendJson(res, 500, { error: String(err) });
    }
    return;
  }

  if (req.method === 'GET' && pathname === '/board/columns') {
    try {
      const db = getDb();
      const activeBoard = db
        .select()
        .from(boards)
        .where(isNull(boards.archivedAt))
        .limit(1)
        .get();

      if (!activeBoard) {
        sendJson(res, 200, { columns: [] });
        return;
      }

      const cols = db
        .select({ id: columns.id, name: columns.name })
        .from(columns)
        .where(eq(columns.boardId, activeBoard.id))
        .orderBy(asc(columns.order))
        .all();

      sendJson(res, 200, { columns: cols });
    } catch (err) {
      sendJson(res, 500, { error: String(err) });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/job') {
    readBody(req)
      .then((body) => {
        const {
          columnId: rawColumnId,
          title,
          url,
          companyName,
          description,
        } = JSON.parse(body) as {
          columnId?: number;
          title?: string;
          url?: string;
          companyName: string;
          description?: string;
        };

        const db = getDb();

        const result = db.transaction((table) => {
          const columnId =
            rawColumnId ??
            table
              .select({ id: columns.id })
              .from(columns)
              .innerJoin(boards, eq(columns.boardId, boards.id))
              .where(isNull(boards.archivedAt))
              .orderBy(asc(columns.order))
              .limit(1)
              .get()?.id;

          if (!columnId) throw new Error('No column available');

          const normalizedName = companyName.trim();

          const existing = table
            .select()
            .from(companies)
            .where(sql`lower(${companies.name}) = lower(${normalizedName})`)
            .limit(1)
            .get();

          const company =
            existing ??
            table
              .insert(companies)
              .values({ name: normalizedName })
              .returning()
              .get();

          const orderResult = table
            .select({ maxOrder: max(jobs.order) })
            .from(jobs)
            .where(eq(jobs.columnId, columnId))
            .get();

          const nextOrder =
            orderResult?.maxOrder !== null &&
            orderResult?.maxOrder !== undefined
              ? orderResult.maxOrder + 1
              : 0;

          const job = table
            .insert(jobs)
            .values({
              columnId,
              companyId: company.id,
              order: nextOrder,
              title,
              url,
              description,
              createdAt: new Date(),
            })
            .returning()
            .get();

          return { ...job, companyName: company.name };
        });

        sendJson(res, 201, result);
      })
      .catch((err) => {
        sendJson(res, 500, { error: String(err) });
      });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
};

export const startServer = (): void => {
  server = http.createServer(handleRequest);
  server.listen(PORT, HOST, () => {
    console.log(`[server] listening on http://${HOST}:${PORT}`);
  });
};

export const stopServer = (): void => {
  server?.close();
  server = null;
};
