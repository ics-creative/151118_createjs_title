const webpackShimConfig = {
  shim: {
    'easeljs': {
      exports: 'easeljs'
    },
    'noise'  : {
      exports: 'noise'
    }
  }
};

module.exports = {
  entry    : './src/src/Main.ts',
  output   : {
    filename: './home.js'
  },
  resolve  : {
    extensions: ['.ts', '.js'],
    alias     : {
      easeljs: __dirname + '/node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js',
      noise  : __dirname + '/src/js/perlin.js',
    }
  },
  externals: {
  },
  module   : {
    rules: [
      {
        test: /\.ts?$/,
        use : [
          {loader: 'ts-loader'}
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use : [
          {loader: 'url-loader'}
        ]
      },
      {
        test  : __dirname + '/node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js',
        query : webpackShimConfig,
        loader: 'shim-loader'
      },
      {
        test  : __dirname + '/src/js/perlin.js',
        query : webpackShimConfig,
        loader: 'shim-loader'
      },

    ]
  }
};