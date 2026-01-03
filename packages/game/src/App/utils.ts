import {type ClassNameValue, twMerge} from "tailwind-merge";

export function cn(...inputs: ClassNameValue[]) {
    return twMerge(inputs);
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}