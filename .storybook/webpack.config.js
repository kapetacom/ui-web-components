const Path = require('path');

module.exports = ({config}) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [['react-app', { flow: false, typescript: true }]],
        }
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