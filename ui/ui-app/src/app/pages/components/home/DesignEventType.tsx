import React, { FunctionComponent } from "react";
import { DesignEvent } from "@models/designs";


export type DesignEventTypeProps = {
    event: DesignEvent;
    variant?: "long" | "short";  // Default is "long"
};


export const DesignEventType: FunctionComponent<DesignEventTypeProps> = ({ event, variant }: DesignEventTypeProps) => {
    const typeLabel = (): React.ReactNode => {
        switch (event.type) {
            case "DOWNLOAD":
                return variant === "short" ? <span>File</span> : <span>Downloaded to file system</span>;
            case "CREATE":
                return variant === "short" ? <span>New</span> : <span>Created new design</span>;
            case "IMPORT":
                return importTypeLabel();
            case "UPDATE":
                return variant === "short" ? <span>Edited</span> : <span>Modified using the editor</span>;
        }
    };

    const importTypeLabel = (): React.ReactNode => {
        if (event.data.import?.url) {
            return variant === "short" ? <span>URL</span> : (
                <React.Fragment>
                    <span>Imported from URL: </span>
                    <a href={event.data.import.url}>{event.data.import.url}</a>
                </React.Fragment>
            );
        }
        if (event.data.import?.file) {
            return variant === "short" ? <span>File</span> : <span>{`Imported from file ${event.data.import.file}`}</span>;
        }
        return <span>Imported content</span>;
    };

    return (
        <React.Fragment children={typeLabel()} />
    );
};
