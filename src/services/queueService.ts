
import { Appointment, ProcedureSummary, APIPatient } from '../types/queue';
import { API_CONFIG } from '../config/api';

// Função para converter dados da API para o formato da aplicação
const convertAPIDataToAppointment = (apiData: APIPatient, index: number): Appointment => {
  return {
    id: apiData.SRG_PACIENTE_ID.toString(),
    patientName: apiData.SRG_PACIENTE_NOME,
    cns: apiData.SRG_PACIENTE_CNS,
    procedure: 'Consulta Médica', // Como não há procedimento na API, usar um padrão
    arrivalTime: new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    priority: 'normal' as const,
    estimatedTime: 30,
    status: 'waiting' as const
  };
};

export const queueService = {
  // Busca atendimentos da API real
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.appointments}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: APIPatient[] = await response.json();
      console.log('API Response:', apiData);
      
      // Converter dados da API para o formato da aplicação
      const appointments = apiData.map((patient, index) => 
        convertAPIDataToAppointment(patient, index)
      );
      
      return appointments.filter(apt => apt.status === 'waiting');
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
      // Retorna array vazio em caso de erro
      return [];
    }
  },

  // Busca procedimentos únicos dos dados da API
  async getProcedures(): Promise<string[]> {
    try {
      const appointments = await this.getAppointments();
      const procedures = [...new Set(appointments.map(apt => apt.procedure))];
      return procedures.sort();
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
      return [];
    }
  },

  // Gera resumo por procedimento
  async getProcedureSummary(): Promise<ProcedureSummary[]> {
    try {
      const appointments = await this.getAppointments();
      const summary = appointments.reduce((acc: Record<string, number>, apt) => {
        acc[apt.procedure] = (acc[apt.procedure] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(summary).map(([procedure, count]) => ({
        procedure,
        count
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return [];
    }
  }
};
