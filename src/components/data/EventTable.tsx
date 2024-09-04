import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types";
import { devices } from "@/constants";
import { formatDate } from "@/lib/utils";

interface Props {
  events: Event[];
  isEditing: boolean;
  modifyEvent: (id: string, updates: Partial<Event>) => void;
  headerComponent: React.ReactNode;
}

export default function EventTable({
  events,
  isEditing,
  modifyEvent,
  headerComponent,
}: Props) {
  const handleRecategorize = (event: Event, selectedDevice: string) => {
    const device = devices.find((device) => device.name === selectedDevice);
    if (!device) return;
    modifyEvent(event.id, { device: device, category: device.category });
  };

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
              {event.category.name}
            </TableCell>
            <TableCell>
              {isEditing ? (
                <Select
                  defaultValue={event.device.name}
                  onValueChange={(selectedDevice) =>
                    handleRecategorize(event, selectedDevice)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.name} value={device.name}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{event.device.name}</span>
                </div>
              )}
            </TableCell>
            <TableCell>{formatDate(event.timestamp)}</TableCell>
            <TableCell>{event.consumption} L</TableCell>
            <TableCell>{event.duration} sec</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
