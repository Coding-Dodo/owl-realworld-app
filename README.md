# ![RealWorld Example App](logo.png)

[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Coding-Dodo/owl-realworld-app)

> ### OWL (Odoo Web Library) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://owl-realworld.netlify.app)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with OWL (Odoo Web Library) including CRUD operations, authentication, routing, pagination, and more.

This is best use as learning material, some part of the code can still be refactored but over-complexity is not the intent here. This implementation is meant to cover all of OWL features in a complete application example.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

This project is using [OWL 1.2.6](https://github.com/odoo/owl) with Rollup.js as a bundler.

The structure of the project is as follow:

```
├── src
│   ├── App.js
│   ├── components
│   │   ├── ArticleMeta.js
│   │   ├── ArticlePreview.js
│   │   ├── ArticlesList.js
│   │   ├── CommentsSection.js
│   │   ├── Footer.js
│   │   ├── Navbar.js
│   │   ├── NavbarLink.js
│   │   ├── Pagination.js
│   │   └── TagsCloud.js
│   ├── hooks
│   │   ├── useApi.js
│   │   ├── useArticleActions.js
│   │   ├── useArticleLoader.js
│   │   └── useProfileActions.js
│   ├── main.js
│   ├── pages
│   │   ├── ArticlePage.js
│   │   ├── Editor.js
│   │   ├── Home.js
│   │   ├── LogIn.js
│   │   ├── Profile.js
│   │   ├── Register.js
│   │   ├── Settings.js
│   │   └── index.js
│   └── utilities
│       └── formatdate.js
└── tests
    ├── components
    │   └── App.test.js
    └── helpers.js
```

## What is covered here:

- OWL Store to get user state, authentication actions, getters, synchronisation with LocalStorage
- Usage of Axios for API Calls placed inside a custom `useApi`hook
- Routing
  - Dynamic routing with parameters: Article page, Editor, Profile page
  - Routing guards for authenticated routes
- `willStart`, `willUpdateProps` examples for Components that fetch data from API before rendering and after changes.
- triggering custom events from child Components listening to events in parent component.
- hooks `onWillStart`, `onWillUpdateProps` for dynamic component loading data at render.
- custom hooks to share logic of API actions with examples of:
  - `useEnv` to access router
  - `useGetters` to access store actions
  - `useComponent` to trigger event

# Getting started

Install dependencies:

```bash
npm install
```

Dev with livereload:

```bash
npm run dev
```

Production build

```bash
npm run build
```

Run tests

```bash
npm run test
```

# Contributors

<a href="https://github.com/Coding-Dodo/owl-realworld-app/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=Coding-Dodo/owl-realworld-app" />
</a>

Made with [contributors-img](https://contributors-img.web.app).

[![Coding Dodo](https://res.cloudinary.com/phildl-cloudinary/image/upload/w_300/v1617638212/codingdodo/Coding_Dodo_rplksw.png)](https://codingdodo.com)
