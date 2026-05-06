#!/usr/bin/env bash

set -o errexit

bundle install

cd frontend
npm ci
npm run build
cd ..

bundle exec rails db:migrate
bundle exec rails db:seed