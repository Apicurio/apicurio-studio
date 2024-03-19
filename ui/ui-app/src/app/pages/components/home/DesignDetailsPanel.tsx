import { FunctionComponent, useEffect, useState } from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { Design, DesignEvent } from "@models/designs";
import { ArtifactTypeIcon } from "@app/components";
import { DesignsService, useDesignsService } from "@services/useDesignsService.ts";
import "./DesignDetailsPanel.css";
import { DateTime, IfNotLoading } from "@apicurio/common-ui-components";
import { DesignDescription, DesignEvents, DesignHistory, DesignOriginLabel } from "@app/pages";

/**
 * Properties
 */
export type DesignDetailsPanelProps = {
    design: Design | undefined;
};

/**
 * Details panel with metadata and history about a single selected design.
 */
export const DesignDetailsPanel: FunctionComponent<DesignDetailsPanelProps> = ({ design }: DesignDetailsPanelProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<DesignEvent[]>();
    const [activeTabKey, setActiveTabKey] = useState<string>("details");

    const designsService: DesignsService = useDesignsService();

    useEffect(() => {
        if (design) {
            designsService.getEvents(design.id).then((events: DesignEvent[]) => {
                setEvents(events);
                setLoading(false);
            }).catch((error: any) => {
                // TODO error handling!
                console.error(error);
            });
        }
    }, [design]);

    return (
        <IfNotLoading isLoading={isLoading}>
            <Tabs
                activeKey={activeTabKey}
                onSelect={(_event, eventKey) => {setActiveTabKey(eventKey as string);}}
                aria-label="Design panel detail tabs"
            >
                <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>}>
                    <div className="grid">
                        <div className="grid-label">Description</div>
                        <div className="grid-value">
                            <DesignDescription className="design-details-value" description={design?.description} />
                        </div>

                        <div className="grid-label">Type</div>
                        <div className="grid-value">
                            <ArtifactTypeIcon type={design?.type as string} isShowLabel={true} isShowIcon={true} />
                        </div>

                        <div className="grid-label">Time created</div>
                        <div className="grid-value"><DateTime date={design?.createdOn} /></div>

                        <div className="grid-label">Time updated</div>
                        <div className="grid-value"><DateTime date={design?.modifiedOn} /></div>

                        <div className="grid-label">Origin</div>
                        <div className="grid-value">
                            <DesignOriginLabel design={design} />
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="events" title={<TabTitleText>Events</TabTitleText>}>
                    <DesignEvents design={design} events={events} />
                </Tab>
                <Tab eventKey="history" title={<TabTitleText>History</TabTitleText>}>
                    <DesignHistory events={events} />
                </Tab>
            </Tabs>
        </IfNotLoading>
    );
};
