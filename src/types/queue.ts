
export interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  arrivalTime: string;
  priority: 'normal' | 'urgent' | 'emergency';
  estimatedTime: number; // em minutos
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface ProcedureSummary {
  procedure: string;
  count: number;
}
