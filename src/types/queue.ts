
export interface APIPatient {
  SRG_ATE_PROTOCOLO: number;
  SRG_ATE_POS_ATUAL:number;
  SRG_PACIENTE_NOME: string;
  SRG_PACIENTE_CNS: string;
  SRG_G_PROCEDIMENTO_NOME: string;
  SRG_ATE_CRIADOEM: string;
  SRG_AGE_PRIORIDADE: number;
  SRG_PAC_CPF: string;
  SRG_PACIENTE_TELEFONE_1?: string;
  SRG_PACIENTE_TELEFONE_2?: string;
  SRG_PACIENTE_ENDERECO?: string;
  SRG_PACIENTE_ENDERECO_N?: string;
  SRG_PACIENTE_BAIRRO?: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  cns: number;
  procedure: string;
  criadoem: string;
  priority: number;
  posicao: number;
  estimatedTime: number;
  status: 'waiting' | 'in-progress' | 'completed';
  contact: {
    phone1?: string;
    phone2?: string;
  };
  address: {
    street?: string;
    number?: string;
    neighborhood?: string;
  };
}

export interface ProcedureSummary {
  procedure: string;
  count: number;
}
