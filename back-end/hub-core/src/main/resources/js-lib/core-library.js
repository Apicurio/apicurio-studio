
function executeCommands(oaiDoc, commands) {
    var library = new OAI.OasLibraryUtils();
    var document = library.createDocument(oaiDoc);
    
    if (commands) {
        var numCmds = commands.length;
        for (var i = 0; i < numCmds; i++) {
            var cmd = commands[i];
            cmd = JSON.parse(cmd);
            cmd = OAI_commands.MarshallUtils.unmarshallCommand(cmd);
            cmd.execute(document);
        }
    }

    return JSON.stringify(library.writeNode(document), null, 2);
}
