import {cn} from "@game/App/utils.ts";
import type {ComponentChildren} from "preact";
import {useEffect, useRef, useState} from "preact/hooks";
import {ChevronLeft, ChevronRight, Circle, Pause} from "lucide-react";
import {CursorTooltip} from "@game/App/Components/CursorTooltip.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(0);
    const [loop, setLoop] = useState(true);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({width: 400, height: 260});
    const [windows, setWindows] = useState(children.length); // Is the number of "windows" (that show multiple children) that the carousel can iterate through
    const [pointerPosition, setPointerPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        if (loop) {
            const timer = setTimeout(() => {
                setIndex(prev => (prev + 1) % windows);
            }, interval);
            return () => clearTimeout(timer);
        }
    }, [windows, interval, index, loop]);

    useEffect(() => {
        const el = containerRef.current?.firstElementChild as HTMLElement;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            setDimensions(entry.contentRect);
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const itemWidth = dimensions.width;
        const containerWidth = containerRef.current?.clientWidth;

        if (!containerWidth) return;

        const itemsPerView = Math.floor(containerWidth / itemWidth);
        const numberOfWindows = Math.ceil(children.length / itemsPerView);
        setWindows(numberOfWindows);
    }, [dimensions]);

    const prev = () => setIndex((index - 1 + windows) % windows);
    const next = () => setIndex((index + 1) % windows);

    const indexIndicators = new Array<ComponentChildren>();
    for(let i = 0; i < windows; i++) {
        indexIndicators.push((
            <IndexIndicator currentIndex={index} index={i} key={i} onClick={(i) => setIndex(i)}/>
        ));
    }

    const onPointerMove = (event: PointerEvent) => {
        setPointerPosition(event);
    }

    return (
        <div
            className={cn("relative overflow-hidden w-full carousel-mask", className)}
            onPointerEnter={() => setLoop(false)}
            onPointerLeave={() => setLoop(true)}
            onPointerMove={onPointerMove}
        >
            <CursorTooltip cursorPosition={pointerPosition} active={!loop} >
                <Pause className="w-5 h-5 pr-1" /><span className="text-nowrap"><I18nText id="carousel-paused"/></span>
            </CursorTooltip>
            <div
                ref={containerRef}
                className="flex transition-transform duration-500"
                style={{transform: `translateX(-${index * dimensions.width}px)`}}
            >
                {children.map((child, i) => (
                    <div className="shrink-0" key={i}>
                        {child}
                    </div>
                ))}
            </div>
            <div className="flex w-full flex-row justify-center pt-5 gap-2">
                <button onClick={prev} className="cursor-pointer">
                    <ChevronLeft/>
                </button>
                {indexIndicators}
                <button onClick={next} className="cursor-pointer">
                    <ChevronRight/>
                </button>
            </div>
        </div>
    );
}
