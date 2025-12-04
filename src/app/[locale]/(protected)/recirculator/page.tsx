"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@app/_components/ui/button";
import { Input } from "@app/_components/ui/input";
import Loading from "@app/loading";

const DEVICE_ID_STORAGE_KEY = "recirculator-device-id";
const MAC_ID_REGEX = /^[0-9A-F]{12}$/;

export default function RecirculatorPage() {
  const router = useRouter();
  const t = useTranslations("recirculator");
  const [deviceId, setDeviceId] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const savedDeviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (savedDeviceId) {
      router.push(`/recirculator/${savedDeviceId}`);
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = deviceId.trim().toUpperCase();

    if (!MAC_ID_REGEX.test(trimmedId)) {
      toast.error(t("errorInvalidDeviceId"));
      return;
    }

    localStorage.setItem(DEVICE_ID_STORAGE_KEY, trimmedId);
    router.push(`/recirculator/${trimmedId}`);
  };

  if (isChecking) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8 p-4">
      <Image
        src="/icons/recirculator.webp"
        alt={t("title")}
        width={140}
        height={140}
        className="opacity-90"
      />

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{t("configureTitle")}</h1>
          <p className="text-muted-foreground text-sm">
            {t.rich("configureDescription", {
              br: () => <br />,
              emailLink: (chunks) => (
                <a href="mailto:info@mica.eco" className="text-blue-500 underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="deviceId"
              type="text"
              placeholder={t("deviceIdPlaceholder")}
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value.toUpperCase())}
              className="font-mono uppercase"
              maxLength={12}
              autoFocus
            />
          </div>

          <Button type="submit" className="mx-auto flex" size="lg" disabled={!deviceId.trim()}>
            {t("continue")}
          </Button>
        </form>
      </div>
    </div>
  );
}
