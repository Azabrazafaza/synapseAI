# Настройка репозитория для работы с Pull Requests

## Настройка защиты ветки main

Для настройки защиты ветки `main` и обязательных PR:

1. Перейдите в **Settings** → **Branches**
2. Нажмите **Add branch protection rule**
3. В поле **Branch name pattern** введите: `main`
4. Включите следующие опции:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: `1`
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings**

## Настройка CI/CD workflow

Для добавления автоматической проверки кода:

1. Перейдите в **Settings** → **Actions** → **General**
2. В разделе **Workflow permissions** выберите:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

3. Затем добавьте файл `.github/workflows/ci.yml` (если еще не добавлен)

## Рекомендуемые настройки

### Branch protection
- Защита ветки `main` от прямых коммитов
- Обязательные PR для всех изменений
- Требование минимум 1 approval
- Требование прохождения CI проверок

### Pull Requests
- Автоматическое назначение ревьюеров (опционально)
- Автоматическое добавление лейблов
- Требование описания изменений

### Issues
- Использование шаблонов для багов и фич
- Автоматическое закрытие связанных issues при мердже PR

## Рабочий процесс

1. Создайте новую ветку от `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Внесите изменения и закоммитьте:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Запушьте ветку:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Создайте Pull Request на GitHub

5. После ревью и approval, мердж через GitHub UI
