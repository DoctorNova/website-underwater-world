import { Button } from "@game/App/Components/Button.tsx";
import { CursorTooltip } from "@game/App/Components/CursorTooltip.tsx";
import { DotNavigation } from "@game/App/Components/DotNavigation";
import { I18nText } from "@game/App/Components/I18nText.tsx";
import { useLastPointerType } from "@game/App/Hooks/useLastPointerType";
import { cn } from "@game/App/utils.ts";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";
import type { ComponentChildren, RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

interface CarouselProps {
  children: ComponentChildren[];
  interval?: number; // ms
  className?: string;
}

function getPositionByIndex(i: number, pages: number, itemsPerPage: number, itemWidth: number, elementRef: RefObject<HTMLElement>) {
  const index = i % pages;
  const parent = elementRef.current?.parentElement;
  const el = elementRef.current;

  if (!parent || !el) {
    return;
  }

  const isLastPage = index === pages - 1;
  const itemsOnPage = isLastPage ? Math.max(el.children.length % itemsPerPage, 1) : itemsPerPage;
  const prevIndex = index - 1;
  return itemWidth * prevIndex * itemsPerPage + itemsOnPage * itemWidth;
}

function CalculateNumberOfPages(containerRef: RefObject<HTMLElement>, defaultItemWidth = 400) {
  if (!containerRef.current){
    return 0;
  }

  const firstChild = containerRef.current.firstElementChild as HTMLElement;
  const currentItemWidth = firstChild.clientWidth ?? defaultItemWidth;
  const currentItemsPerPage = Math.max(1, Math.floor((containerRef.current.clientWidth ?? 0) / currentItemWidth));
  return Math.ceil(containerRef.current.children.length / currentItemsPerPage);
}

export function Carousel({ children, interval = 3000, className }: CarouselProps) {
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const { isMouse: isUserUsingMouse } = useLastPointerType();
  const [index, setIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(isUserUsingMouse); // only auto rotate if the user is using a mouse
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [pages, setPages] = useState(0);

  const itemWidth = contentContainerRef.current?.firstElementChild?.clientWidth ?? 400;
  const itemsPerPage = Math.max(1, Math.floor((contentContainerRef.current?.clientWidth ?? 0) / itemWidth));
  const childToScrollTo = index * itemsPerPage;
  const itemsDisplayed = Math.min(children.length - childToScrollTo, itemsPerPage);
  const pageInterval = interval * itemsDisplayed;

  // Recalculate which page is showing on resize
  useEffect(() => {
    setIndex(i => Math.max(Math.min(i, pages - 1), 0));
  }, [pages]);

  useEffect(() => {
    if (!contentContainerRef.current) return;

    const container = contentContainerRef.current;
    const firstItem = container.firstElementChild as HTMLElement;

    if (!firstItem) return;

    const observer = new ResizeObserver(() => {
      setPages(() => CalculateNumberOfPages(contentContainerRef));
    });

    observer.observe(container);
    
    setPages(() => CalculateNumberOfPages(contentContainerRef));

    return () => observer.disconnect();
  }, [children.length]);

  const prev = () => setIndex((index - 1 + pages) % pages);
  const next = () => setIndex((index + 1) % pages);
  const onPointerMove = (event: PointerEvent) => setPointerPosition(event);

  return (
    <div
      className={cn("relative overflow-hidden w-full overflow-x-fadeout-mask", className)}
      onPointerEnter={() => setAutoRotate(false)}
      onPointerLeave={() => {
        if (isUserUsingMouse) {
          setAutoRotate(true);
        }
      }}
      onPointerMove={onPointerMove}
    >
      <CursorTooltip cursorPosition={pointerPosition} active={!autoRotate && isUserUsingMouse} >
        <Pause className="w-5 h-5 pr-1" /><span className="text-nowrap"><I18nText id="carousel-paused" /></span>
      </CursorTooltip>
      <div
        ref={contentContainerRef}
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${getPositionByIndex(index, pages, itemsPerPage, itemWidth, contentContainerRef)}px)` }}
      >
        {children.map((child, i) => (
          <div className="shrink-0" key={i}>
            {child}
          </div>
        ))}
      </div>
      <div className="flex w-full flex-row justify-center pt-5 gap-2">
        <Button onClick={prev} variant="outline" className="p-0">
          <ChevronLeft />
        </Button>
        <DotNavigation count={pages} activeIndex={index} duration={pageInterval} pause={!autoRotate} onClick={(i) => setIndex(i)}  onAnimationEnd={() => {
          if(autoRotate){
            next();
          }
        }}/>
        <Button onClick={next} variant="outline" className="p-0">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
