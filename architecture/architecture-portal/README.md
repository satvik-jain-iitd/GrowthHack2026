<!-- Declarative environment verification -->
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm ci
```

Next, run the development server:

```bash
ADS_ID='{insert_ads_id}' ADS_PASSWORD='{insert_ads_password}' npm run dev
```

The `ADS_ID` and `ADS_PASSWORD` env variables are only needed on the first run (to fetch vault secrets), so subsequent runs only need `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

If you need to debug the cache handler:

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

For analyzing the server/client bundles:

```bash
ANALYZE=true npm run build
```

## Support & Operations

Build support documentation (AmexWay CR-SDE10 / CR-DPM6 / CR-KM1) lives in [`docs/support/`](docs/support/):

- [Deployment Plan](docs/support/deployment-plan.md)
- [Runbook](docs/support/runbook.md)
- [Configuration References](docs/support/config-references.md)
- [Rollback Plan](docs/support/rollback-plan.md)
- [User Guide](docs/support/user-guide.md)
- [Troubleshooting Guide](docs/support/troubleshooting-guide.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - see what's going on under the hood.

## Running Tests
Run tests:
```bash
npm run test # run all tests.
npm run test <file path> # run specific test.
npm run test:changed # run tests for changed files.
```

Running tests with coverage report:
```bash
npm run test:coverage # run all tests and generate full coverage report.
npm run test:changed:coverage # run tests for changed files and generate coverage report for those files.
```

For a more detailed coverage report open ```coverage/index.html``` in your browser.
[Unit Test Documentation](https://spaces.aexp.com/:w:/r/teams/GR%20Architecture/_layouts/15/Doc.aspx?sourcedoc=%7B9AA34A92-D5B1-4240-AEBF-E3806A951D97%7D&file=Architecture%20Portal%20-%20Unit%20%26%20E2E%20Testing.docx&action=default&mobileredirect=true)  
