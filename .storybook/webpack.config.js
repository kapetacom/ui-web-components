
module.exports = ({config}) => {

    config.module.rules = config.module.rules.concat([
        {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        },
        {
            test: /\.ya?ml$/,
            use: ['json-loader', 'yaml-loader']
        }
    ]);

    return config;
};