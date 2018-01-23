
function console_info(message) {
    var Logger = Java.type('io.apicurio.hub.core.js.OaiCommandExecutor');
    Logger.debug(message);
}
function console_debug(message) {
    var Logger = Java.type('io.apicurio.hub.core.js.OaiCommandExecutor');
    Logger.debug(message);
}
function console_trace(message) {
    var Logger = Java.type('io.apicurio.hub.core.js.OaiCommandExecutor');
    Logger.trace(message);
}
function console_error(error) {
    var Logger = Java.type('io.apicurio.hub.core.js.OaiCommandExecutor');
    Logger.error(JSON.stringify(error));
}

var console = {
        info: console_info,
        debug: console_debug,
        trace: console_trace,
        error: console_error
};
