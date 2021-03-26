const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    //production
    entry: {
        index: __dirname + '/edgeware_es6.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimizer: [new TerserPlugin({            
        })],
    }
}