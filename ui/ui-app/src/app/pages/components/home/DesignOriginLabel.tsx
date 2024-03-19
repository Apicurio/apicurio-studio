import { FunctionComponent } from "react";
import { Label } from "@patternfly/react-core";
import { hasOrigin } from "@utils/design.utils.ts";
import { Design } from "@models/designs";


export type DesignOriginLabelProps = {
    design: Design | undefined;
};


export const DesignOriginLabel: FunctionComponent<DesignOriginLabelProps> = ({ design }: DesignOriginLabelProps) => {

    const label = (): string => {
        if (design) {
            if (hasOrigin(design, "file")) {
                return "File";
            } else if (hasOrigin(design, "url")) {
                return "URL";
            } else if (hasOrigin(design, "create")) {
                return "New design";
            }
        }
        return "n/a";
    };

    const color = (): "blue" | "cyan" | "green" | "orange" | "purple" | "red" | "grey" => {
        if (design) {
            if (hasOrigin(design, "file")) {
                return "purple";
            } else if (hasOrigin(design, "url")) {
                return "green";
            }
        }
        return "grey";
    };

    return (
        <Label color={color()}>{label()}</Label>
    );
};
