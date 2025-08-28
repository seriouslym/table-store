import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Empty({className}: {className?: string}) {
  return <>
    <div className={cn('flex flex-col justify-center items-center gap-2', className)}>
      <FileText size={72} strokeWidth={0.3}/>
      <Label>暂无数据</Label>
    </div>
  </>
}