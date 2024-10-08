import { CSSProperties, FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import "./DesignDescription.css";

/**
 * Properties
 */
export type DesignDescriptionProps = {
    description: string | undefined;
    truncate?: boolean;
    className?: string;
    style?: CSSProperties | undefined;
}

export const DesignDescription: FunctionComponent<DesignDescriptionProps> = ({ description, truncate, className, style }: DesignDescriptionProps) => {
    let classes: string = "";
    if (className) {
        classes = className;
    }
    if (!description) {
        classes = classes + " no-description";
    }
    return truncate ? (
        <div>
            <Truncate style={style} className={classes} content={description || "No description."} tooltipPosition="top" />
        </div>
    ) : (
        <div className={classes} style={style}>{description || "No description."}</div>
    );
};
