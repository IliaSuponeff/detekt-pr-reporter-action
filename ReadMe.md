# Detekt Markdown Report Action

Действие GitHub, предназначенное для публикации отчетов Detekt Markdown в качестве комментариев к запросам на вытягивание.

## Описание

Это действие позволяет автоматически публиковать отчеты анализа кода Detekt в ваших запросах на вытягивание. Анализ кода Detekt помогает поддерживать высокое качество кодовой базы Kotlin. Используя это действие, вы можете легко просматривать проблемы, найденные Detekt, непосредственно в запросе на вытягивание, что упрощает их обсуждение и устранение.

## Использование

Чтобы использовать это действие, создайте файл рабочего процесса в каталоге `.github/workflows`. Ниже приведен пример того, как настроить рабочий процесс для запуска Detekt и публикации отчета:

```yaml
name: Detekt Report

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  detekt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run detekt
        run: ./gradlew detekt
      - name: Publish Detekt Report
        uses: IliaSuponeff/detekt-pr-reporter-action@v1
        with:
          report_path: build/reports/detekt/detekt.md
          github_token: ${{ secrets.GITHUB_TOKEN }}
