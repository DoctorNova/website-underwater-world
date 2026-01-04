import type {ComponentChildren} from "preact";
import {useEffect, useRef, useState} from "preact/hooks";


type CursorTooltipProps = {
    active: boolean;
    children: ComponentChildren;
    offset?: number;
    containerRef?: {current?: HTMLElement | null};
    cursorPosition: {x: number; y: number};
};

export function CursorTooltip({ containerRef, cursorPosition, active, children, offset = 16}: CursorTooltipProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);

    useEffect(() => {
        const container = containerRef?.current || tooltipRef.current?.parentElement;
        if (!container || !tooltipRef.current) return;

        const containerRect = container.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        setFlipX(containerRect.right - cursorPosition.x < tooltipRect.width + offset);
        setFlipY(containerRect.bottom - cursorPosition.y < tooltipRect.height + offset);

    }, [cursorPosition, containerRef?.current, offset]);

    if (!active) {
        return null;
    }

    return (
        <div
            ref={tooltipRef}
            className="fixed z-50 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2d3a4f] backdrop-blur-md border border-white/30 text-white shadow-lg transition-opacity duration-150"
            style={{
                left: flipX
                    ? cursorPosition.x - offset
                    : cursorPosition.x + offset,
                top: flipY
                    ? cursorPosition.y - offset
                    : cursorPosition.y + offset,
                transform: `
          translate(
            ${flipX ? "-100%" : "0"},
            ${flipY ? "-100%" : "0"}
          )
        `,
            }}
        >
            {children}
        </div>
    );
}