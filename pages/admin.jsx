import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/crm');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FC] text-slate-800">
      <div className="flex flex-col items-center gap-3 text-xs font-semibold">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span>Redirecting to Luxignia Curatorial CRM & Operations Platform...</span>
      </div>
    </div>
  );
}
