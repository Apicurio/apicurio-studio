import { Design, RenameDesign } from "@models/designs";


export interface AlertsService {
    designDeleted(design: Design): void;
    designDeleteFailed(design: Design, error: any): void;
    designSaved(design: Design): void;
    designRenamed(event: RenameDesign): void;
}


/**
 * React hook to get the Alerts service.
 */
export const useAlertsService: () => AlertsService = (): AlertsService => {
    return {
        designDeleted(design: Design): void {
            console.info(design);
            // serviceConfig.alerts.addAlert({
            //     title: "Delete successful",
            //     description: `Design '${design.name}' was successfully deleted.`,
            //     variant: AlertVariant.success,
            //     dataTestId: "toast-design-deleted"
            // });
        },

        designDeleteFailed(design: Design, error: any): void {
            console.info(design, error);
            // serviceConfig.alerts.addAlert({
            //     title: "Delete failed",
            //     description: `Failed to delete design '${design.name}'.  ${error}`,
            //     variant: AlertVariant.danger,
            //     dataTestId: "toast-design-delete-error"
            // });
        },

        designRenamed(event: RenameDesign): void {
            console.info(event);
            // serviceConfig.alerts.addAlert({
            //     title: "Details successfully changed",
            //     description: `Details (name, description) of design '${event.name}' were successfully changed.`,
            //     variant: AlertVariant.success,
            //     dataTestId: "toast-design-renamed"
            // });
        },

        designSaved(design: Design): void {
            console.info(design);
            // const description: React.ReactNode = (
            //     <React.Fragment>
            //         <div>
            //             Design '{design?.name}' was <span style={{ fontWeight: "bold" }}>successfully saved locally in your browser</span>.
            //         </div>
            //     </React.Fragment>
            // );
            //
            // serviceConfig.alerts.addAlert({
            //     title: "Save successful",
            //     description,
            //     variant: AlertVariant.success,
            //     dataTestId: "toast-design-saved"
            // });
        }
    };
};
