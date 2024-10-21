import { FunctionComponent, useState } from "react";
import { Button, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import { AvatarDropdown } from "@app/components";
import { AppAboutModal, BackendInfo, FrontendInfo, IfAuth } from "@apicurio/common-ui-components";
import { SystemService, useSystemService } from "@services/useSystemService.ts";
import { ApicurioStudioConfig, useConfigService, VersionType } from "@services/useConfigService.ts";


export type AppHeaderToolbarProps = object;


export const AppHeaderToolbar: FunctionComponent<AppHeaderToolbarProps> = () => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const config: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const version: VersionType = config?.version as VersionType;
    const system: SystemService = useSystemService();

    const frontendInfo: FrontendInfo = {
        ...version
    };
    const fetchBackendInfo = async (): Promise<BackendInfo> => {
        return system.getInfo().then(info => {
            return {
                name: info.name,
                description: info.description,
                version: info.version,
                builtOn: info.builtOn,
                digest: ""
            } as BackendInfo;
        });
    };

    return (
        <>
            <AppAboutModal
                frontendInfo={frontendInfo}
                backendInfo={fetchBackendInfo}
                backendLabel="Apicurio Registry API info"
                brandImageSrc="/apicurio_studio_logo_reverse.svg"
                brandImageAlt={version.name}
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)} />
            <Toolbar id="app-header-toolbar" isFullHeight={true}>
                <ToolbarContent>
                    <ToolbarGroup align={{ default: "alignRight" }}>
                        <ToolbarItem>
                            <Button variant="plain" onClick={() => setIsAboutModalOpen(!isAboutModalOpen)}>
                                <QuestionCircleIcon style={{ fontSize: "16px" }} />
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <IfAuth enabled={true}>
                                <AvatarDropdown />
                            </IfAuth>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
        </>
    );

};
