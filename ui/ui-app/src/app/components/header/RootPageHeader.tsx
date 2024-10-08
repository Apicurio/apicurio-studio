import React, { FunctionComponent } from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";


/**
 * Properties
 */
export type RootPageHeaderProps = {
    tabKey: number;
};


export const RootPageHeader: FunctionComponent<RootPageHeaderProps> = (props: RootPageHeaderProps) => {
    const appNavigation: AppNavigationService = useAppNavigation();

    const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, eventKey: number | string): void => {
        if (eventKey !== props.tabKey) {
            if (eventKey === 0) {
                // navigate to artifacts
                appNavigation.navigateTo("/drafts");
            }
            if (eventKey === 1) {
                // navigate to global rules
                appNavigation.navigateTo("/explore");
            }
        }
    };

    const tabs: any[] = [
        <Tab data-testid="drafts-tab" key={0} eventKey={0} title={<TabTitleText>Drafts</TabTitleText>} />,
        <Tab data-testid="explore-tab" key={1} eventKey={1} title={<TabTitleText>Explore</TabTitleText>} />,
    ];
    return (
        <div>
            <Tabs className="root-tabs" activeKey={props.tabKey} onSelect={handleTabClick} children={tabs} />
        </div>
    );

};
