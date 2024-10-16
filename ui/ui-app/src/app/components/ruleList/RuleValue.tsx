import React, {FunctionComponent} from "react";
import {RuleListType} from "@app/components";


export type RuleValueProps = {
    type: RuleListType;
    label: React.ReactElement;
};

export const RuleValue: FunctionComponent<RuleValueProps> = (props: RuleValueProps) => {

    return (
        <>
            {props.label}
        </>
    );
};
