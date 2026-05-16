import { AppShell } from '../../../components/layout/AppShell';
import { IngestForm } from '../../../components/ingest/IngestForm';

export default function IngestPage() {
  return (
    <AppShell
      title="Ingest"
      description="Add source material to the knowledge base, then inspect indexing results without leaving the workspace."
    >
      <IngestForm />
    </AppShell>
  );
}
