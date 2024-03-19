import { FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import "./Description.css";

/**
 * Properties
 */
export type DescriptionProps = {
    description: string | undefined;
    truncate?: boolean;
    className?: string;
}


export const Description: FunctionComponent<DescriptionProps> = ({ description, truncate, className }: DescriptionProps) => {
    return truncate ? (
        <div>
            <Truncate className={`${(description === undefined || description === null || description === "") ? "no-description" : ""} ${className || ""}`}
                content={description || "No description."} tooltipPosition="top" />
        </div>
    ) : (
        <div className={`${(description === undefined || description === null || description === "") ? "no-description" : ""} ${className || ""}`}>{description || "No description."}</div>
    );
};
