import { Injectable, computed, signal } from '@angular/core';

export type KbStatus = 'Active' | 'Draft' | 'Empty';
export type DocStatus = 'Success' | 'In progress' | 'Failed to Sync';
export type DocType = 'PDF' | 'Doc' | 'PPTX' | 'Text' | 'CSV' | 'XLSX' | 'HTML' | 'JSON';

export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  documents: number;
  dataSources: number;
  status: KbStatus;
  createdOn: string;
}

export interface KbDocument {
  id: string;
  name: string;
  type: DocType;
  chunks: number;
  tokens: number;
  created: string;
  status: DocStatus;
}

const CREATED = '27/01/2026, 11:54:12 PM';

const DOC_NAME_POOL = [
  'Patch Management Policy - 2025',
  'Partner Risk Assessment (ISO 27001)',
  'Payment Security Policy',
  'New Branding Assets',
  'Logical Access Control Policy',
  'Welcome Kit KB',
  'Onboarding Policies',
  'Policy on Asset Management',
  'Security Incident Management Process',
  'Leave & Attendance Handbook',
  'Compensation Guidelines',
  'Vendor Onboarding Checklist',
];
const DOC_TYPES: DocType[] = ['PDF', 'Doc', 'PPTX', 'Text', 'CSV', 'XLSX'];
const DOC_STATUSES: DocStatus[] = ['Success', 'Success', 'Success', 'In progress', 'Failed to Sync'];

function generateDocs(kbId: string, count: number): KbDocument[] {
  const docs: KbDocument[] = [];
  for (let i = 0; i < count; i++) {
    docs.push({
      id: `${kbId}-doc-${i + 1}`,
      name: DOC_NAME_POOL[i % DOC_NAME_POOL.length],
      type: DOC_TYPES[i % DOC_TYPES.length],
      chunks: 15 + ((i * 37) % 640),
      tokens: 125 + ((i * 211) % 4400),
      created: CREATED,
      status: DOC_STATUSES[i % DOC_STATUSES.length],
    });
  }
  return docs;
}

@Injectable({ providedIn: 'root' })
export class KbService {
  private readonly kbs = signal<KnowledgeBase[]>([
    { id: 'kb-1', name: 'Confluence Doc Agent', description: 'Confluence space index.', documents: 12, dataSources: 0, status: 'Draft', createdOn: CREATED },
    { id: 'kb-2', name: 'New KB', description: 'Centralized repository of organizational knowledge, policies, procedures, and reference materials that agents can use to provide accurate responses.', documents: 25, dataSources: 2, status: 'Active', createdOn: CREATED },
    { id: 'kb-3', name: 'Fetch Adoption Metrics', description: 'Adoption metrics reference.', documents: 1, dataSources: 1, status: 'Active', createdOn: CREATED },
    { id: 'kb-4', name: 'Fetch Payslip', description: 'Payslip documents.', documents: 40, dataSources: 0, status: 'Active', createdOn: CREATED },
    { id: 'kb-5', name: 'Generate Workflow', description: 'Workflow templates.', documents: 80, dataSources: 3, status: 'Draft', createdOn: CREATED },
    { id: 'kb-6', name: 'Get Simple SDK', description: 'SDK references.', documents: 2, dataSources: 4, status: 'Active', createdOn: CREATED },
    { id: 'kb-7', name: 'Leave Balance Fetcher', description: 'Leave policy docs.', documents: 5, dataSources: 2, status: 'Draft', createdOn: CREATED },
    { id: 'kb-8', name: 'PNG Converter', description: 'Converter docs.', documents: 11, dataSources: 2, status: 'Active', createdOn: CREATED },
    { id: 'kb-9', name: 'My Slack', description: 'Slack export.', documents: 13, dataSources: 1, status: 'Active', createdOn: CREATED },
    { id: 'kb-10', name: 'My Jira', description: 'Jira knowledge.', documents: 21, dataSources: 3, status: 'Active', createdOn: CREATED },
    { id: 'kb-11', name: 'Employee Data', description: 'Employee records.', documents: 35, dataSources: 2, status: 'Active', createdOn: CREATED },
    { id: 'kb-12', name: 'Onboarding Handbook', description: 'Onboarding handbook.', documents: 8, dataSources: 1, status: 'Draft', createdOn: CREATED },
  ]);

  private readonly docsByKb = signal<Record<string, KbDocument[]>>({});

  readonly allKbs = computed(() => this.kbs());

  getKb(id: string): KnowledgeBase | undefined {
    return this.kbs().find((kb) => kb.id === id);
  }

  createKb(name: string, description: string): KnowledgeBase {
    const kb: KnowledgeBase = {
      id: `kb-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      documents: 0,
      dataSources: 0,
      status: 'Empty',
      createdOn: '27/01/2026, 11:54:12 PM',
    };
    this.kbs.update((list) => [kb, ...list]);
    this.docsByKb.update((map) => ({ ...map, [kb.id]: [] }));
    return kb;
  }

  deleteKb(id: string): void {
    this.kbs.update((list) => list.filter((kb) => kb.id !== id));
  }

  /** Generate + cache a KB's documents on first access. */
  ensureDocuments(kbId: string): void {
    if (this.docsByKb()[kbId]) {
      return;
    }
    const kb = this.getKb(kbId);
    const docs = kb && kb.documents > 0 ? generateDocs(kbId, kb.documents) : [];
    this.docsByKb.update((map) => ({ ...map, [kbId]: docs }));
  }

  documents(kbId: string): KbDocument[] {
    return this.docsByKb()[kbId] ?? [];
  }

  private addDoc(kbId: string, doc: KbDocument): void {
    this.docsByKb.update((map) => ({ ...map, [kbId]: [doc, ...(map[kbId] ?? [])] }));
    this.kbs.update((list) =>
      list.map((kb) =>
        kb.id === kbId
          ? { ...kb, documents: kb.documents + 1, status: kb.status === 'Empty' ? 'Active' : kb.status }
          : kb,
      ),
    );
  }

  /** Adds an uploaded file as an "In progress" doc, then flips to Success. */
  addUpload(kbId: string, fileName: string): string {
    const type = inferType(fileName);
    const id = `${kbId}-doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.addDoc(kbId, {
      id,
      name: fileName.replace(/\.[^.]+$/, ''),
      type,
      chunks: 0,
      tokens: 0,
      created: '27/01/2026, 11:54:12 PM',
      status: 'In progress',
    });
    return id;
  }

  markProcessed(kbId: string, docId: string): void {
    this.docsByKb.update((map) => ({
      ...map,
      [kbId]: (map[kbId] ?? []).map((d) =>
        d.id === docId
          ? { ...d, status: 'Success', chunks: 12 + Math.floor(Math.random() * 300), tokens: 200 + Math.floor(Math.random() * 3000) }
          : d,
      ),
    }));
  }

  markFailed(kbId: string, docId: string): void {
    this.docsByKb.update((map) => ({
      ...map,
      [kbId]: (map[kbId] ?? []).map((d) => (d.id === docId ? { ...d, status: 'Failed to Sync' } : d)),
    }));
  }

  setDocStatus(kbId: string, docId: string, status: DocStatus): void {
    this.docsByKb.update((map) => ({
      ...map,
      [kbId]: (map[kbId] ?? []).map((d) => (d.id === docId ? { ...d, status } : d)),
    }));
  }

  addTextDocument(kbId: string, name: string, text: string): void {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    this.addDoc(kbId, {
      id: `${kbId}-doc-${Date.now()}`,
      name: name.trim() || 'Untitled text',
      type: 'Text',
      chunks: Math.max(1, Math.ceil(words / 120)),
      tokens: Math.round(words * 1.3),
      created: '27/01/2026, 11:54:12 PM',
      status: 'Success',
    });
  }

  deleteDocument(kbId: string, docId: string): void {
    this.docsByKb.update((map) => ({ ...map, [kbId]: (map[kbId] ?? []).filter((d) => d.id !== docId) }));
    this.kbs.update((list) =>
      list.map((kb) => (kb.id === kbId ? { ...kb, documents: Math.max(0, kb.documents - 1) } : kb)),
    );
  }
}

function inferType(fileName: string): DocType {
  const ext = (fileName.split('.').pop() ?? '').toLowerCase();
  const map: Record<string, DocType> = {
    pdf: 'PDF',
    doc: 'Doc',
    docx: 'Doc',
    ppt: 'PPTX',
    pptx: 'PPTX',
    csv: 'CSV',
    xls: 'XLSX',
    xlsx: 'XLSX',
    html: 'HTML',
    json: 'JSON',
    txt: 'Text',
    md: 'Text',
  };
  return map[ext] ?? 'Doc';
}
