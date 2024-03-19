import { Design, DesignOriginType } from "@models/designs";

export function hasOrigin(design: Design | undefined, contextType: DesignOriginType): boolean {
    return design?.origin === contextType;
}


export function limit(value: string | undefined, length: number): string | undefined {
    if (!value || value.length < length) {
        return value;
    }
    return value.substring(0, length - 3) + "...";
}
