# Contributing

Thank you for improving `government-budget-simulator`. This project is an educational simulator, so contributions should keep the model transparent, discussable, and easy to run locally.

## What We Welcome

- Bug fixes that preserve the classroom workflow.
- Bilingual copy improvements for English and Russian UI/docs.
- Methodology questions, assumptions, and clearer interpretation notes.
- Scenario, event, KPI, or policy-measure proposals with a short rationale.
- Accessibility, mobile layout, and i18n test improvements.

## Before You Start

1. Check `README.md`, `docs/methodology.md`, `ROADMAP.md`, and `docs/good-first-issues.md`.
2. Open an issue for larger changes, methodology changes, or new scenario logic.
3. Keep pull requests focused. Avoid unrelated rewrites.

## Local Setup

```bash
npm install
npm test
npm run test:i18n
```

For manual testing:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Methodology Contributions

When changing model logic, include:

- The affected KPI, group, budget block, event, scenario, or policy measure.
- The teaching reason for the change.
- Expected behavior before and after the change.
- Any sensitivity or balance risk.
- Updated English and Russian docs/copy where applicable.

## Bilingual Standard

User-facing documentation should be useful in both English and Russian when the topic affects learners or instructors. English can come first, followed by Russian. Keep translations equivalent in meaning rather than word-for-word if clarity requires adaptation.

## Pull Request Checklist

- The change is scoped to this repository.
- README changes are minimal unless the PR is documentation-only.
- Methodology changes are reflected in `docs/methodology.md`.
- Licensing implications are checked against `LICENSE`, `LICENSE-DOCS-AND-DATA.md`, and `THIRD_PARTY_NOTICES.md`.
- Local tests are run and results are reported.

## Русский

Спасибо за вклад в `government-budget-simulator`. Это учебный симулятор, поэтому изменения должны сохранять прозрачность модели, пригодность для обсуждения и простой локальный запуск.

Приветствуются исправления ошибок, улучшения английских и русских текстов, методологические уточнения, предложения по сценариям/событиям/KPI/мерам, а также улучшения доступности, мобильной верстки и i18n-тестов.

Перед крупным изменением откройте issue. В pull request укажите, что изменилось, почему это важно для учебной модели, какие проверки выполнены и нужно ли обновить методологию или лицензирование.
