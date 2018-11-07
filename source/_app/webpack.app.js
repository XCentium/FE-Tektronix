const { getIfUtils } = require("webpack-config-utils");

module.exports = env => {
    const { ifProd, ifDev } = getIfUtils(env);

    const app = {
        //Custom webpack configuration goes here
        externals: {
            jquery: "jQuery"
        },
        performance: {
            maxAssetSize: 500000,
            maxEntrypointSize: 300000,
            hints: "warning"
        }
    };
    return app;
};
