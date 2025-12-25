
interface AdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminLandingPage({
  searchParams,
}: AdminPageProps) {
  const params = await searchParams;


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

    </div>
  );
}
