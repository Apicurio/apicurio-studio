import { CSSProperties, FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import "./ArtifactDescription.css";

/**
 * Properties
 */
export type ArtifactDescriptionProps = {
    description: string | undefined | null;
    truncate?: boolean;
    className?: string;
    style?: CSSProperties | undefined;
}

export const ArtifactDescription: FunctionComponent<ArtifactDescriptionProps> = ({ description, truncate, className, style }: ArtifactDescriptionProps) => {
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
