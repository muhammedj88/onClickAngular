# onClick Angular Frontend

Angular frontend for the onClick project. The source includes a dashboard and project graph components, built on the CoreUI Angular admin template.

## Technology

- Angular 6 and TypeScript.
- CoreUI and Bootstrap-based interface components.
- D3 and Chart.js dependencies for visualization.
- Angular CLI scripts for development, builds, and tests.

Exact versions are recorded in `package.json` and `package-lock.json`. This is a historical codebase; its dependencies need review before reuse.

## Code structure

- `src/app/views/dashboard/`: dashboard and project graph components.
- `src/app/containers/`: application layout.
- `src/app/app.routing.ts`: application routes.
- `src/app/_nav.ts`: navigation configuration.

## Related backend

[onClick Java backend](https://github.com/muhammedj88/onClickBackEnd-r)

## Development scripts

The package defines `npm start`, `npm run build`, `npm test`, and `npm run e2e`. A compatible environment and the backend configuration are required. Installation, builds, tests, and live integration have not been verified in the documentation refresh of October 2026.

## Attribution

The interface uses the [CoreUI Angular template](https://coreui.io/angular/). Existing license and attribution files are retained. Template components should be distinguished from application-specific work when describing this project.
