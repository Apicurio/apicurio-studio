import React, { FunctionComponent, useEffect, useState } from "react";
import { DesignEventType } from "./DesignEventType";
import { Design, DesignEvent } from "@models/designs";
import "./DesignEvents.css";
import { DesignOriginLabel } from "@app/pages/components/home/DesignOriginLabel.tsx";
import { hasOrigin } from "@utils/design.utils.ts";
import { DateTime, If, IfNotEmpty } from "@apicurio/common-ui-components";

export type DesignEventsProps = {
    design: Design | undefined;
    events: DesignEvent[] | undefined;
};


export const DesignEvents: FunctionComponent<DesignEventsProps> = ({ design, events }: DesignEventsProps) => {
    const [exports, setExports] = useState<DesignEvent[]>();
    const [originEvent, setOriginEvent] = useState<DesignEvent>();

    const originFilename = (): string => {
        return originEvent?.data?.import?.file || "";
    };
    const originUrl = (): string => {
        return originEvent?.data?.import?.url || "";
    };

    useEffect(() => {
        if (events) {
            // Extract just the "register" events (events related to exporting).
            setExports(events?.filter(event => event.type === "REGISTER"));
            // The origin event is the oldest (first) event.
            setOriginEvent(events.slice(-1)[0]);
        }
    }, [events]);

    return (
        <React.Fragment>
            <div className="origin">
                <div className="label">Origin</div>
                <div className="value">
                    <DesignOriginLabel design={design} />
                </div>

                <div className="label">Time created</div>
                <div className="value"><DateTime date={design?.createdOn} /></div>

                <If condition={hasOrigin(design, "file")}>
                    <div className="label">File name</div>
                    <div className="value">{originFilename()}</div>
                </If>

                <If condition={hasOrigin(design, "url")}>
                    <div className="label">URL</div>
                    <div className="value">
                        <a href={originUrl()}>{originUrl()}</a>
                    </div>
                </If>
            </div>
            <div className="divider" />
            <div className="exports">
                <div className="label">Exported to</div>
                <div></div>

                <IfNotEmpty collection={exports} emptyState={(
                    <span>This design has not been exported.</span>
                )}>
                    {
                        exports?.map((event, idx) => (
                            <React.Fragment key={idx}>
                                <div className="item" key={`${idx}-type`}><DesignEventType event={event} variant="short" /></div>
                                <div className="item" key={`${idx}-time`}><DateTime date={event.on} /></div>
                            </React.Fragment>
                        ))
                    }
                </IfNotEmpty>
            </div>
        </React.Fragment>
    );
};
