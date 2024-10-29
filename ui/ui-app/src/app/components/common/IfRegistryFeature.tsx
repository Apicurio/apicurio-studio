import React, { FunctionComponent } from "react";
import { useConfigService } from "@services/useConfigService.ts";

/**
 * Properties
 */
export type IfRegistryFeatureProps = {
    feature: string;
    is?: any;
    isNot?: any;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated feature matches the given criteria.  Use this if you want to show/hide
 * UI elements based on the configured Registry application feature set.
 */
export const IfRegistryFeature: FunctionComponent<IfRegistryFeatureProps> = (props: IfRegistryFeatureProps) => {
    const config = useConfigService();

    const accept = () => {
        const features: any = config.getApicurioRegistryConfig().features;
        const featureValue: any = features[props.feature];
        if (props.is !== undefined) {
            return featureValue === props.is;
        } else if (props.isNot !== undefined) {
            return featureValue !== props.isNot;
        } else {
            return featureValue !== undefined;
        }
    };

    if (accept()) {
        return <React.Fragment children={props.children} />;
    } else {
        return <React.Fragment />;
    }

};
