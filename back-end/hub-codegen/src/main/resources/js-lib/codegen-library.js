
function executeCodegen(oaiDoc) {
    console.debug("[codegen-library] Entering executeCommands");
    var library = new OAI.OasLibraryUtils();
    var oaiDocJSObj = JSON.parse(oaiDoc);
    var document = library.createDocument(oaiDocJSObj);
    
    var codegenInfo = {};

    return JSON.stringify(codegenInfo, null, 2);
}
