#!/bin/bash

# Install dependencies if vendor folder doesn't exist
if [ ! -d "vendor" ]; then
    composer install
fi

# Wait for mysql to be ready
echo "Waiting for mysql..."
while ! curl -s --connect-timeout 5 mysql:3306; do
  RET=$?
  if [ $RET -eq 52 ] || [ $RET -eq 1 ] || [ $RET -eq 0 ]; then
    # 52: Empty reply from server
    # 1: Protocol mismatch (e.g., MySQL is not HTTP)
    # 0: Success (unlikely for MySQL via curl)
    break
  fi
  sleep 1
done
echo "MySQL is up - executing command"

# Copy .env.example to .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    # Generate key only if we just created the .env file
    php artisan key:generate
fi

# Run migrations
php artisan migrate --force

# Start PHP-FPM
php-fpm
