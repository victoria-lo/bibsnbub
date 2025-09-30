"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

export const CarouselContext = React.createContext<{
  api: CarouselApi | undefined;
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
  orientation: "horizontal" | "vertical";
} | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  setApi?: (api: CarouselApi) => void;
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
};

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      children,
      setApi,
      opts,
      plugins,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const [viewportRef, api] = useEmblaCarousel({ align: "start", ...opts }, plugins);

    React.useEffect(() => {
      if (!api) return;
      setApi?.(api);
    }, [api, setApi]);

    return (
      <CarouselContext.Provider value={{ api, viewportRef, orientation }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { viewportRef, orientation } = useCarousel();
    return (
      <div ref={viewportRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { api, orientation } = useCarousel();
    const isHorizontal = orientation === "horizontal";
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        onClick={() => api?.scrollPrev()}
        className={cn(
          "absolute h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center",
          "hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          isHorizontal ? "left-2 top-1/2 -translate-y-1/2" : "top-2 left-1/2 -translate-x-1/2",
          className
        )}
        {...props}
      >
        ‹
      </button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { api, orientation } = useCarousel();
    const isHorizontal = orientation === "horizontal";
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        onClick={() => api?.scrollNext()}
        className={cn(
          "absolute h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center",
          "hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          isHorizontal ? "right-2 top-1/2 -translate-y-1/2" : "bottom-2 left-1/2 -translate-x-1/2",
          className
        )}
        {...props}
      >
        ›
      </button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";
