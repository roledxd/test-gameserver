const allowedClients = {
    webclient: ["0.1"],
    windows: ["devEdition"],
    ios: [],
    android: []
}

module.exports = function (client, ws) {
    if (typeof client !== 'string') {
        return ws.send(
            JSON.stringify({ action: "log", data: "Unknown client", style: "red" })
        );
    }
    const clientNameV = [client.split("@")[0], client.split("@")[1]];
    const clientObj = allowedClients[clientNameV[0]]
    if (typeof clientObj == 'undefined') {
        return ws.send(
            JSON.stringify({ action: "log", data: "This client is no longer supported! Please, download the official client from our website. This helps to prevent cheating and keep our game friendly.", style: "red" })
        );
    }
    if (typeof clientObj.find(v => v == clientNameV[1]) !== 'string') {
        return ws.send(
            JSON.stringify({ action: "log", data: "Outdated client! Please, download our latest update (" + clientObj[clientObj.length] + ").", style: "red" })
        );
    }
    return "valid"
}