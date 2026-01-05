import {cn} from "@game/App/utils.ts";
import type {ComponentChildren} from "preact";
import {useEffect, useRef, useState} from "preact/hooks";
import {ChevronLeft, ChevronRight, Circle, Pause} from "lucide-react";
import {CursorTooltip} from "@game/App/Components/CursorTooltip.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {Button} from "@game/App/Components/Button.tsx";

interface CarouselProps {
    children: ComponentChildren[];
    interval?: number; // ms
    className?: string;
}

function IndexIndicator({currentIndex, index, onClick}: {
    currentIndex: number,
    index: number,
    onClick: (index: number) => void
}) {
    const fill = index === currentIndex ? "#f59e0b" : "transparent";
    const stroke = index === currentIndex ? "#f59e0b" : "white";

    return (
        <button onClick={() => onClick(index)} className="cursor-pointer">
            <Circle className="w-4 h-4" fill={fill} stroke={stroke}/>
        </button>
    )
}

export function Carousel({children, interval = 3000, className}: CarouselProps) {
    const contentContainerRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [itemWidth, setItemWidth] = useState(400);
    const [pointerPosition, setPointerPosition] = useState({x: 0, y: 0});
    let timeoutId: number | undefined;

    const itemsPerPage = Math.max(1, Math.floor((contentContainerRef.current?.clientWidth ?? 0) / itemWidth));
    const pages = Math.ceil(children.length / itemsPerPage);
    const childToScrollTo = index * itemsPerPage;

    const itemsDisplayed = Math.min(children.length - childToScrollTo, itemsPerPage);
    const pageInterval = interval * itemsDisplayed;

    // auto rotate through the different pages
    useEffect(() => {
        if (autoRotate) {
            const timer = setTimeout(() => {
                if (timeoutId){
                    clearTimeout(timeoutId);
                }
                setIndex(prev => (prev + 1) % pages);
            }, pageInterval);
            return () => clearTimeout(timer);
        }
    }, [pages, index, autoRotate, pageInterval]);

    // Recalculate which page is showing on resize
    useEffect(() => {
        setIndex(i => Math.min(i, pages - 1));
    }, [pages]);


    useEffect(() => {
        if (!contentContainerRef.current) return;

        const container = contentContainerRef.current;
        const firstItem = container.firstElementChild as HTMLElement;

        if (!firstItem) return;

        const observer = new ResizeObserver(() => {
            const measuredItemWidth = firstItem.clientWidth;

            setItemWidth(measuredItemWidth);
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [children.length]);

    const prev = () => setIndex((index - 1 + pages) % pages);
    const next = () => setIndex((index + 1) % pages);
    const onPointerMove = (event: PointerEvent) => setPointerPosition(event);

    const indexIndicators = new Array<ComponentChildren>();
    for(let i = 0; i < pages; i++) {
        indexIndicators.push((
            <IndexIndicator currentIndex={index} index={i} key={i} onClick={(i) => setIndex(i)}/>
        ));
    }

    return (
        <div
            className={cn("relative overflow-hidden w-full carousel-mask", className)}
            onPointerEnter={() => setAutoRotate(false)}
            onPointerLeave={() => {
                setAutoRotate(true)
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    next();
                    timeoutId = undefined;
                }, interval);
            }}
            onPointerMove={onPointerMove}
        >
            <CursorTooltip cursorPosition={pointerPosition} active={!autoRotate} >
                <Pause className="w-5 h-5 pr-1" /><span className="text-nowrap"><I18nText id="carousel-paused"/></span>
            </CursorTooltip>
            <div
                ref={contentContainerRef}
                className="flex transition-transform duration-500"
                style={{transform: `translateX(-${childToScrollTo * itemWidth}px)`}}
            >
                {children.map((child, i) => (
                    <div className="shrink-0" key={i}>
                        {child}
                    </div>
                ))}
            </div>
            <div className="flex w-full flex-row justify-center pt-5 gap-2">
                <Button onClick={prev} variant="outline" className="p-0">
                    <ChevronLeft/>
                </Button>
                {indexIndicators}
                <Button onClick={next} variant="outline" className="p-0">
                    <ChevronRight/>
                </Button>
            </div>
        </div>
    );
}
