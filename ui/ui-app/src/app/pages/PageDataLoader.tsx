import React, { FunctionComponent, useEffect, useState } from "react";
import { Flex, FlexItem, PageSection, PageSectionVariants, Spinner } from "@patternfly/react-core";
import { UserService, useUserService } from "@services/useUserService.ts";

/**
 * Properties
 */
export type PageDataLoaderProps = {
    loaders: Promise<any> | Promise<any>[] | undefined;
    children?: React.ReactNode;
};

/**
 * Helper to load the data for a Page in the UI.
 * @param props
 * @constructor
 */
export const PageDataLoader: FunctionComponent<PageDataLoaderProps> = (props: PageDataLoaderProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const user: UserService = useUserService();

    useEffect(() => {
        if (props.loaders === undefined) {
            return;
        }
        let loaders: Promise<any> | Promise<any>[] | undefined = props.loaders;
        // If not loading anything, convert from null to empty array
        if (loaders == null) { loaders = []; }
        // Convert to array if not already
        if (!Array.isArray(loaders)) { loaders = [ loaders ]; }
        // Always add the "update current user" loader
        loaders = [
            user.updateCurrentUser(),
            ...loaders
        ];

        if (loaders.length === 0) {
            setLoading(false);
        } else {
            setLoading(true);
            Promise.all(loaders).then(() => {
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    }, [props.loaders]);

    if (isLoading) {
        return (
            <PageSection variant={PageSectionVariants.default} isFilled={true}>
                <Flex>
                    <FlexItem><Spinner size="lg"/></FlexItem>
                    <FlexItem><span>Loading...</span></FlexItem>
                </Flex>
            </PageSection>
        );
    } else {
        return props.children;
    }
};
