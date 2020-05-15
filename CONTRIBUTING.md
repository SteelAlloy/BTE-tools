<p align="center">
  <img src="https://img.shields.io/github/contributors/oganexon/BTE-tools?style=for-the-badge" alt="Contributors">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/oganexon/BTE-tools?style=for-the-badge">
  <img src="https://img.shields.io/github/last-commit/oganexon/BTE-tools/develop?style=for-the-badge" alt="Last commit">
</p>

# Contributing / Developing

Contributions are welcome. Fork this repository and issue a pull request with your changes.

### Prerequisites
You need to have [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/) installed on your system.

### Setting up Dev
You'll need to clone the repository and install the required packages.

```shell
git clone https://github.com/oganexon/BTE-tools.git
cd ./BTE-tools/
yarn install
```

### Building

```shell
yarn build
```

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).


### Style guide

```shell
yarn lint
```

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This project uses [JavaScript Standard Style](https://cdn.rawgit.com/standard/standard/master/badge.svg). Please respect this convention.

You can install a [plugin](https://standardjs.com/awesome.html#editor-plugins) for your favorite editor if you want.

### Pull request

Please PR to the `develop` branch!
Then follow the [pull request template](.github/PULL_REQUEST_TEMPLATE/pull_request_template.md).

### Deploying

Submit a pull request after running `yarn build` to ensure it runs correctly.
