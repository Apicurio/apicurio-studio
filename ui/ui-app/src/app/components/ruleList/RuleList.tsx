import React, { FunctionComponent } from "react";
import "./RuleList.css";
import { Button, Flex, FlexItem, Grid, GridItem, TextContent, Tooltip } from "@patternfly/react-core";
import { CheckIcon, CodeBranchIcon, OkIcon, TrashIcon } from "@patternfly/react-icons";
import {
    CompatibilityLabel,
    CompatibilitySelect,
    IntegrityLabel,
    IntegritySelect, RuleListType,
    RuleValue,
    ValidityLabel,
    ValiditySelect
} from "@app/components";
import { Rule } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


export type RuleListProps = {
    onEnableRule: (ruleType: string) => void;
    onDisableRule: (ruleType: string) => void;
    onConfigureRule: (ruleType: string, config: string) => void;
    rules: Rule[];
    type: RuleListType;
};

const NAME_COLUMN_WIDTH: string = "250px";

export const RuleList: FunctionComponent<RuleListProps> = (props: RuleListProps) => {

    const isRuleEnabled = (ruleType: string): boolean => {
        return props.rules.filter(rule => rule.ruleType === ruleType).length > 0;
    };

    const getRuleRowClasses = (ruleType: string): string => {
        const classes: string[] = [ "rule" ];
        if (ruleType === "COMPATIBILITY") {
            classes.push("compatibility-rule");
        } else if (ruleType === "VALIDITY") {
            classes.push("validity-rule");
        } else if (ruleType === "INTEGRITY") {
            classes.push("integrity-rule");
        }
        if (!isRuleEnabled(ruleType)) {
            classes.push("disabled-state-text");
        }
        return classes.join(" ");
    };

    const getRuleConfig = (ruleType: string): string => {
        const frules: Rule[] = props.rules.filter(r => r.ruleType === ruleType);
        if (frules.length === 1) {
            return frules[0].config as string;
        } else {
            return "UNKNOWN";
        }
    };

    const validityRuleLabel: React.ReactElement = (
        <TextContent>
            <ValidityLabel value={getRuleConfig("VALIDITY")} />
        </TextContent>
    );

    const compatibilityRuleLabel: React.ReactElement = (
        <TextContent>
            <CompatibilityLabel value={getRuleConfig("COMPATIBILITY")} />
        </TextContent>
    );

    const integrityRuleLabel: React.ReactElement = (
        <TextContent>
            <IntegrityLabel value={getRuleConfig("INTEGRITY")} />
        </TextContent>
    );

    const validityDescription = (
        <span>Ensure that content is <em>valid</em> when creating an artifact or artifact version.</span>
    );
    const compatibilityDescription = (
        <span>Enforce a compatibility level when creating a new artifact version (for example, select Backward for backwards compatibility).</span>
    );
    const integrityDescription = (
        <span>Enforce artifact reference integrity when creating an artifact or artifact version.  Enable and configure this rule to ensure that provided artifact references are correct.</span>
    );

    return (
        <Grid className="rule-list">
            <GridItem span={12} className={getRuleRowClasses("VALIDITY")}>
                <Flex flexWrap={{ default: "nowrap" }}>
                    <FlexItem style={{ width: NAME_COLUMN_WIDTH, minWidth: NAME_COLUMN_WIDTH }}>
                        <OkIcon className="rule-icon" />
                        <span className="rule-name" id="validity-rule-name">Validity rule</span>
                    </FlexItem>
                    <FlexItem grow={{ default: "grow" }} className="rule-description">
                        <Tooltip content={validityDescription} position="bottom-start">
                            {
                                validityDescription
                            }
                        </Tooltip>
                    </FlexItem>
                    <FlexItem className="rule-actions">
                        <RuleValue type={props.type} label={validityRuleLabel} />
                    </FlexItem>
                </Flex>
            </GridItem>
            <GridItem span={12} className={getRuleRowClasses("COMPATIBILITY")}>
                <Flex flexWrap={{ default: "nowrap" }}>
                    <FlexItem style={{ width: NAME_COLUMN_WIDTH, minWidth: NAME_COLUMN_WIDTH }}>
                        <CodeBranchIcon className="rule-icon" />
                        <span className="rule-name" id="compatibility-rule-name">Compatibility rule</span>
                    </FlexItem>
                    <FlexItem grow={{ default: "grow" }} className="rule-description">
                        <Tooltip content={compatibilityDescription} position="bottom-start">
                            {
                                compatibilityDescription
                            }
                        </Tooltip>
                    </FlexItem>
                    <FlexItem className="rule-actions">
                        <RuleValue type={props.type} label={compatibilityRuleLabel} />
                    </FlexItem>
                </Flex>
            </GridItem>
            <GridItem span={12} className={getRuleRowClasses("INTEGRITY")}>
                <Flex flexWrap={{ default: "nowrap" }}>
                    <FlexItem style={{ width: NAME_COLUMN_WIDTH, minWidth: NAME_COLUMN_WIDTH }}>
                        <CheckIcon className="rule-icon" />
                        <span className="rule-name" id="integrity-rule-name">Integrity rule</span>
                    </FlexItem>
                    <FlexItem grow={{ default: "grow" }} className="rule-description">
                        <Tooltip content={integrityDescription} position="bottom-start">
                            {
                                integrityDescription
                            }
                        </Tooltip>
                    </FlexItem>
                    <FlexItem className="rule-actions">
                        <RuleValue type={props.type} label={integrityRuleLabel} />
                    </FlexItem>
                </Flex>
            </GridItem>
        </Grid>
    );

};
