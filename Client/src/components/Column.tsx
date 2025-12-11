import  { type FC } from 'react'; 

import { Target, Check } from 'lucide-react'; 

interface ColumnProps {
title: string;       
lines: string[];     
}

// 3. Define the Component (Fixes 'Cannot create components during render' - Image 4)
const Column: FC<ColumnProps> = ({ title, lines }) => (
<div className="bg-white border border-black/10 rounded-xl shadow-sm">
    <div className="p-6">
    <div className="mb-5 flex items-center gap-3">
    <div className="inline-flex w-9 h-9 items-center justify-center rounded-lg border bg-[#CCFBF1]/60">
    <Target className="w-5 h-5 text-[#0D9488]" />
        </div>
        <h4 className="text-lg font-semibold text-[#000000]">{title}</h4>
    </div>
    <ul className="space-y-3 text-sm">
        {/*  */}
        {lines.map((l, index) => (
        <li key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 w-4 h-4 text-[#0D9488]" />
            <span className="text-[#000000]/90">{l}</span>
        </li>
        ))}
    </ul>
    </div>
</div>
);

export default Column;