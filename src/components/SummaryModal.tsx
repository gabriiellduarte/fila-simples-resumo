
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users } from 'lucide-react';
import { ProcedureSummary } from '../types/queue';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ProcedureSummary[];
  isLoading: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  isLoading
}) => {
  const totalAppointments = summary.reduce((total, item) => total + item.count, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo da Fila
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Total de Atendimentos</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalAppointments}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
              Por Procedimento
            </h4>
            
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {summary.map((item) => (
                  <Card key={item.procedure}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {item.procedure}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ 
                                width: `${(item.count / totalAppointments) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <Badge variant="outline">
                            {item.count}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryModal;
