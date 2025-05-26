import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { queueService } from '../services/queueService';
import { ProcedureSummary } from '../types/queue';

const Summary = () => {
  const navigate = useNavigate();

  const { data: summary = [], isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: queueService.getProcedureSummary,
  });

  const totalAppointments = summary.reduce((total, item) => total + item.count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <BarChart3 className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">
                Resumo da Fila
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Card de Total */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Total de Atendimentos</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalAppointments}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Procedimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Por Procedimento</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {item.procedure}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;