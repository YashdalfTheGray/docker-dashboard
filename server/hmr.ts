import webpack from 'webpack';
import express from 'express';

type WebpackConfigFunction = (
  env: any,
  args: webpack.Configuration
) => webpack.Configuration;

type WebpackModeType = 'none' | 'development' | 'production';

type WebpackConfigAndCompiler = {
  config: webpack.Configuration;
  compiler: webpack.Compiler;
};

export default function hotModuleReloadingSetup(
  app: express.Application,
  configFilePath: string = '../../webpack.config.js'
): WebpackConfigAndCompiler {
  const mode: WebpackModeType = process.env.NODE_ENV as WebpackModeType;
  const config = getWebpackConfig(configFilePath, null, { mode });
  const compiler = webpack(config);

  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: config.output!.publicPath,
    })
  );
  app.use(require('webpack-hot-middleware')(compiler));

  return { config, compiler };
}

function getWebpackConfig(path: string, ...args: any[]): webpack.Configuration {
  const configOrFunction:
    | WebpackConfigFunction
    | webpack.Configuration = require(path);

  if (typeof configOrFunction === 'function') {
    return configOrFunction.call(null, ...args);
  }
  return configOrFunction;
}
