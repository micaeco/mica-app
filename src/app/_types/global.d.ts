import ca from "@app/_messages/ca.json";

type Messages = typeof ca;

declare global {
  type IntlMessages = Messages;
}
