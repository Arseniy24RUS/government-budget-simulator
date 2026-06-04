# Government Budget Simulator · Regional Governance and Public Policy Game

[English](#english) · [Русский](#русский)

[![Live demo](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://arseniy24rus.github.io/government-budget-simulator/)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## English

### Overview

`government-budget-simulator` is an educational browser-based simulator of regional public administration. The player acts as a regional governor and makes policy decisions over a 20-year period while balancing budget constraints, socio-economic indicators, public support and long-term regional development goals.

The simulator is designed for courses in public administration, regional policy, strategic planning, budget process and policy analysis. It demonstrates that public management is not a sequence of isolated decisions but a system of trade-offs between fiscal capacity, social expectations, demographic dynamics, infrastructure, investment and political legitimacy.

### Live simulator

GitHub Pages: <https://arseniy24rus.github.io/government-budget-simulator/>

### Gameplay model

The simulation consists of 20 annual turns. At the beginning, the player selects one of six starting scenarios: baseline development, demographic decline, environmental crisis, population ageing, digital transformation or economic crisis. During the game, the player encounters annual events, long-term regional situations and decision windows across several policy periods.

The model includes 41 unique annual events, including rare events, and 3 long-term situations: environmental protests, social tension and shortage of qualified personnel/youth outmigration. The player can choose from 89 management decisions distributed across four five-year periods. The simulator limits the number of simultaneously active measures, forcing prioritization.

### Policy and budget blocks

The regional budget is structured around major areas of public expenditure and development policy:

```text
Social policy
Healthcare
Education and culture
Infrastructure and urban environment
Economy and digitalization
Investment fund
Tax burden and budget parameters
```

The model also tracks public support among several social groups: families with children, older residents, business and SMEs, youth, public-sector employees/civil servants, and environmental or urban activists. Final performance is assessed through a combined KPI logic rather than a single indicator.

### Technology stack

The simulator is implemented as a static browser application in HTML, CSS and JavaScript. Charts are rendered with Chart.js. Firebase Realtime Database may be used for the leaderboard. The project can be published through GitHub Pages or any static hosting provider.

### Repository structure

```text
index.html   Main simulator application
logo.png     Project logo
README.md    Documentation
```

### Local launch

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>. The simulator can also be opened as a static page, but a local HTTP server is preferable for consistent browser behavior.

### Customization

The simulator can be adapted for different courses and policy contexts by changing KPI parameters, public support weights, scenario descriptions, annual events, long-term situations, management measures and decision costs/effects. For classroom use, instructors can create discussion tasks around alternative strategies and compare final results across student groups.

### Interpretation and limitations

This simulator is an educational model. It simplifies real public finance, political economy and administrative processes in order to make policy trade-offs visible. It should not be interpreted as a formal model of a real region or as a predictive tool for budget outcomes.

### Citation

If you use the simulator in teaching, research or public presentations, please cite:

> Sitkovskiy, A. M. (2026). Government Budget Simulator: regional governance and public policy game. GitHub. https://github.com/Arseniy24RUS/government-budget-simulator

### License

Unless otherwise stated, source code is released under the MIT License. Educational content, text, scenarios and documentation are released under Creative Commons Attribution 4.0 International (CC BY 4.0). Third-party libraries and services are governed by their own licenses and terms.

---

## Русский

### Обзор

`government-budget-simulator` — учебный браузерный симулятор регионального государственного управления. Игрок выступает в роли губернатора и принимает управленческие решения на протяжении 20-летнего периода, одновременно удерживая бюджетные ограничения, социально-экономические показатели, общественную поддержку и долгосрочные цели развития региона.

Симулятор предназначен для курсов по государственному и муниципальному управлению, региональной политике, стратегическому планированию, бюджетному процессу и анализу публичной политики. Он показывает, что государственное управление — это не набор изолированных решений, а система компромиссов между финансовыми возможностями, социальными ожиданиями, демографической динамикой, инфраструктурой, инвестициями и политической легитимностью.

### Публичный симулятор

GitHub Pages: <https://arseniy24rus.github.io/government-budget-simulator/>

### Игровая модель

Симуляция состоит из 20 годовых ходов. В начале игрок выбирает один из шести стартовых сценариев: базовое развитие, демографическое сжатие, экологический кризис, старение населения, цифровая трансформация или экономический кризис. В ходе игры он сталкивается с ежегодными событиями, долгосрочными региональными ситуациями и окнами принятия решений в рамках нескольких управленческих периодов.

Модель включает 41 уникальное ежегодное событие, в том числе редкие события, и 3 долгосрочные ситуации: экологические протесты, социальную напряжённость и кадровый голод/отток молодёжи. Игрок может выбирать из 89 управленческих решений, распределённых по четырём пятилетним периодам. Ограничение на число одновременно активных мер вынуждает расставлять приоритеты.

### Бюджетные и политические блоки

Региональный бюджет структурирован вокруг основных направлений публичных расходов и политики развития:

```text
Социальная политика
Здравоохранение
Образование и культура
Инфраструктура и городская среда
Экономика и цифровизация
Инвестиционный фонд
Налоговая нагрузка и бюджетные параметры
```

Модель также отслеживает общественную поддержку среди нескольких социальных групп: семьи с детьми, пожилые жители, бизнес и МСП, молодёжь, бюджетники/госслужащие, экологические и городские активисты. Итоговая оценка строится на комбинированной KPI-логике, а не на одном показателе.

### Технологический стек

Симулятор реализован как статическое браузерное приложение на HTML, CSS и JavaScript. Графики строятся с помощью Chart.js. Для таблицы лидеров может использоваться Firebase Realtime Database. Проект можно публиковать через GitHub Pages или любой статический хостинг.

### Структура репозитория

```text
index.html   Основное приложение симулятора
logo.png     Логотип проекта
README.md    Документация
```

### Локальный запуск

```bash
python -m http.server 8000
```

Затем откройте <http://localhost:8000/>. Симулятор может открываться и как статическая страница, но локальный HTTP-сервер предпочтителен для стабильного поведения браузера.

### Адаптация

Симулятор можно адаптировать для разных учебных курсов и политических контекстов, изменяя параметры KPI, веса общественной поддержки, описания сценариев, ежегодные события, долгосрочные ситуации, управленческие меры и стоимость/эффекты решений. В учебной аудитории преподаватель может строить задания вокруг альтернативных стратегий и сравнивать итоговые результаты студенческих групп.

### Интерпретация и ограничения

Это образовательная модель. Она упрощает реальные процессы публичных финансов, политической экономики и административного управления, чтобы сделать видимыми управленческие компромиссы. Её не следует трактовать как формальную модель реального региона или как прогноз бюджетных результатов.

### Как цитировать

При использовании симулятора в преподавании, исследовании или публичных презентациях, пожалуйста, цитируйте:

> Ситковский А. М. Government Budget Simulator: regional governance and public policy game. GitHub, 2026. https://github.com/Arseniy24RUS/government-budget-simulator

### Лицензия

Если явно не указано иное, исходный код распространяется по лицензии MIT. Учебное содержание, тексты, сценарии и документация распространяются по лицензии Creative Commons Attribution 4.0 International (CC BY 4.0). Сторонние библиотеки и сервисы регулируются собственными лицензиями и условиями использования.
