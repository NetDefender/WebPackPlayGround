## folders
create /src and /public folders

## npm
> npm init -y

> npm install --save-dev webpack 
webpack-dev-server webpack-cli

## package.json
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --mode development",
    "build": "webpack --config=webpack.config.js --mode production"
  },
```

## webpack.config.js
```javascript
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path:  path.resolve(__dirname, './public'),
        filename: 'bundle.js'
    },
    devServer: {
        static: path.resolve(__dirname, './public'),
    }
}
```

## run
> npm run start

## deploy
> npm run deploy
