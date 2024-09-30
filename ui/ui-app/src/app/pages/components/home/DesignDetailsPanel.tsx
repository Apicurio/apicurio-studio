import { FunctionComponent, useState } from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { Design } from "@models/designs";
import { ArtifactTypeIcon } from "@app/components";
import { DateTime, IfNotLoading } from "@apicurio/common-ui-components";
import { DesignDescription, DesignOriginLabel } from "@app/pages";
import "./DesignDetailsPanel.css";

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
    const [isLoading, /*setLoading*/] = useState<boolean>(false);
    const [activeTabKey, setActiveTabKey] = useState<string>("details");

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
            </Tabs>
        </IfNotLoading>
    );
};
