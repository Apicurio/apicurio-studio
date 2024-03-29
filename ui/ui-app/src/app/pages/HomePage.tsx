import { FunctionComponent, useRef, useState } from "react";
import {
    Drawer,
    DrawerActions,
    DrawerCloseButton,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerPanelBody,
    DrawerPanelContent,
    Page,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
    TextVariants,
    Title,
    TitleSizes
} from "@patternfly/react-core";
import { CreateDesign, CreateDesignEvent, Design } from "@models/designs";
import { DesignsService, useDesignsService } from "@services/useDesignsService.ts";
import { Template } from "@models/templates";
import {
    CreateDesignModal,
    DesignDetailsPanel,
    DesignsPanel,
    ErrorModal,
    ImportDesignModal,
    ImportFrom
} from "@app/pages/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { AppHeader } from "@app/components";

export type HomePageProps = Record<string, never>;

export const HomePage: FunctionComponent<HomePageProps> = () => {
    const [ error, setError ] = useState<any>();
    const [ isCreating, setCreating ] = useState<boolean>(false);
    const [ isImporting, setImporting ] = useState<boolean>(false);
    const [ isDrawerExpanded, setDrawerExpanded ] = useState(false);
    const [ isCreateModalOpen, setCreateModalOpen ] = useState(false);
    const [ isImportModalOpen, setImportModalOpen ] = useState(false);
    const [ importType, setImportType ] = useState<ImportFrom>(ImportFrom.FILE);
    const [ selectedDesign, setSelectedDesign ] = useState<Design>();

    const drawerRef: any = useRef<HTMLSpanElement>();

    const designsSvc: DesignsService = useDesignsService();
    const nav: AppNavigationService = useAppNavigation();

    const onDrawerExpand = (): void => {
        drawerRef.current && drawerRef.current.focus();
    };

    const onDesignSelected = (design: Design | undefined): void => {
        setSelectedDesign(design);
        if (design) {
            setDrawerExpanded(true);
        } else {
            setDrawerExpanded(false);
        }
    };

    const onImport = (from: ImportFrom): void => {
        setImportType(from);
        setImportModalOpen(true);
    };

    const createDesign = async (info: CreateDesign, template: Template): Promise<void> => {
        info.content = template.content.replace("$NAME", info.name).replace("$SUMMARY", info.description || "");
        info.contentType = template.contentType;
        setCreating(true);
        return designsSvc.createDesign(info).then((design: Design) => {
            setCreating(false);
            setCreateModalOpen(false);
            nav.navigateTo(`/designs/${design.designId}/editor`);
        }).catch((error: any) => {
            console.error(error);
            setCreateModalOpen(false);
            setCreating(false);
            setError(error);
        });
    };

    const importDesign = async (cd: CreateDesign, cde?: CreateDesignEvent): Promise<void> => {
        console.info("[HomePage] Importing design: ", cd, cde);
        setImporting(true);
        return designsSvc.createDesign(cd, cde).then((design) => {
            setImporting(false);
            setImportModalOpen(false);
            nav.navigateTo(`/designs/${design.designId}/editor`);
        }).catch((error: any) => {
            console.error(error);
            setImporting(false);
            setImportModalOpen(false);
            setError(error);
        });
    };

    // The content of the side panel.  This should be a details panel with metadata and history (for example).
    const panelContent: any = (
        <DrawerPanelContent>
            <DrawerHead>
                <TextContent>
                    <Text component={TextVariants.small} className="pf-u-mb-0">
                        Name
                    </Text>
                    <Title
                        headingLevel="h2"
                        size={TitleSizes["xl"]}
                        className="pf-u-mt-0"
                    >
                        <div className="design-details-header">
                            <div className="design-name">{selectedDesign?.name}</div>
                        </div>
                    </Title>
                </TextContent>
                <DrawerActions>
                    <DrawerCloseButton onClick={() => onDesignSelected(undefined)} />
                </DrawerActions>
            </DrawerHead>
            <DrawerPanelBody>
                <DesignDetailsPanel design={selectedDesign} />
            </DrawerPanelBody>
        </DrawerPanelContent>
    );

    return (
        <Page className="pf-m-redhat-font" isManagedSidebar={false} header={<AppHeader />}>
            <Drawer isStatic={false} position="right" isInline={false} isExpanded={isDrawerExpanded} onExpand={onDrawerExpand}>
                <DrawerContent panelContent={panelContent}>
                    <DrawerContentBody className="home-panel-body">
                        <PageSection variant={PageSectionVariants.light} className="description pf-m-padding-on-xl">
                            <TextContent>
                                <Text component="h1" className="title">API and Schema Designs</Text>
                                <Text component="p" className="description">
                                    Apicurio Studio is a tool to design your APIs (OpenAPI, AsyncAPI) and schemas
                                    (Apache Avro, Google Protobuf, JSON Schema). Manage your collection of API and
                                    schema designs by creating, importing, and editing. Save your work by downloading
                                    your designs locally.
                                </Text>
                            </TextContent>
                            <CreateDesignModal isOpen={isCreateModalOpen} onCreate={createDesign}
                                isCreating={isCreating}
                                onCancel={() => {setCreateModalOpen(false);}} />
                            <ImportDesignModal isOpen={isImportModalOpen} onImport={importDesign}
                                isImporting={isImporting}
                                onCancel={() => {setImportModalOpen(false);}}
                                importType={importType} />
                            <ErrorModal title={"Error detected"} message={undefined} error={error} isOpen={error !== undefined} onClose={() => setError(undefined)} />
                        </PageSection>
                        <PageSection variant={PageSectionVariants.default} isFilled={true}>
                            <DesignsPanel onCreate={() => {setCreateModalOpen(true);}}
                                onDesignSelected={onDesignSelected}
                                selectedDesign={selectedDesign}
                                onImport={onImport} />
                        </PageSection>
                    </DrawerContentBody>
                </DrawerContent>
            </Drawer>
        </Page>
    );
};
