"use client";

import { cn } from "@lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";

interface ResponsiveCarouselProps {
  items: React.ReactNode[];
  className?: string;
}

export function ResponsiveCarousel({ items, className }: ResponsiveCarouselProps) {
  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent className="-ml-4">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="h-full p-1">
              <Card className="h-full">
                <CardContent className="flex h-full items-center justify-center p-6">
                  {item}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex justify-end gap-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
