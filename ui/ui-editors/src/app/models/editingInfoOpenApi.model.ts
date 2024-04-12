interface EditingInfoOpenApiVendorExtension {
    name: string;
    schema: any;
    model: any;
    components: string[];
}

export interface EditingInfoOpenApi {

    vendorExtensions: EditingInfoOpenApiVendorExtension[];

}
