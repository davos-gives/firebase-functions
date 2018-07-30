This repository is the temporary home to some functions we're running in Firebase to track the history of gifts on the donor profiles. These are what allow us to show gifts made, track what changes have been made to an ongoing gift, and show cancelled ongoing gifts even after the original object has been removed.

## Table of Contents

- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Config](#config)
- [Available Scripts](#available-scripts)
  - [firebase serve](#firebase-serve)
  - [firebase serve --only-functions](#firebase-serve---only-functions)


## Getting started

1. Install [Firebase tools](https://github.com/firebase/firebase-tools) using yarn or NPM.
2. Clone the project from the repository on Github.
3. `cd` into project and run `yarn add` to bring in required packages.
4. Modify current functions or add new functions to `index.js` file.

## Folder Structure

```
functions
  /etc
  /node_modules
  index.js
```

## Available Scripts

In the project directory, you can run:

### `firebase serve`

Creates a local application for you to log into firebase, and then pushes the changes that you've made up to firebase. Only needs to be run the first time you try to push changes up.

### `firebase serve --only-functions`

pushes on the changed functions up to the firebase account.
