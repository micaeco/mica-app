import "@app/globals.css";
import { Metadata } from "next";

import { env } from "@env";

export const metadata: Metadata = {
  title: "MICA App",
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <>{children}</>;
}
