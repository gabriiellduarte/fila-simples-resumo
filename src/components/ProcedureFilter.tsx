
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface ProcedureFilterProps {
  procedures: string[];
  selectedProcedure: string;
  onProcedureChange: (procedure: string) => void;
  isLoading: boolean;
}

const ProcedureFilter: React.FC<ProcedureFilterProps> = ({
  procedures,
  selectedProcedure,
  onProcedureChange,
  isLoading
}) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <Select value={selectedProcedure} onValueChange={onProcedureChange} disabled={isLoading}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Filtrar por procedimento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os procedimentos</SelectItem>
          {procedures.map((procedure) => (
            <SelectItem key={procedure} value={procedure}>
              {procedure}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProcedureFilter;
