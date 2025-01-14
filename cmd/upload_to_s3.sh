#!/bin/bash

# ID бакета	                        s3-masle-net-default-bucket
# Ссылка на бакет (domain-style)	https://s3-masle-net-default-bucket.storage.clo.ru
# Ссылка на бакет (path-style)      https://storage.clo.ru/s3-masle-net-default-bucket


# Ссылка на подключение	            storage.clo.ru
# Порт подключения	                443
# Идентификатор ключа	            1SUOFZRQZ8RPKTTGEBY7
# Секретный ключ	                CfjqeOWL7Hd8ykHDUGyDtuEVjj6IkBNvXPDEBTDW
# Имя пользователя (Canonical ID)   s3-masle-net

# Конфигурация
BUCKET_NAME="s3-masle-net-default-bucket"
ACCESS_KEY="1SUOFZRQZ8RPKTTGEBY7"
SECRET_KEY="CfjqeOWL7Hd8ykHDUGyDtuEVjj6IkBNvXPDEBTDW"
REGION="ru-central1" # Например, ru-central1
# ENDPOINT="https://s3.$REGION.clo.ru"
ENDPOINT="https://s3-masle-net-default-bucket.storage.clo.ru"

# Файлы для загрузки
FILE1="preview_Samui_Villa_291224.JPG"
FILE2="Samui_Villa_291224.JPG"

# Функция для создания подписи AWS V4
create_signature() {
  local string_to_sign=$1
  local date_key=$(printf "$DATE" | openssl dgst -sha256 -hmac "AWS4$SECRET_KEY" -binary)
  local date_region_key=$(printf "$REGION" | openssl dgst -sha256 -hmac "$date_key" -binary)
  local date_region_service_key=$(printf "s3" | openssl dgst -sha256 -hmac "$date_region_key" -binary)
  local signing_key=$(printf "aws4_request" | openssl dgst -sha256 -hmac "$date_region_service_key" -binary)
  printf "$string_to_sign" | openssl dgst -sha256 -hmac "$signing_key" -binary | xxd -p -c 256
}

# Функция для загрузки файла в S3
upload_file_to_s3() {
  local file_path=$1
  local file_name=$(basename "$file_path")
  local content_type="application/octet-stream"
  local date=$(date -u +"%Y%m%dT%H%M%SZ")
  local short_date=$(date -u +"%Y%m%d")
  local canonical_uri="/$BUCKET_NAME/$file_name"
  local payload_hash=$(openssl dgst -sha256 < "$file_path" | awk '{print $2}')
  local canonical_request="PUT\n$canonical_uri\n\nhost:s3.$REGION.clo.ru\nx-amz-content-sha256:$payload_hash\nx-amz-date:$date\n\nhost;x-amz-content-sha256;x-amz-date\n$payload_hash"
  local string_to_sign="AWS4-HMAC-SHA256\n$date\n$short_date/$REGION/s3/aws4_request\n$(printf "$canonical_request" | openssl dgst -sha256 | awk '{print $2}')"
  local signature=$(create_signature "$string_to_sign")
  local authorization_header="AWS4-HMAC-SHA256 Credential=$ACCESS_KEY/$short_date/$REGION/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=$signature"

  curl -X PUT -T "$file_path" \
    -H "Host: s3-masle-net-default-bucket.storage.clo.ru" \
    -H "x-amz-content-sha256: $payload_hash" \
    -H "x-amz-date: $date" \
    -H "Authorization: $authorization_header" \
    "$ENDPOINT/$BUCKET_NAME/$file_name"
}

# Загрузка файлов
upload_file_to_s3 "$FILE1"
upload_file_to_s3 "$FILE2"