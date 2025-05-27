
import { Appointment, ProcedureSummary, APIPatient } from '../types/queue';
import { API_CONFIG } from '../config/api';

// Função para formatar o nome do paciente
const formatPatientName = (fullName: string): string => {
  const names = fullName.split(' ');
  if (names.length <= 2) return fullName;
  
  const firstName = names[0];
  const lastNames = names.slice(1).map(name => `${name[0]}.`);
  
  return `${firstName} ${lastNames.join(' ')}`;
};

// Função para converter dados da API para o formato da aplicação
const convertAPIDataToAppointment = (apiData: APIPatient, index: number): Appointment => {
  return {
    id: apiData.SRG_ATE_PROTOCOLO,
    patientName: formatPatientName(apiData.SRG_PACIENTE_NOME),
    cns: apiData.SRG_ATE_PROTOCOLO,
    procedure: apiData.SRG_G_PROCEDIMENTO_NOME,
    posicao: apiData.SRG_ATE_POS_ATUAL,
    criadoem: new Date(apiData.SRG_ATE_CRIADOEM).toLocaleTimeString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    priority: apiData.SRG_AGE_PRIORIDADE,
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
      } else {
        console.log("resposta ok");
      }
      
      const apiData: APIPatient[] = await response.json();
      console.log('API Response:', apiData);
      
      const appointments = apiData.map((patient, index) => 
        convertAPIDataToAppointment(patient, index)
      );
      
      return appointments;
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
      return [];
    }
  },

  // Busca procedimentos únicos dos dados da API
  async getProcedures(): Promise<string[]> {
    try {
      const appointments = await queueService.getAppointments();
      
      const procedures: string[] = [...new Set(appointments.map(apt => apt.procedure))];
      
      return procedures.sort();
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
      return [];
    }
  },

  // Gera resumo por procedimento
  async getProcedureSummary(): Promise<ProcedureSummary[]> {
    try {
      const appointments = await queueService.getAppointments();
      const summary = appointments.reduce((acc: Record<string, number>, apt) => {
        acc[apt.procedure] = (acc[apt.procedure] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(summary).map(([procedure, count]) => ({
        procedure,
        count: count as number
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return [];
    }
  }
};
