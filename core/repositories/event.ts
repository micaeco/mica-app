import { Event } from "@core/entities/event";
import { Sensor } from "@core/entities/sensor";

export interface EventRepository {
  getEvents(sensorId: Sensor["id"], startDate: Date, endDate: Date): Event[];
  getLeakEvents(sensorId: Sensor["id"]): Event[];
  getUnknownEvents(sensorId: Sensor["id"]): Event[];
}
