const resetVersion = (version) => {
    setTimeout(async () => {
        const pluginStore = strapi.store({
            environment: '',
            type: 'plugin',
            name: 'migrations',
        });
        await pluginStore.set({ key: 'version', value: version });
    }, 100);
}

module.exports = async () => {
    resetVersion('90')
}
