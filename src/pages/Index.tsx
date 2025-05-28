import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, BarChart3, Clock, Info, Phone, Mail, MapPin, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queueService } from '../services/queueService';
import QueueList from '../components/QueueList';
import ProcedureFilter from '../components/ProcedureFilter';
import { Appointment } from '../types/queue';

const Index = () => {
  const navigate = useNavigate();
  const [selectedProcedure, setSelectedProcedure] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Query para buscar atendimentos
  const { 
    data: appointments = [], 
    isLoading: appointmentsLoading, 
    refetch: refetchAppointments 
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: queueService.getAppointments,
    refetchInterval: 30000,
  });

  // Query para buscar procedimentos
  const { data: procedures = [], isLoading: proceduresLoading } = useQuery({
    queryKey: ['procedures'],
    queryFn: queueService.getProcedures,
  });

  // Query para buscar tempo médio
  const { data: averageTime = 0, isLoading: averageTimeLoading } = useQuery({
    queryKey: ['averageTime'],
    queryFn: queueService.getAverageTime,
    refetchInterval: 30000,
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

  // Atualiza o timestamp quando os dados são atualizados
  useEffect(() => {
    if (appointments.length > 0) {
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    }
  }, [appointments]);

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
                Regulação Municipal
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <Button
                  size="sm"
                  onClick={handleRefresh}
                  disabled={appointmentsLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${appointmentsLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                
              </div>
              
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
        {/* Central de Regulação - Informações principais */}
        <Card className="border-green-200 bg-green-50 mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Horário de Funcionamento */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário de Funcionamento
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>07H30 ÀS 11H30 E 13H30 ÀS 17H30</p>
                  <p className="font-medium">SEGUNDA A QUINTA-FEIRA</p>
                  <p className="mt-2">08H ÀS 14HS</p>
                  <p className="font-medium">SEXTA-FEIRA</p>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Informações de Contato</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">(88) 99752-0033</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">centralderegulacao@aracati.ce.gov.br</span>
                  </div>
                </div>
              </div>

              {/* Informações de Endereço */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Endereço</h4>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    RUA CORONEL ALEXANZITO, 657<br />
                    CENTRO - ARACATI
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtros e Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filtros */}
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

            {/* Estatísticas */}
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

            {/* Card de Tempo Médio de Espera */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                  <Timer className="h-5 w-5" />
                  Tempo Médio de Espera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {averageTimeLoading ? (
                      <div className="h-8 w-16 bg-purple-200 rounded animate-pulse mx-auto" />
                    ) : (
                      averageTime
                    )}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    dias
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Baseado nos últimos atendimentos
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Regras de Prioridade */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                  <Info className="h-5 w-5" />
                  Regras de Prioridade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="font-semibold text-blue-800">Status de Prioridade</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">Peso 1 - Pacientes com prioridade urgente são atendidos primeiro</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="font-semibold text-blue-800">Data de Solicitação</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">Peso 2 - Ordem cronológica das solicitações médicas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Lista de Atendimentos */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex flex-col gap-1">
                  {selectedProcedure !== 'all' ? `${selectedProcedure}` : 'Todos os Atendimentos'}
                  {lastUpdate && (
                  <span className="text-xs text-gray-400 mt-1 font-normal">
                    Última atualização: {lastUpdate}
                  </span>
                  )}
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
