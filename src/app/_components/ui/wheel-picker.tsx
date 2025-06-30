import React, { useEffect, useCallback, useRef } from "react";

import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@app/_lib/utils";

const CIRCLE_DEGREES = 360;
const WHEEL_ITEM_SIZE = 32;
const WHEEL_ITEM_COUNT = 18;
const WHEEL_ITEMS_IN_VIEW = 4;

export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT;
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW;
export const WHEEL_RADIUS = Math.round(WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT));

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES;

const setSlideStyles = (
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  slideCount: number,
  totalRadius: number
): void => {
  const slideNode = emblaApi.slideNodes()[index];
  const wheelLocation = emblaApi.scrollProgress() * totalRadius;
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius;
  const positionLoopStart = positionDefault + totalRadius;
  const positionLoopEnd = positionDefault - totalRadius;

  let inView = false;
  let angle = index * -WHEEL_ITEM_RADIUS;

  if (isInView(wheelLocation, positionDefault)) {
    inView = true;
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true;
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS;
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true;
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS;
  }

  if (inView) {
    slideNode.style.opacity = "1";
    slideNode.style.transform = `translateY(-${
      index * 100
    }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`;
  } else {
    slideNode.style.opacity = "0";
    slideNode.style.transform = "none";
  }
};

export const setContainerStyles = (emblaApi: EmblaCarouselType, wheelRotation: number): void => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`;
};

type WheelPickerItemPropType<T> = {
  data: T[];
  loop?: boolean;
  label?: string;
  className?: string;
  value?: T;
  onChange?: (value: T) => void;
  perspective: "left" | "right" | "center";
};

const WheelPickerItem = <T,>(props: WheelPickerItemPropType<T>) => {
  const { data, perspective, label, loop = false, className, value, onChange } = props;

  const slideCount = data.length;
  const [internalValue, setInternalValue] = React.useState<T | undefined>(value);

  const currentValue = value ?? internalValue;
  const currentIndex = currentValue ? data.indexOf(currentValue) : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: "y",
    watchSlides: false,
    startIndex: currentIndex >= 0 ? currentIndex : 0,
  });
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS;
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS;

  const inactivateEmblaTransform = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    const { translate, slideLooper } = emblaApi.internalEngine();
    translate.clear();
    translate.toggleActive(false);
    slideLooper.loopPoints.forEach(({ translate }) => {
      translate.clear();
      translate.toggleActive(false);
    });
  }, []);

  const rotateWheel = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset;
      const wheelRotation = rotation * emblaApi.scrollProgress();
      setContainerStyles(emblaApi, wheelRotation);
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius);
      });
    },
    [slideCount, rotationOffset, totalRadius, loop]
  );

  const handleSelectionChange = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      const selectedValue = data[selectedIndex];

      if (selectedValue !== undefined) {
        if (!value) {
          setInternalValue(selectedValue);
        }
        onChange?.(selectedValue);
      }
    },
    [data, onChange, value]
  );

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("scroll", rotateWheel);
    emblaApi.on("select", handleSelectionChange);

    emblaApi.on("reInit", (emblaApi) => {
      inactivateEmblaTransform(emblaApi);
      rotateWheel(emblaApi);
    });

    inactivateEmblaTransform(emblaApi);
    rotateWheel(emblaApi);
  }, [emblaApi, inactivateEmblaTransform, rotateWheel, handleSelectionChange]);

  useEffect(() => {
    if (!emblaApi || !value) return;
    const newIndex = data.indexOf(value);
    if (newIndex >= 0 && newIndex !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(newIndex);
    }
  }, [emblaApi, value, data]);

  const perspectiveClasses = {
    left: "[perspective-origin:calc(50%_+_130px)_50%] translate-x-[27px]",
    center: "[perspective-origin:50%_50%]",
    right: "[perspective-origin:calc(50%_-_130px)_50%] -translate-x-[27px]",
  };

  return (
    <div
      className={cn(
        "flex h-full items-center justify-center text-[1.8rem] leading-none",
        className
      )}
    >
      <div
        className="flex h-full min-w-full touch-pan-x items-center overflow-hidden"
        ref={rootNodeRef}
      >
        <div
          className={`h-8 w-full select-none [-webkit-tap-highlight-color:transparent] [perspective:1000px] ${perspectiveClasses[perspective]}`}
          ref={emblaRef}
        >
          <div className="h-full w-full will-change-transform [transform-style:preserve-3d]">
            {data.map((item, index) => (
              <div
                className="flex h-full w-full items-center justify-center text-center text-xs opacity-0 [backface-visibility:hidden]"
                key={index}
              >
                {String(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
      {label && <div className="pointer-events-none -translate-x-[55px] font-bold">{label}</div>}
    </div>
  );
};

type WheelPicker = {
  children: React.ReactNode;
};

const WheelPicker: React.FC<WheelPicker> = (props) => {
  const { children } = props;

  return (
    <div className="relative mx-auto flex h-[10rem] w-full max-w-lg before:pointer-events-none before:absolute before:top-[-0.5px] before:right-0 before:left-0 before:z-10 before:h-[calc(50%_-_16px)] before:border-b before:border-gray-200 before:bg-gradient-to-t before:from-white/60 before:to-white before:content-[''] after:pointer-events-none after:absolute after:right-0 after:bottom-[-0.5px] after:left-0 after:z-10 after:h-[calc(50%_-_16px)] after:border-t after:border-gray-200 after:bg-gradient-to-b after:from-white/60 after:to-white after:content-['']">
      {children}
    </div>
  );
};

export { WheelPickerItem, WheelPicker };
