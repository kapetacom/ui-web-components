const Path = require('path');

module.exports = ({config}) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('awesome-typescript-loader'),
            },
            {
                loader: require.resolve('react-docgen-typescript-loader'),
            }
        ]
    });

    config.module.rules.push({
        test: /\.less$/,
        loaders: ["style-loader", "css-loader", "less-loader"],
        include: Path.resolve(__dirname, "../")
    });

    config.module.rules.push({
        test: /\.ya?ml$/,
        loaders: ['yaml-loader','json-loader'],
        include: Path.resolve(__dirname, "../")
    });

    config.resolve.extensions.push(
        '.ts',
        '.tsx',
        '.less',
        '.yml',
        '.yaml'
    );
    return config;
};