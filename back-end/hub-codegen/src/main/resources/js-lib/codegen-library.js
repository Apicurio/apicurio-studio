
function executeCodegen(oaiDoc, javaPackage) {
    console.debug("[codegen-library] Entering executeCommands");
    var library = new OAI.OasLibraryUtils();
    var oaiDocJSObj = JSON.parse(oaiDoc);
    var document = library.createDocument(oaiDocJSObj);
    
    var cgLibrary = new OAI_codegen.CodegenLibrary();
    var codegenInfo = cgLibrary.generateJaxRsInfo(document, javaPackage);

    return JSON.stringify(codegenInfo, null, 2);
}
