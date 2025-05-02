import en from "@presentation/messages/en.json";

type Messages = typeof en;

declare global {
  type IntlMessages = Messages;
}

export interface TimeWindow {
  startDate: Date;
  endDate: Date;
  consumption?: number;
}
