// components/Column.tsx
import React from 'react';
import { Check, X } from 'lucide-react';

interface ColumnProps {
  title: string;
  lines: string[];
  isHighlighted?: boolean;
}

const Column: React.FC<ColumnProps> = ({ title, lines, isHighlighted = false }) => {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isHighlighted 
          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' 
          : 'bg-gradient-to-r from-gray-500/10 to-gray-500/10'
      }`}></div>
      
      <div className={`relative backdrop-blur-xl border rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
        isHighlighted
          ? 'bg-gradient-to-b from-indigo-900/30 to-purple-900/30 border-indigo-500/30 shadow-indigo-500/20'
          : 'bg-gray-900/40 border-white/10 shadow-gray-500/10'
      }`}>
        <div className="mb-8">
          <h3 className={`text-2xl font-bold mb-2 ${
            isHighlighted 
              ? 'bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent'
              : 'text-white'
          }`}>
            {title}
          </h3>
          <div className={`h-1 w-12 rounded-full ${
            isHighlighted
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}></div>
        </div>
        
        <ul className="space-y-4">
          {lines.map((line, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                isHighlighted
                  ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
                  : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30'
              }`}>
                {isHighlighted ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <X className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className={`text-sm ${
                isHighlighted ? 'text-gray-300' : 'text-gray-400'
              }`}>
                {line}
              </span>
            </li>
          ))}
        </ul>
        
        {isHighlighted && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
              <span className="text-xs font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Recommended
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;