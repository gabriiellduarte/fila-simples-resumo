import React from 'react';
import { Users, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { Appointment } from '../types/queue';
import { usePagination } from '../hooks/usePagination';
import { Button } from '@/components/ui/button';

interface QueueListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const QueueList: React.FC<QueueListProps> = ({ appointments, isLoading }) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems
  } = usePagination({
    data: appointments,
    itemsPerPage: 10
  });

  const getPriorityBadge = (priority: number) => {
    const variants = {
      2: 'secondary',
      1: 'outline'
    } as const;

    const labels = {
      2: 'Urgente',
      1: 'Normal'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const formatAddress = (address: { street?: string; number?: string; neighborhood?: string }) => {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.number) parts.push(address.number);
    if (address.neighborhood) parts.push(address.neighborhood);
    return parts.join(', ') || 'Não informado';
  };

  const formatContact = (contact: { phone1?: string; phone2?: string }) => {
    const phones = [];
    if (contact.phone1) phones.push(contact.phone1);
    if (contact.phone2) phones.push(contact.phone2);
    return phones.join(' / ') || 'Não informado';
  };

  const getPositionNumber = (index: number) => {
    return ((currentPage - 1) * 10) + index + 1;
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink 
            onClick={() => goToPage(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center">Posição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Protocolo</TableHead>
                <TableHead>Data de cadastro</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="w-32">Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((appointment, index) => (
                <TableRow key={appointment.id} className="hover:bg-muted/50">
                  <TableCell className="text-center font-semibold">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm mx-auto">
                      {appointment.posicao}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell className="font-mono text-sm">{appointment.cns}</TableCell>
                  <TableCell className="font-mono text-sm">{appointment.criadoem}</TableCell>
                  <TableCell>{appointment.procedure}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span>{formatContact(appointment.contact)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="max-w-48 truncate" title={formatAddress(appointment.address)}>
                        {formatAddress(appointment.address)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(appointment.priority)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, totalItems)} de {totalItems} atendimentos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPreviousPage()}
              disabled={!hasPreviousPage}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToNextPage()}
              disabled={!hasNextPage}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueList;
