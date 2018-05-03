#!/usr/bin/env bash

./node_modules/contentful-export/bin/contentful-export \
  --content-file space.json \
  --management-token $CF_CMA_TOKEN \
  --space-id $CF_SPACE \
  --include-drafts
