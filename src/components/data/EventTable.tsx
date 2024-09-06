import React from "react";
import Image from "next/image";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  events: Event[];
  modifyEvent: (id: string, updates: Partial<Event>) => void;
  headerComponent: React.ReactNode;
}

export default function EventTable({ events, headerComponent }: Props) {
  return (
    <Table>
      {headerComponent}
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={index}>
            <TableCell className="capitalize flex">
              <Image
                src={event.category.icon}
                alt={event.category.name}
                width={24}
                height={24}
                className="mr-2"
              />
              {event.category.label}
            </TableCell>
            <TableCell>{event.device.name}</TableCell>
            <TableCell>{formatDate(event.timestamp)}</TableCell>
            <TableCell>{event.consumption} L</TableCell>
            <TableCell>{event.duration} sec</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
