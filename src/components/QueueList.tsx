
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Appointment } from '../types/queue';

interface QueueListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const QueueList: React.FC<QueueListProps> = ({ appointments, isLoading }) => {
  const getPriorityBadge = (priority: string) => {
    const variants = {
      emergency: 'destructive',
      urgent: 'secondary',
      normal: 'outline'
    } as const;

    const labels = {
      emergency: 'Emergência',
      urgent: 'Urgente',
      normal: 'Normal'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum atendimento na fila</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">Posição</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNS</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead className="w-32">Prioridade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment.id} className="hover:bg-muted/50">
                <TableCell className="text-center font-semibold">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm mx-auto">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                <TableCell className="font-mono text-sm">{appointment.cns}</TableCell>
                <TableCell>{appointment.procedure}</TableCell>
                <TableCell>{getPriorityBadge(appointment.priority)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QueueList;
