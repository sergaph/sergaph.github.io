#!/bin/bash

# Относительный путь к директории
RELATIVE_PATH="../astro/src/pages/360"

# Имя файла
FILE_NAME="new.md"

# Полный путь к файлу
FULL_PATH="$RELATIVE_PATH/$FILE_NAME"

# Создание директории, если её нет
mkdir -p "$RELATIVE_PATH"

# Получение текущей даты в формате "dd MMM yyyy"
CURRENT_DATE=$(date +"%d %b %Y")

# Содержимое файла
CONTENT="---
layout: '../../layouts/Layout360.astro'
author: \"Sergey Maslennikov\"
date: \"$CURRENT_DATE\"
title: \"<TITLE>\"
previewUrl: \"https://storage.clo.ru/s3-masle-net-default-bucket/preview_tocopilla.jpg\"
photoUrl: \"https://storage.clo.ru/s3-masle-net-default-bucket/tocopilla.jpg\"
isDraft: true
---"

# Создание файла и запись содержимого
echo "$CONTENT" > "$FULL_PATH"

# Проверка успешности создания
if [[ -f "$FULL_PATH" ]]; then
    echo "Файл $FILE_NAME успешно создан по пути: $FULL_PATH."
else
    echo "Ошибка создания файла $FULL_PATH."
fi