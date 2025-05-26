
import React, { useState, useEffect } from 'react';
import { Clock, Users, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Appointment } from '../types/queue';

interface QueueListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const QueueList: React.FC<QueueListProps> = ({ appointments, isLoading }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'urgent':
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
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
    <div className="space-y-4">
      {appointments.map((appointment, index) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                  {getPriorityBadge(appointment.priority)}
                </div>
                
                <div className="ml-11 space-y-2">
                  <p className="text-gray-600">{appointment.procedure}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Chegada: {appointment.arrivalTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(appointment.priority)}
                      <span>Tempo estimado: {appointment.estimatedTime}min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QueueList;
