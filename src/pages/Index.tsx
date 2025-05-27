import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, BarChart3, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queueService } from '../services/queueService';
import QueueList from '../components/QueueList';
import ProcedureFilter from '../components/ProcedureFilter';
import { Appointment } from '../types/queue';

const Index = () => {
  const navigate = useNavigate();
  const [selectedProcedure, setSelectedProcedure] = useState('all');
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

  const handleProcedureChange = (procedure: string) => {
    setSelectedProcedure(procedure);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <img 
                src="https://aracati.ce.gov.br/imagens/logovazada.png" 
                alt="Ícone de Fila" 
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-white hidden sm:block">
                Fila de Atendimento
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={appointmentsLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${appointmentsLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/resumo')}
                className="hover:text-orange-700"
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
                  onProcedureChange={handleProcedureChange}
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
                  <div className="text-3xl font-bold text-orange-600">
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
                <h6>Regras de prioridade da fila: <br/>Status de prioridade peso 1<br/>Data de solitação do médico peso 2</h6>
                <CardTitle className="text-xl">
                  {selectedProcedure !== 'all' ? `${selectedProcedure}` : 'Todos os Atendimentos'}
                </CardTitle>
                
                {selectedProcedure !== 'all' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProcedureChange('all')}
                    className="w-fit text-orange-600 hover:text-orange-800"
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
    </div>
  );
};

export default Index;
