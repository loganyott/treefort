# api-fort

## Table of Contents

- [Description](#description)
- [Setting up your box](#setting-up-your-box)
- [Unit Testing](#unit-testing)
- [Deploying](#deploying)
- [Logging](#logging)

## Description

The backend api for web-fort and app-fort

## Setting up your box

### Node & NVM

Install `nvm`, this makes sure we're all running the same version of node. See 
https://github.com/creationix/nvm for install steps. After you get `nvm` setup you'll want to make
sure that you are running version of node is specified in the `.nvmrc` file by running `nvm use`.

After you get the proper version of node installed make sure that you install the node modules
associated with this package. We do not use yarn, instead we use npm v5. In the project directory 
run the following command to install the project dependencies and developer dependencies.

```bash
# install serverless globally
npm install serverless -g

# install all modules specified in the package.json
npm i
```

### AWS profile

// TODO: (bdietz) - Need to make this more descriptive

Make sure that you have your aws profile set up

### Code consistency

#### Eslint

We use eslint for semantic linting (no structural code style rules are applied from here). Make sure to integrate your
editor to work with syntax highlighting. See for example the ability to configure hints in JetBrains products:
https://www.jetbrains.com/help/webstorm/eslint.html.

To run the linter for the project run:

```bash
npm run lint
```

If you want the linter to attempt to fix the files then run

```bash
npm run lint:fix
```

#### Prettier

We use prettier to enforce code style that is structural, nuff said. Set up your editor to automatically reformat your
code as you write so you don't have to wait until you commit to find out your code style is wrong.

https://github.com/prettier/prettier#editor-integration

## Unit Testing

#### Jest

We use jest to run pre-commit.

The following commands will run Jest from the command line:

```bash
# Run all tests
npm run test
# Run all tests and get a coverage report
npm run test:coverage
```

## Deploying

### Deploy everything

We're currently using Serverless to manage the deployment of the code. Serverless manages the generation of route
definitions for APIGateway along with the uploading and deployment of the associated Lambda functions. To deploy
both APIGateway definitions and function updates, run

```
npm run deploy:all
```
### Deploying updates to lambda functions

If you simply want to update a lambda function (read no api-gateway changes) you can run commands that are of the form
`deploy:<function-name>` to rebuild and deploy the changes to lambda.

## Logging

Serverless has a built in utility that allows you to tail a function's associated cloudwatch logs. These commands are
available in the `scripts` block of the `package.json` file. The scripts are of the pattern `log:<function-name>`.
As of writing these docs the scripts are the following:

- logs:events
- logs:lines
- logs:performers
- logs:playlists
- logs:schedules

This is by no means an exhaustive list of all the function names. To get an idea of what functions can be deployed
simply inspect the `package.json` scripts block to learn more.
