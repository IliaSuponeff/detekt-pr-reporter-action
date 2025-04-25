# Detekt Markdown Report Action

A GitHub action designed to publish Detect Markdown reports as comments on pull requests.

## Description

This action allows you to automatically publish Detect code analysis reports in your pull requests. Detect code analysis helps to maintain the high quality of the Kotlin codebase. Using this action, you can easily view the issues found by Detect directly in the pull request, making it easier to discuss and fix them.

## Using

To use this action, create a workflow file in the `.github/workflows` directory. Below is an example of how to set up a workflow to run Detect and publish a report:

```yaml
name: Detekt Report
on: [pull_request]

jobs:
  detekt:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v3
      - name: Run Detekt
        run: ./gradlew detekt
      - name: Publish Detekt Report
        uses: IliaSuponeff/detekt-pr-reporter-action@v1.0.4
        with:
          report_path: <path-to-detekt-markdown-md>
          token: ${{ secrets.GITHUB_TOKEN }}
```

## License
Distributed under the [MIT License](https://choosealicense.com/licenses/mit/). See [`LICENSE`](LICENSE) for more
information.