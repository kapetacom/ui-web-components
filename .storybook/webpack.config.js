
module.exports = ({config}) => {

    config.module.rules.push(
        {
            test: /\.pegjs$/,
            use: 'pegjs-loader'
        },
        {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        },
        {
            test: /\.ya?ml$/,
            use: ['json-loader', 'yaml-loader']
        }
    );

    return config;
};