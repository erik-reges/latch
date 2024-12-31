/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as SigninImport } from './routes/signin'
import { Route as AppLayoutImport } from './routes/_app-layout'
import { Route as AppLayoutIndexImport } from './routes/_app-layout/index'
import { Route as AppLayoutVehiclesImport } from './routes/_app-layout/vehicles'
import { Route as AppLayoutAccountImport } from './routes/_app-layout/account'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const SigninRoute = SigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => rootRoute,
} as any)

const AppLayoutRoute = AppLayoutImport.update({
  id: '/_app-layout',
  getParentRoute: () => rootRoute,
} as any)

const AppLayoutIndexRoute = AppLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppLayoutRoute,
} as any)

const AppLayoutVehiclesRoute = AppLayoutVehiclesImport.update({
  id: '/vehicles',
  path: '/vehicles',
  getParentRoute: () => AppLayoutRoute,
} as any)

const AppLayoutAccountRoute = AppLayoutAccountImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => AppLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app-layout': {
      id: '/_app-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppLayoutImport
      parentRoute: typeof rootRoute
    }
    '/signin': {
      id: '/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof SigninImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/_app-layout/account': {
      id: '/_app-layout/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AppLayoutAccountImport
      parentRoute: typeof AppLayoutImport
    }
    '/_app-layout/vehicles': {
      id: '/_app-layout/vehicles'
      path: '/vehicles'
      fullPath: '/vehicles'
      preLoaderRoute: typeof AppLayoutVehiclesImport
      parentRoute: typeof AppLayoutImport
    }
    '/_app-layout/': {
      id: '/_app-layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppLayoutIndexImport
      parentRoute: typeof AppLayoutImport
    }
  }
}

// Create and export the route tree

interface AppLayoutRouteChildren {
  AppLayoutAccountRoute: typeof AppLayoutAccountRoute
  AppLayoutVehiclesRoute: typeof AppLayoutVehiclesRoute
  AppLayoutIndexRoute: typeof AppLayoutIndexRoute
}

const AppLayoutRouteChildren: AppLayoutRouteChildren = {
  AppLayoutAccountRoute: AppLayoutAccountRoute,
  AppLayoutVehiclesRoute: AppLayoutVehiclesRoute,
  AppLayoutIndexRoute: AppLayoutIndexRoute,
}

const AppLayoutRouteWithChildren = AppLayoutRoute._addFileChildren(
  AppLayoutRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AppLayoutRouteWithChildren
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/account': typeof AppLayoutAccountRoute
  '/vehicles': typeof AppLayoutVehiclesRoute
  '/': typeof AppLayoutIndexRoute
}

export interface FileRoutesByTo {
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/account': typeof AppLayoutAccountRoute
  '/vehicles': typeof AppLayoutVehiclesRoute
  '/': typeof AppLayoutIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_app-layout': typeof AppLayoutRouteWithChildren
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/_app-layout/account': typeof AppLayoutAccountRoute
  '/_app-layout/vehicles': typeof AppLayoutVehiclesRoute
  '/_app-layout/': typeof AppLayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/signin' | '/signup' | '/account' | '/vehicles' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '/signin' | '/signup' | '/account' | '/vehicles' | '/'
  id:
    | '__root__'
    | '/_app-layout'
    | '/signin'
    | '/signup'
    | '/_app-layout/account'
    | '/_app-layout/vehicles'
    | '/_app-layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AppLayoutRoute: typeof AppLayoutRouteWithChildren
  SigninRoute: typeof SigninRoute
  SignupRoute: typeof SignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  AppLayoutRoute: AppLayoutRouteWithChildren,
  SigninRoute: SigninRoute,
  SignupRoute: SignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app-layout",
        "/signin",
        "/signup"
      ]
    },
    "/_app-layout": {
      "filePath": "_app-layout.tsx",
      "children": [
        "/_app-layout/account",
        "/_app-layout/vehicles",
        "/_app-layout/"
      ]
    },
    "/signin": {
      "filePath": "signin.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/_app-layout/account": {
      "filePath": "_app-layout/account.tsx",
      "parent": "/_app-layout"
    },
    "/_app-layout/vehicles": {
      "filePath": "_app-layout/vehicles.tsx",
      "parent": "/_app-layout"
    },
    "/_app-layout/": {
      "filePath": "_app-layout/index.tsx",
      "parent": "/_app-layout"
    }
  }
}
ROUTE_MANIFEST_END */
