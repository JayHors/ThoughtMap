const path = require('path');

module.exports = {
    entry: {
        login: './client/login.jsx',
        app: './client/app.jsx'
    },

    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader",
                },
            },
        ],
    },

    mode: process.env.NODE_ENV,

    output:{
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    }
}