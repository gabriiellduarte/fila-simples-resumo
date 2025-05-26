
export interface APIPatient {
  SRG_PACIENTE_ID: number;
  SRG_PACIENTE_NOME: string;
  SRG_PACIENTE_CNS: string;
  SRG_PACIENTE_NASCIMENTO: string;
  SRG_PACIENTE_TELEFONE_1: string;
  SRG_PACIENTE_TELEFONE_2: string;
  SRG_PACIENTE_ENDERECO: string;
  SRG_PACIENTE_NOME_DA_MAE: string;
  SRG_PACIENTE_ENDERECO_N: string;
  SRG_PACIENTE_BAIRRO: string;
  SRG_LOC_ID: number | null;
  SRG_PAC_CPF: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  cns: string;
  procedure: string;
  arrivalTime: string;
  priority: 'normal' | 'urgent' | 'emergency';
  estimatedTime: number;
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface ProcedureSummary {
  procedure: string;
  count: number;
}
