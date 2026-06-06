# Methodology

## English

### Research and Teaching Purpose

`government-budget-simulator` is an educational public-administration simulator. It helps students, instructors, and researchers discuss regional governance as a system of constrained choices rather than as a sequence of isolated policy actions. The model emphasizes trade-offs among fiscal capacity, long-term development, social policy, demographic dynamics, public support, investment, and administrative legitimacy.

The simulator should be read as a structured classroom model, not as a calibrated econometric model of a real region. Its value is in making assumptions visible, letting learners test strategies, and supporting comparative discussion across repeated runs.

### Unit of Analysis and Time Horizon

The unit of analysis is a stylized regional government. The player acts as a regional governor and manages a 20-year horizon, represented as annual turns. The horizon is divided into four five-year policy phases. Each phase refreshes the policy menu and raises development expectations, which makes the model suitable for courses on strategic planning, program budgeting, and public policy evaluation.

Each run has three linked layers:

1. A starting scenario that shifts baseline conditions.
2. Annual decisions over budget allocation, tax burden, investment, management measures, and event response.
3. Feedback through KPI indicators, social-group support, long-term situations, final score, and leaderboard output.

### Scenario Design

The simulator contains six starting scenarios:

| Scenario | Research role in the model |
| --- | --- |
| Baseline development | A reference path with balanced initial conditions. |
| Demographic decline | Stress-tests fertility, population retention, and household support. |
| Environmental crisis | Makes environmental quality, trust, life expectancy, and activist support central. |
| Digital transformation | Starts with stronger digital and investment capacity but exposes inequality risks. |
| Population ageing | Highlights healthcare, fertility, income pressure, and older-resident support. |
| Economic crisis | Tests resilience under lower income, lower investment, higher poverty, and lower trust. |

The scenario is selected randomly in the current implementation. This is useful for classroom work because students begin from different but comparable constraints. For research-style exercises, instructors can control randomness by editing scenario/event selection or by recording the selected scenario and event sequence for each run.

The scenario layer is not intended to describe a named real region. Each scenario is a stylized stress profile: a small set of baseline shifts applied to the same governance model. This keeps comparisons intelligible while avoiding a false claim of empirical calibration.

### Budget and Constraint Model

The annual budget model is intentionally simple but strict enough to create meaningful scarcity. The baseline regional revenue is 620 billion RUB and is scaled by the current real-income index. The selected tax burden then applies a revenue factor:

| Tax burden | Revenue factor | KPI/public implications |
| --- | ---: | --- |
| Low | 0.88 | Lower revenue, higher trust and income, lower poverty. |
| Normal | 1.00 | Neutral reference setting. |
| High | 1.12 | Higher revenue, lower trust and income, higher poverty. |

The player allocates the annual budget across six blocks:

| Block | Role |
| --- | --- |
| Social policy | Poverty, families, trust, and demographic support. |
| Healthcare | Life expectancy, sport/health-related satisfaction, and population stability. |
| Education and culture | Human capital, youth retention, digital maturity, and SME productivity. |
| Infrastructure and urban environment | Living conditions, environment, income, investment, and population retention. |
| Economy and digitalization | Income, investment, SME income, digital maturity, and economic growth. |
| Investment fund | Deferred budget growth rather than current program spending. |

Budget shares must sum to 100 percent. The investment share is clamped to a practical upper bound of 60 percent, and the investment horizon is clamped to 2-5 years. Expected investment return is calculated as:

```text
return = investment_amount * (1 + 0.18 * horizon_years)
```

This structure makes investment attractive but costly. Money placed into the investment fund is removed from current program capacity until it matures. A longer horizon creates a higher expected return, but it increases short-term policy pressure.

Management measures have annual costs in billion RUB. The total cost of selected measures in each policy block cannot exceed that block's available budget. The simulator also limits the number of simultaneously selected measures to 12. These constraints prevent a "select everything" strategy and make prioritization visible.

### KPI Indicators

The model tracks twelve KPI indicators:

| Indicator | Base | Target | Weight | Direction |
| --- | ---: | ---: | ---: | --- |
| Trust in government | 50 | 70 | 1.2 | Higher is better |
| Population index | 100 | 105 | 1.1 | Higher is better |
| Total fertility rate | 1.3 | 1.6 | 1.1 | Higher is better |
| Life expectancy | 74 | 78 | 1.1 | Higher is better |
| Poverty rate | 15 | 7 | 1.1 | Lower is better |
| Satisfaction with sport and physical culture | 40 | 60 | 0.8 | Higher is better |
| Education and human-capital level | 65 | 80 | 1.0 | Higher is better |
| Real household income index | 100 | 120 | 1.1 | Higher is better |
| Investment growth index | 100 | 120 | 0.9 | Higher is better |
| SME income per worker index | 100 | 120 | 0.9 | Higher is better |
| Environmental quality | 55 | 80 | 0.9 | Higher is better |
| Digital maturity of public administration | 40 | 70 | 1.0 | Higher is better |

Each KPI has minimum and maximum bounds. After every annual turn, KPI changes are produced by five sources:

1. Natural drift toward the target.
2. Budget-share influence relative to a 20 percent reference share for each current-spending block.
3. Effects and side effects of selected management measures.
4. Tax and annual event effects.
5. Active long-term situation penalties.

The model damps annual change before applying it to the KPI state. This is important pedagogically: public policy effects are visible, but they are not instantaneous transformations.

### KPI Score Logic

The overall KPI score is a weighted average of normalized indicator achievement. For indicators where higher values are better, achievement is normalized from the configured minimum to the target. For poverty, the direction is inverted: lower values are better, and achievement is normalized from the configured maximum to the target.

The model allows limited overachievement during normalization, then clamps the final KPI score to a 0-100 scale. This keeps exceptional outcomes visible without letting one indicator dominate the whole run.

The final grade is based on the KPI score:

| KPI score | Grade |
| ---: | --- |
| 85 or higher | A |
| 70-84.9 | B |
| 55-69.9 | C |
| Below 55 | D |

The grade is not the full interpretation. Public support is shown separately and is used in the final qualitative conclusion.

### Public Support and Political Feedback

Public support is not a cosmetic indicator. It represents the political-legitimacy layer of the model and is computed from social-group satisfaction.

The simulator tracks six groups:

| Group | Electorate weight | Key concerns |
| --- | ---: | --- |
| Families with children | 0.25 | Fertility, poverty, trust, income, environment. |
| Older residents | 0.20 | Life expectancy, poverty, trust, sport/health, environment. |
| Business and SMEs | 0.20 | Income, SME income, investment, digital maturity. |
| Youth | 0.15 | Education, digital maturity, sport, income, trust. |
| Public-sector employees and civil servants | 0.10 | Trust, income, education, digital maturity. |
| Environmental and urban activists | 0.10 | Environment, sport, trust, investment, digital maturity. |

For each group, the model calculates a weighted average of relevant KPI achievements on a 0-100 scale. The public support index is then the electorate-weighted average across groups.

Political feedback appears in two ways:

1. Long-term situations can be triggered by combinations of weak KPI values and low group satisfaction.
2. The final interpretation distinguishes high KPI/low support, low KPI/high support, high KPI/high support, and mixed outcomes.

Public support does not directly create an automatic game over or mechanically change budget revenue. That choice is intentional: the simulator treats legitimacy as a parallel accountability measure and as a trigger for specific crisis dynamics rather than as a single universal multiplier.

### Long-Term Situations

Long-term situations represent persistent governance problems. They are triggered when KPI and group-support conditions cross risk thresholds, and they remain active until the underlying causes are repaired.

| Situation | Trigger logic | Annual pressure while active |
| --- | --- | --- |
| Environmental protests | Environmental quality below threshold and activist satisfaction too low. | Reduces trust and investment. |
| Social tension | Poverty is high and families/youth support is low. | Reduces trust, population, and income. |
| Workforce shortage and youth outmigration | Education/human capital is weak and youth support is low. | Reduces population, SME income, and investment. |

This layer is central to the model's public-administration logic. It shows that a policy problem may continue to damage the region even after a single annual event has passed, and that resolution requires improving both formal indicators and affected-group satisfaction.

### Annual Decision Loop

Each annual turn follows a reproducible sequence:

1. Display the current year, scenario, KPI score, public support, metrics, and active situations.
2. Present an annual event and require one response option.
3. Collect tax burden, budget allocation, investment share, and investment horizon.
4. Collect selected management measures for the current five-year phase.
5. Validate that budget shares total 100 percent.
6. Validate that selected measures fit within each block's available budget and the 12-measure cap.
7. Apply matured investment returns and calculate spendable revenue.
8. Apply budget, policy, tax, event, and long-term situation effects to KPI indicators.
9. Recalculate group satisfaction and public support.
10. Activate or resolve long-term situations.
11. Advance the year, update charts, and generate the next event.
12. At the end of the 20-year horizon, calculate the final KPI grade and public-support interpretation.

The loop is deterministic given the same initial scenario, event sequence, budget inputs, and policy choices. Randomness is used for scenario/event selection, so reproducible classroom experiments should control or log those choices.

### Assumptions

The model makes several explicit simplifying assumptions:

- A regional government can be represented through a single annual budget and five current-spending policy blocks plus an investment fund.
- KPI effects are additive within a turn and then damped to avoid unrealistically abrupt movement.
- Public support is derived from material and governance outcomes rather than from media systems, party competition, elite bargaining, or coercive capacity.
- Budget pressure is represented through spending shares, policy costs, event costs, tax burden, and deferred investment, not through debt markets, intergovernmental transfers, procurement schedules, or legal mandates.
- Each management measure has stylized average effects rather than a distribution of implementation outcomes.
- The model uses a stable set of social groups and fixed electorate weights for comparability.

These assumptions make the simulator legible for teaching, but they also define its limits.

### Interpretation Limits

Do not interpret a run as a forecast, a recommendation for a real administration, or an empirical ranking of policy instruments. The simulator does not estimate causal effects from administrative data, does not model macroeconomic shocks beyond its scenario/event system, and does not include legal, procurement, lobbying, corruption, electoral, or geopolitical constraints in a full real-world form.

The best interpretation is comparative and reflective:

- Which strategy did the player choose under scarcity?
- Which groups benefited or lost confidence?
- Did short-term stability undermine long-term resilience?
- Did investment capacity improve without weakening current services?
- Did the final KPI score and public support tell the same story or different stories?

For research use, treat the simulator as a decision-support artifact, teaching intervention, or structured elicitation tool. Any empirical claim about students, regions, or policy effectiveness requires a separate research design, consent/data policy, and statistical analysis.

### Sensitivity and Adaptation

The simulator is intentionally adaptable. For another region or course, review the following parameters:

| Parameter family | What to adapt | Sensitivity question |
| --- | --- | --- |
| KPI configuration | Base, target, min/max, weight, inverted direction. | Which indicators define success in this course or context? |
| Scenario modifiers | Initial shocks by scenario. | Are starting constraints plausible and balanced? |
| Budget categories | Spending blocks and default shares. | Do students see the real policy trade-offs you want to teach? |
| Budget influence coefficients | How spending shares move KPIs. | Are marginal spending effects too strong, too weak, or one-sided? |
| Management measures | Names, costs, effects, side effects, phase placement. | Are policy tools current, locally relevant, and comparable in cost? |
| Annual events | Event pool, rare events, response options, budget/KPI effects. | Do events test crisis management and administrative judgment? |
| Social groups | Groups, weights, KPI concern maps. | Whose support matters in the learning scenario? |
| Long-term situations | Trigger/resolve thresholds and annual penalties. | Which persistent risks should students learn to diagnose? |
| Final interpretation | Grade thresholds and qualitative comments. | What does success mean: KPI delivery, legitimacy, or balance? |

Recommended sensitivity workflow:

1. Change one parameter family at a time.
2. Run at least one baseline and one stressed scenario before changing another family.
3. Record the same strategy under old and new parameters.
4. Compare KPI score, public support, active situations, and budget pressure.
5. Document all changes in the methodology notes or course handout.

### Reproducible Local Commands

Install dependencies:

```bash
npm install
```

Run all local tests:

```bash
npm test
```

Run only the i18n/browser QA test:

```bash
npm run test:i18n
```

Launch the simulator locally:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

For a simple repository link/image existence check, run:

```bash
node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); const refs=[...md.matchAll(/!\\[[^\\]]*\\]\\(([^)]+)\\)|\\[[^\\]]+\\]\\(([^)]+)\\)/g)].map(m=>m[1]||m[2]).filter(x=>x&&!/^https?:|^mailto:|^#/.test(x)); let bad=[]; for (const r of refs){const p=r.split('#')[0]; if(p && !fs.existsSync(p)) bad.push(r);} if(bad.length){console.error('Missing local refs:\\n'+bad.join('\\n')); process.exit(1);} console.log('README local refs OK');"
```

## Русский

### Исследовательская и учебная цель

`government-budget-simulator` - учебный симулятор публичного управления. Он помогает студентам, преподавателям и исследователям обсуждать региональное управление как систему ограниченных решений, а не как набор изолированных действий. Модель показывает компромиссы между бюджетной емкостью, долгосрочным развитием, социальной политикой, демографией, общественной поддержкой, инвестициями и административной легитимностью.

Симулятор следует рассматривать как структурированную учебную модель, а не как откалиброванную эконометрическую модель реального региона. Его ценность состоит в том, что он делает предпосылки явными, позволяет проверять стратегии и поддерживает сравнительное обсуждение нескольких прохождений.

### Единица анализа и горизонт моделирования

Единица анализа - стилизованное региональное правительство. Игрок действует в роли губернатора и управляет 20-летним горизонтом, представленным годовыми ходами. Горизонт разделен на четыре пятилетних управленческих периода. В каждом периоде обновляется набор мер и повышаются ожидания по развитию, поэтому модель подходит для курсов по стратегическому планированию, программному бюджету и оценке публичной политики.

Каждое прохождение включает три связанных слоя:

1. Стартовый сценарий, который меняет исходные условия.
2. Ежегодные решения по бюджету, налоговой нагрузке, инвестициям, управленческим мерам и реакции на событие.
3. Обратную связь через KPI, поддержку социальных групп, долгосрочные ситуации, итоговую оценку и таблицу результатов.

### Дизайн сценариев

В симуляторе есть шесть стартовых сценариев:

| Сценарий | Роль в модели |
| --- | --- |
| Базовое развитие | Опорная траектория со сбалансированными исходными условиями. |
| Демографический спад | Проверяет рождаемость, удержание населения и поддержку домохозяйств. |
| Экологический кризис | Делает центральными качество среды, доверие, продолжительность жизни и поддержку активистов. |
| Цифровая трансформация | Дает более сильную цифровую и инвестиционную стартовую позицию, но показывает риски неравенства. |
| Старение населения | Подчеркивает здравоохранение, рождаемость, давление на доходы и поддержку пожилых жителей. |
| Экономический кризис | Проверяет устойчивость при снижении доходов, инвестиций, росте бедности и падении доверия. |

В текущей реализации сценарий выбирается случайно. Это удобно для учебной аудитории: студенты начинают из разных, но сопоставимых ограничений, что помогает обсуждать стратегию в условиях неопределенности. Для исследовательских упражнений преподаватель может контролировать случайность, изменив логику выбора сценария или заранее зафиксировав последовательности прохождений.

Сценарный слой не описывает конкретный реальный регион. Каждый сценарий - это стилизованный стресс-профиль: небольшой набор исходных сдвигов, применяемых к одной и той же модели управления. Так сравнение остается понятным и не создает ложного впечатления эмпирической калибровки.

### Бюджет и ограничения

Бюджетная модель намеренно проста, но достаточно жесткая, чтобы создавать реальный дефицит выбора. Базовый доход региона задан как 620 млрд рублей и масштабируется текущим индексом реальных доходов населения. Затем применяется коэффициент налоговой нагрузки:

| Налоговая нагрузка | Коэффициент дохода | Влияние на KPI и поддержку |
| --- | ---: | --- |
| Низкая | 0.88 | Меньше доходов бюджета, выше доверие и доходы, ниже бедность. |
| Нормальная | 1.00 | Нейтральная базовая настройка. |
| Высокая | 1.12 | Больше доходов бюджета, ниже доверие и доходы, выше бедность. |

Игрок распределяет годовой бюджет по шести блокам:

| Блок | Роль |
| --- | --- |
| Социальная политика | Бедность, семьи, доверие и демографическая поддержка. |
| Здравоохранение | Продолжительность жизни, здоровье/спорт и стабильность населения. |
| Образование и культура | Человеческий капитал, удержание молодежи, цифровая зрелость и производительность МСП. |
| Инфраструктура и городская среда | Условия жизни, среда, доходы, инвестиции и удержание населения. |
| Экономика и цифровизация | Доходы, инвестиции, доходы МСП, цифровая зрелость и рост экономики. |
| Инвестиционный фонд | Отложенный рост бюджета вместо текущих расходов. |

Доли бюджета должны давать 100 процентов. Доля инвестиционного фонда ограничена верхней границей 60 процентов, а горизонт инвестирования - 2-5 годами. Ожидаемый возврат считается так:

```text
возврат = сумма_инвестиций * (1 + 0.18 * горизонт_лет)
```

Такая конструкция делает инвестиции привлекательными, но дорогими: средства инвестиционного фонда временно изымаются из текущих программ. Более длинный горизонт повышает ожидаемый возврат, но усиливает краткосрочное давление на политику.

Управленческие меры также имеют ежегодную стоимость в млрд рублей. Стоимость выбранных мер в каждом блоке не может превышать доступный бюджет этого блока. Одновременно можно выбрать не более 12 мер. Эти ограничения не дают выиграть простым выбором всех программ и заставляют расставлять приоритеты.

### KPI-показатели

Модель отслеживает двенадцать KPI:

| Показатель | База | Цель | Вес | Направление |
| --- | ---: | ---: | ---: | --- |
| Доверие к власти | 50 | 70 | 1.2 | Больше лучше |
| Численность населения, индекс | 100 | 105 | 1.1 | Больше лучше |
| Суммарный коэффициент рождаемости | 1.3 | 1.6 | 1.1 | Больше лучше |
| Ожидаемая продолжительность жизни | 74 | 78 | 1.1 | Больше лучше |
| Уровень бедности | 15 | 7 | 1.1 | Меньше лучше |
| Удовлетворенность физкультурой и спортом | 40 | 60 | 0.8 | Больше лучше |
| Уровень образования и кадров | 65 | 80 | 1.0 | Больше лучше |
| Реальные доходы населения, индекс | 100 | 120 | 1.1 | Больше лучше |
| Рост инвестиций, индекс | 100 | 120 | 0.9 | Больше лучше |
| Доход на одного работника МСП, индекс | 100 | 120 | 0.9 | Больше лучше |
| Качество окружающей среды | 55 | 80 | 0.9 | Больше лучше |
| Цифровая зрелость госуправления | 40 | 70 | 1.0 | Больше лучше |

У каждого KPI есть минимальные и максимальные границы. После каждого годового хода изменение KPI формируется из пяти источников:

1. Естественный дрейф к целевому значению.
2. Влияние бюджетных долей относительно опорной доли 20 процентов для каждого текущего расходного блока.
3. Эффекты и побочные эффекты выбранных управленческих мер.
4. Эффекты налоговой нагрузки и ежегодного события.
5. Штрафы активных долгосрочных ситуаций.

Перед применением к состоянию KPI годовое изменение сглаживается. Это важно для учебной логики: эффекты публичной политики видны, но не превращаются в мгновенное изменение всей системы.

### Логика KPI-оценки

Итоговый KPI - это взвешенное среднее нормированных достижений по показателям. Для показателей, где больше значит лучше, достижение нормируется от заданного минимума к цели. Для бедности направление инвертировано: меньше значит лучше, а нормирование идет от максимума к цели.

Модель допускает ограниченное превышение цели на уровне нормирования, но итоговый KPI ограничивается шкалой 0-100. Это позволяет видеть выдающиеся результаты, не позволяя одному показателю полностью подменить общий итог.

Итоговая оценка строится по KPI:

| KPI | Оценка |
| ---: | --- |
| 85 и выше | A |
| 70-84.9 | B |
| 55-69.9 | C |
| Ниже 55 | D |

Оценка не исчерпывает интерпретацию. Общественная поддержка выводится отдельно и используется в итоговом качественном заключении.

### Общественная поддержка и политическая обратная связь

Общественная поддержка - не декоративный индикатор. Она представляет слой политической легитимности и рассчитывается через удовлетворенность социальных групп.

В модели есть шесть групп:

| Группа | Электоральный вес | Ключевые интересы |
| --- | ---: | --- |
| Семьи с детьми | 0.25 | Рождаемость, бедность, доверие, доходы, среда. |
| Пожилые жители | 0.20 | Продолжительность жизни, бедность, доверие, здоровье/спорт, среда. |
| Бизнес и МСП | 0.20 | Доходы, доходы МСП, инвестиции, цифровая зрелость. |
| Молодежь | 0.15 | Образование, цифровая зрелость, спорт, доходы, доверие. |
| Бюджетники и госслужащие | 0.10 | Доверие, доходы, образование, цифровая зрелость. |
| Экологические и городские активисты | 0.10 | Среда, спорт, доверие, инвестиции, цифровая зрелость. |

Для каждой группы модель считает взвешенное среднее достижений по релевантным KPI на шкале 0-100. Индекс общественной поддержки затем рассчитывается как среднее по группам с учетом их электоральных весов.

Политическая обратная связь проявляется двумя способами:

1. Долгосрочные ситуации могут запускаться сочетанием слабых KPI и низкой удовлетворенности групп.
2. Итоговая интерпретация различает сильные KPI при низкой поддержке, слабые KPI при высокой поддержке, сильные KPI при высокой поддержке и смешанные исходы.

Поддержка населения напрямую не создает автоматический проигрыш и не меняет доходы бюджета механически. Это намеренное решение: легитимность рассматривается как параллельная мера подотчетности и как условие отдельных кризисных динамик, а не как универсальный множитель.

### Долгосрочные ситуации

Долгосрочные ситуации представляют устойчивые проблемы управления. Они запускаются, когда KPI и поддержка групп пересекают рискованные пороги, и остаются активными, пока не устранены исходные причины.

| Ситуация | Логика запуска | Ежегодное давление |
| --- | --- | --- |
| Экологические протесты | Качество среды ниже порога и поддержка активистов слишком низкая. | Снижает доверие и инвестиции. |
| Социальное напряжение | Бедность высока, поддержка семей и молодежи низкая. | Снижает доверие, население и доходы. |
| Кадровый голод и отток молодежи | Образование/кадры слабы, поддержка молодежи низкая. | Снижает население, доходы МСП и инвестиции. |

Этот слой важен для публично-управленческой логики модели. Он показывает, что проблема может продолжать вредить региону после завершения отдельного годового события, а ее решение требует улучшить и формальные показатели, и удовлетворенность затронутых групп.

### Ежегодный цикл решений

Каждый годовой ход проходит воспроизводимую последовательность:

1. Показ текущего года, сценария, KPI, общественной поддержки, метрик и активных ситуаций.
2. Вывод ежегодного события и обязательный выбор реакции.
3. Сбор налоговой нагрузки, бюджетных долей, доли инвестиций и горизонта инвестирования.
4. Сбор выбранных управленческих мер для текущей пятилетки.
5. Проверка, что бюджетные доли дают 100 процентов.
6. Проверка, что меры укладываются в бюджет каждого блока и лимит 12 мер.
7. Учет созревших инвестиционных возвратов и расчет доступного бюджета.
8. Применение бюджетных, политических, налоговых, событийных и ситуационных эффектов к KPI.
9. Пересчет поддержки групп и общей общественной поддержки.
10. Запуск или завершение долгосрочных ситуаций.
11. Переход к следующему году, обновление графиков и генерация нового события.
12. В конце 20-летнего горизонта расчет итоговой KPI-оценки и интерпретации поддержки.

Цикл детерминирован при одинаковом стартовом сценарии, последовательности событий, бюджетных вводах и выбранных мерах. Случайность используется для выбора сценария и событий, поэтому воспроизводимые учебные эксперименты должны контролировать или фиксировать эти элементы.

### Предпосылки

Модель делает несколько явных упрощений:

- Региональное правительство можно представить через единый годовой бюджет, пять текущих расходных блоков и инвестиционный фонд.
- Эффекты KPI складываются внутри хода и затем сглаживаются, чтобы избежать нереалистично резких изменений.
- Общественная поддержка выводится из материальных и управленческих результатов, а не из медийных систем, партийной конкуренции, элитных договоренностей или силового ресурса.
- Бюджетное давление представлено через доли расходов, стоимость мер, стоимость событий, налоговую нагрузку и отложенные инвестиции, а не через долговые рынки, межбюджетные трансферты, закупочные циклы или юридические обязательства.
- Каждая управленческая мера имеет стилизованные средние эффекты, а не распределение возможных результатов реализации.
- Состав социальных групп и их веса фиксированы для сопоставимости прохождений.

Эти предпосылки делают симулятор понятным для обучения, но одновременно задают границы его применения.

### Ограничения интерпретации

Нельзя трактовать прохождение как прогноз, рекомендацию для реальной администрации или эмпирический рейтинг инструментов политики. Симулятор не оценивает причинные эффекты на административных данных, не моделирует макроэкономические шоки за пределами сценариев и событий, не включает правовые, закупочные, лоббистские, коррупционные, электоральные или геополитические ограничения в полной реальной форме.

Наиболее корректная интерпретация - сравнительная и рефлексивная:

- Какую стратегию игрок выбрал в условиях дефицита ресурсов?
- Какие группы выиграли или потеряли доверие?
- Подорвала ли краткосрочная стабильность долгосрочную устойчивость?
- Удалось ли нарастить инвестиционную емкость без ослабления текущих услуг?
- KPI и общественная поддержка рассказывают одну и ту же историю или разные истории?

Для исследовательского использования симулятор следует рассматривать как артефакт поддержки решений, учебное вмешательство или инструмент структурированного выявления предпочтений. Любые эмпирические утверждения о студентах, регионах или эффективности политики требуют отдельного дизайна исследования, политики согласия/данных и статистического анализа.

### Чувствительность и адаптация

Симулятор специально сделан адаптируемым. Для другого региона или курса проверьте следующие параметры:

| Семейство параметров | Что адаптировать | Вопрос чувствительности |
| --- | --- | --- |
| Конфигурация KPI | База, цель, min/max, вес, инверсия направления. | Какие показатели определяют успех в этом курсе или контексте? |
| Модификаторы сценариев | Начальные шоки по сценариям. | Насколько правдоподобны и сбалансированы стартовые ограничения? |
| Бюджетные категории | Блоки расходов и доли по умолчанию. | Видят ли студенты нужные учебные компромиссы? |
| Коэффициенты влияния бюджета | Как доли расходов двигают KPI. | Не слишком ли сильны, слабы или односторонни предельные эффекты? |
| Управленческие меры | Названия, стоимость, эффекты, побочные эффекты, распределение по фазам. | Актуальны ли инструменты и сопоставимы ли они по цене? |
| Ежегодные события | Пул событий, редкие события, варианты реакции, бюджетные и KPI-эффекты. | Проверяют ли события кризисное управление и административное суждение? |
| Социальные группы | Группы, веса, карты интересов по KPI. | Чья поддержка важна в учебном сценарии? |
| Долгосрочные ситуации | Пороги запуска/разрешения и ежегодные штрафы. | Какие устойчивые риски студенты должны научиться диагностировать? |
| Итоговая интерпретация | Пороги оценок и качественные комментарии. | Что считается успехом: KPI, легитимность или баланс? |

Рекомендуемый порядок анализа чувствительности:

1. Меняйте только одно семейство параметров за раз.
2. До следующего изменения прогоняйте хотя бы один базовый и один стрессовый сценарий.
3. Фиксируйте одну и ту же стратегию при старых и новых параметрах.
4. Сравнивайте KPI, поддержку населения, активные ситуации и бюджетное давление.
5. Документируйте все изменения в методологических заметках или учебной инструкции.

### Воспроизводимые локальные команды

Установить зависимости:

```bash
npm install
```

Запустить все локальные тесты:

```bash
npm test
```

Запустить только i18n/browser QA:

```bash
npm run test:i18n
```

Запустить симулятор локально:

```bash
python -m http.server 8000
```

Затем откройте <http://localhost:8000/>.

Простая проверка существования локальных ссылок и изображений из README:

```bash
node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); const refs=[...md.matchAll(/!\\[[^\\]]*\\]\\(([^)]+)\\)|\\[[^\\]]+\\]\\(([^)]+)\\)/g)].map(m=>m[1]||m[2]).filter(x=>x&&!/^https?:|^mailto:|^#/.test(x)); let bad=[]; for (const r of refs){const p=r.split('#')[0]; if(p && !fs.existsSync(p)) bad.push(r);} if(bad.length){console.error('Missing local refs:\\n'+bad.join('\\n')); process.exit(1);} console.log('README local refs OK');"
```
