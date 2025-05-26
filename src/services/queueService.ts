
import { Appointment, ProcedureSummary } from '../types/queue';

// Dados simulados - substitua por chamadas reais da API
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Maria Silva',
    procedure: 'Consulta Cardiologia',
    arrivalTime: '08:30',
    priority: 'normal',
    estimatedTime: 30,
    status: 'waiting'
  },
  {
    id: '2',
    patientName: 'João Santos',
    procedure: 'Exame de Sangue',
    arrivalTime: '09:15',
    priority: 'urgent',
    estimatedTime: 15,
    status: 'waiting'
  },
  {
    id: '3',
    patientName: 'Ana Costa',
    procedure: 'Ultrassonografia',
    arrivalTime: '09:45',
    priority: 'normal',
    estimatedTime: 20,
    status: 'waiting'
  },
  {
    id: '4',
    patientName: 'Pedro Lima',
    procedure: 'Consulta Cardiologia',
    arrivalTime: '10:00',
    priority: 'emergency',
    estimatedTime: 45,
    status: 'waiting'
  },
  {
    id: '5',
    patientName: 'Carla Oliveira',
    procedure: 'Raio-X',
    arrivalTime: '10:30',
    priority: 'normal',
    estimatedTime: 10,
    status: 'waiting'
  },
  {
    id: '6',
    patientName: 'Roberto Mendes',
    procedure: 'Exame de Sangue',
    arrivalTime: '11:00',
    priority: 'normal',
    estimatedTime: 15,
    status: 'waiting'
  }
];

export const queueService = {
  // Simula uma chamada à API para buscar atendimentos
  async getAppointments(): Promise<Appointment[]> {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAppointments.filter(apt => apt.status === 'waiting');
  },

  // Simula uma chamada à API para buscar procedimentos únicos
  async getProcedures(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const procedures = [...new Set(mockAppointments.map(apt => apt.procedure))];
    return procedures.sort();
  },

  // Gera resumo por procedimento
  async getProcedureSummary(): Promise<ProcedureSummary[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const waitingAppointments = mockAppointments.filter(apt => apt.status === 'waiting');
    const summary = waitingAppointments.reduce((acc: Record<string, number>, apt) => {
      acc[apt.procedure] = (acc[apt.procedure] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(summary).map(([procedure, count]) => ({
      procedure,
      count
    })).sort((a, b) => b.count - a.count);
  }
};
