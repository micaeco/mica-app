import { ReactNode } from "react";

import { Body, Font, Head, Html, Tailwind } from "@react-email/components";
import { TailwindConfig } from "@react-email/tailwind";

import { cn } from "@app/_lib/utils";

const emailTailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#28334d",
          secondary: "	#00f0dc",
          tertiary: "#d6fff3",
          quaternary: "#f39e16",
        },
      },
    },
  },
};

export default function Layout({
  lang,
  children,
  className,
}: {
  lang: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Html lang={lang}>
      <Head>
        <style>
          {`
            @media (max-width: 767px) {
              .desktop {
                display: none !important;
              }
              .mobile {
                display: block !important;
              }
            }
            @media (min-width: 768px) {
              .desktop {
                display: block !important;
              }
              .mobile {
                display: none !important;
              }
            }
          `}
        </style>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Tailwind config={emailTailwindConfig}>
        <Body
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          className={cn("text-brand-primary bg-white", className)}
        >
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
}
