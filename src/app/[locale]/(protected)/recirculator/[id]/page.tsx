"use client";

import { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import { Power, AlertCircle, CircleCheckBig, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@app/_components/ui/button";
import { Progress } from "@app/_components/ui/progress";
import { Slider } from "@app/_components/ui/slider";
import { trpc } from "@app/_lib/trpc";
import {
  DEFAULT_MAX_TEMPERATURE,
  MAX_SAFE_TEMPERATURE,
  MIN_SAFE_TEMPERATURE,
} from "@domain/entities/recirculator";

type Phase = "OFF" | "SENDING" | "HEATING" | "READY";

const TEMP_REACHED_MARGIN = 1.5;
const TEMP_COOLING_THRESHOLD = 2;
const DISCONNECT_TIMEOUT_MS = 20000;
const COMMAND_TIMEOUT_MS = 10000;

const STORAGE_KEY = "recirculator-max-temp";

export default function RecirculatorPage() {
  const params = useParams();
  const deviceId = params.id as string;
  const t = useTranslations("recirculator");

  const [maxTemp, setMaxTemp] = useState<number>(DEFAULT_MAX_TEMPERATURE);
  const [phase, setPhase] = useState<Phase>("OFF");
  const [initialTemp, setInitialTemp] = useState<number>(0);
  const [showDisconnectWarning, setShowDisconnectWarning] = useState(false);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);
  const lastDeviceTimestampRef = useRef<string | null>(null);
  const lastTimestampCheckRef = useRef<number>(Date.now());
  const commandSentAtRef = useRef<number>(0);
  const heatingStartedAtRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= MIN_SAFE_TEMPERATURE && parsed <= MAX_SAFE_TEMPERATURE) {
        setMaxTemp(parsed);
      }
    }
  }, []);

  const shouldPoll = phase !== "OFF" || showDisconnectWarning || !hasInitialCheck;
  const pollingInterval =
    phase === "SENDING" ? 1000 : phase === "HEATING" || phase === "READY" ? 5000 : false;

  const { data: status, refetch } = trpc.recirculator.getStatus.useQuery(
    { deviceId },
    {
      refetchInterval: pollingInterval,
      enabled: shouldPoll,
      retry: 1,
    }
  );

  const turnOnMutation = trpc.recirculator.turnOn.useMutation({
    onError: (error) => {
      toast.error(t("errorTurnOn", { message: error.message }));
      setPhase("OFF");
    },
  });

  const turnOffMutation = trpc.recirculator.turnOff.useMutation({
    onSuccess: () => {
      toast.success(t("successStop"));
      setPhase("OFF");
      setShowDisconnectWarning(false);
      refetch();
    },
    onError: (error) => {
      toast.error(t("errorTurnOff", { message: error.message }));
    },
  });

  const setMaxTempMutation = trpc.recirculator.setMaxTemperature.useMutation({
    onError: (error) => {
      toast.error(t("errorSetTemp", { message: error.message }));
      setPhase("OFF");
    },
  });

  useEffect(() => {
    if (!status) return;

    const now = Date.now();
    const currentTemp = status.temperature ?? 0;
    const state = status.state;

    if (status.timestamp !== null && status.timestamp !== undefined) {
      const timestampStr = String(status.timestamp);
      if (lastDeviceTimestampRef.current !== timestampStr) {
        lastDeviceTimestampRef.current = timestampStr;
        lastTimestampCheckRef.current = now;
        setShowDisconnectWarning(false);
      }
    }

    if (phase === "OFF" && !hasInitialCheck) {
      setHasInitialCheck(true);
      if (state === "ON") {
        setPhase("HEATING");
        setInitialTemp(currentTemp);
        heatingStartedAtRef.current = now;
      }
      return;
    }

    if (phase === "SENDING") {
      if (state === "ON") {
        setPhase("HEATING");
        setInitialTemp(currentTemp);
        heatingStartedAtRef.current = now;
      } else if (now - commandSentAtRef.current > COMMAND_TIMEOUT_MS) {
        toast.error(t("errorNoResponse"));
        setPhase("OFF");
      }
      return;
    }

    if (phase === "HEATING") {
      if (now - lastTimestampCheckRef.current > DISCONNECT_TIMEOUT_MS) {
        setShowDisconnectWarning(true);
      }

      if (state === "OFF" && now - heatingStartedAtRef.current > 2000) {
        if (currentTemp >= maxTemp - TEMP_REACHED_MARGIN) {
          setPhase("READY");
        } else {
          toast.error(t("errorStoppedEarly"));
          setPhase("OFF");
        }
      }
      return;
    }

    if (phase === "READY") {
      if (currentTemp < maxTemp - TEMP_COOLING_THRESHOLD) {
        setPhase("OFF");
      }
      return;
    }
  }, [status, phase, maxTemp, hasInitialCheck, t]);

  const handleStart = async () => {
    if (maxTemp < MIN_SAFE_TEMPERATURE || maxTemp > MAX_SAFE_TEMPERATURE) {
      toast.error(t("errorTempRange", { min: MIN_SAFE_TEMPERATURE, max: MAX_SAFE_TEMPERATURE }));
      return;
    }

    localStorage.setItem(STORAGE_KEY, maxTemp.toString());
    setPhase("SENDING");
    commandSentAtRef.current = Date.now();

    try {
      await setMaxTempMutation.mutateAsync({ deviceId, maxTemperature: maxTemp });
      await turnOnMutation.mutateAsync({ deviceId });
    } catch {
      setPhase("OFF");
    }
  };

  const handleStop = () => {
    turnOffMutation.mutate({ deviceId });
  };

  const handleTempChange = (values: number[]) => {
    setMaxTemp(values[0]);
  };

  const currentTemp = status?.temperature ?? 0;
  const progress =
    phase === "HEATING" && initialTemp < maxTemp
      ? Math.min(100, Math.max(0, ((currentTemp - initialTemp) / (maxTemp - initialTemp)) * 100))
      : 0;

  const isInteractionDisabled = phase === "SENDING" || turnOffMutation.isPending;

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8 p-4">
      <Image
        src="/icons/recirculator.webp"
        alt="Recirculador"
        width={140}
        height={140}
        className="opacity-90"
      />

      {phase === "OFF" && (
        <>
          <Button size="lg" onClick={handleStart}>
            <Power className="h-5 w-5" />
            {t("heatWater")}
          </Button>
          <div className="w-52 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium">{t("temperature")}</label>
                <span className="text-xl font-bold transition-colors duration-300">
                  {maxTemp}°C
                </span>
              </div>
              <Slider
                value={[maxTemp]}
                onValueChange={handleTempChange}
                min={MIN_SAFE_TEMPERATURE}
                max={MAX_SAFE_TEMPERATURE}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </>
      )}

      {phase === "SENDING" && (
        <Button disabled variant="secondary" size="lg">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          <span className="text-muted-foreground font-medium">{t("sendingCommand")}</span>
        </Button>
      )}

      {phase === "HEATING" && (
        <>
          <div className="relative w-full max-w-sm">
            <span className="mb-4 flex w-full flex-row justify-center gap-1 font-semibold">
              {t("heating")}
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
            <div className="flex flex-row items-center justify-center gap-4">
              <Progress value={progress} className="[&>div]:bg-brand-quaternary h-4 w-60" />
              <span className="text-brand-quaternary font-bold">{maxTemp}°C</span>
            </div>

            {showDisconnectWarning && (
              <div className="border-brand-quaternary/50 bg-brand-quaternary/10 mt-3 flex items-start gap-2 rounded-lg border p-3">
                <AlertCircle className="text-brand-quaternary mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-brand-quaternary text-xs">
                  <p className="font-medium">{t("noDataWarning")}</p>
                  <p className="mt-0.5">{t("disconnectWarning")}</p>
                </div>
              </div>
            )}
          </div>

          <Button size="lg" variant="outline" onClick={handleStop} disabled={isInteractionDisabled}>
            {t("stop")}
          </Button>
        </>
      )}

      {phase === "READY" && (
        <>
          <div className="flex flex-row items-center gap-4 text-xl font-semibold">
            <CircleCheckBig size={40} />
            {t("waterReady")}
          </div>

          <Button size="lg" onClick={() => setPhase("OFF")}>
            {t("back")}
          </Button>
        </>
      )}
    </div>
  );
}
