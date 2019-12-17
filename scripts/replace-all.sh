#!/usr/bin/env bash
ls *-*.json | while read line; do ./scripts/replace-all-strings.js $line; done
