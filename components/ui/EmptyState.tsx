import React from 'react';
import { PackageX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title = "No Data Found", 
  message = "We couldn't find anything here right now.",
  icon,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 mx-auto w-full max-w-4xl ${className}`}>
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        {icon || <PackageX className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-xl font-black font-integral mb-2 text-black uppercase tracking-wider">{title}</h3>
      <p className="text-gray-500 max-w-md font-satoshi">{message}</p>
    </div>
  );
}
