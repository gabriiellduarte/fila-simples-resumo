
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, BarChart3, Clock } from 'lucide-react';
import { queueService } from '../services/queueService';
import QueueList from '../components/QueueList';
import ProcedureFilter from '../components/ProcedureFilter';
import SummaryModal from '../components/SummaryModal';
import { Appointment, ProcedureSummary } from '../types/queue';

const Index = () => {
  const [selectedProcedure, setSelectedProcedure] = useState('all');
  const [showSummary, setShowSummary] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // Query para buscar atendimentos
  const { 
    data: appointments = [], 
    isLoading: appointmentsLoading, 
    refetch: refetchAppointments 
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: queueService.getAppointments,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Query para buscar procedimentos
  const { data: procedures = [], isLoading: proceduresLoading } = useQuery({
    queryKey: ['procedures'],
    queryFn: queueService.getProcedures,
  });

  // Query para buscar resumo (só quando modal estiver aberto)
  const { data: summary = [], isLoading: summaryLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: queueService.getProcedureSummary,
    enabled: showSummary,
  });

  // Filtra atendimentos quando procedure selecionado muda
  useEffect(() => {
    if (selectedProcedure && selectedProcedure !== 'all') {
      setFilteredAppointments(
        appointments.filter(apt => apt.procedure === selectedProcedure)
      );
    } else {
      setFilteredAppointments(appointments);
    }
  }, [appointments, selectedProcedure]);

  const handleRefresh = () => {
    refetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Fila de Atendimento
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={appointmentsLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${appointmentsLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                onClick={() => setShowSummary(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Resumo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtros e Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <ProcedureFilter
                  procedures={procedures}
                  selectedProcedure={selectedProcedure}
                  onProcedureChange={setSelectedProcedure}
                  isLoading={proceduresLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredAppointments.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedProcedure !== 'all' ? 'Filtrados' : 'Total na fila'}
                  </div>
                </div>
                
                {selectedProcedure !== 'all' && (
                  <div className="text-center pt-4 border-t">
                    <div className="text-xl font-semibold text-gray-700">
                      {appointments.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total geral
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Lista de Atendimentos */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {selectedProcedure !== 'all' ? `${selectedProcedure}` : 'Todos os Atendimentos'}
                </CardTitle>
                {selectedProcedure !== 'all' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProcedure('all')}
                    className="w-fit text-blue-600 hover:text-blue-800"
                  >
                    Limpar filtro
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <QueueList
                  appointments={filteredAppointments}
                  isLoading={appointmentsLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Resumo */}
      <SummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        summary={summary}
        isLoading={summaryLoading}
      />
    </div>
  );
};

export default Index;
