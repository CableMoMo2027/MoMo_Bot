global.client.on("raw", (data) => {
    client.manager.updateVoiceState(data);
});