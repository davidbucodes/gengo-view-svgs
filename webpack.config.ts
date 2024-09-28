import WebpackCopyPlugin from "copy-webpack-plugin";
import * as path from "path";
import { Configuration } from "webpack";

import { bundle } from "./bundle";

console.log("Start bundling svg by kanji file...");
const outputFiles = bundle();
console.log("Completed bundling svg by kanji file");

const config: Configuration = {
  mode: "development",
  target: "web",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        include: /src/,
        exclude: [/node_modules/],
        options: {
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new WebpackCopyPlugin({
      patterns: [
        { from: "./package.json", to: "./package.json" },
        ...outputFiles.map(({ outputFilePath, outputFileName }) => ({
          from: outputFilePath,
          to: outputFileName,
        })),
      ],
    }),
  ],
};

export default config;
