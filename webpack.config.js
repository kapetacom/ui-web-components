const Path = require('path');
const webpack = require("webpack");

module.exports = {
    mode: 'development',
    entry: Path.resolve(__dirname, "./src/index.ts"),
    target: 'web',
    output: {
        path: Path.join(process.cwd(), 'dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'babel-loader',
                options: {
                    sourceMaps: true,
                    presets: [
                        "@babel/env",
                        "@babel/typescript",
                        "@babel/react"
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", {legacy: true} ],
                        ["@babel/plugin-proposal-private-methods", {"loose": true}],
                        ["@babel/plugin-proposal-private-property-in-object", {"loose": true}],
                        ["@babel/plugin-proposal-class-properties", {loose: true}],
                        "@babel/proposal-object-rest-spread"
                    ]
                }
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.ya?ml$/,
                use: ['json-loader', 'yaml-loader']
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.ts',
            '.tsx',
            '.less',
            '.yml',
            '.yaml'
        ]
    },
    externalsType: 'window',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'mobx': 'MobX',
        'mobx-react': 'MobXReact',
        'lodash': '_',
        '@blockware/ui-web-components': 'Blockware.Components',
        '@blockware/ui-web-types': 'Blockware.Types'
    }
};