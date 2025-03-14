"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Actions() {
  const items = ["1", "2", "3", "4", "5"];

  return (
    <div className="px-16 py-4">
      <Carousel className="w-fit">
        <CarouselContent className="w-full">
          {items.map((item, index) => (
            <CarouselItem key={index} className="flex-grow basis-0 pl-4">
              <Card className="h-64 w-64">
                <CardContent className="flex h-full items-center justify-center p-6">
                  {item}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
