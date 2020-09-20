#!/bin/bash

set -e

CI=true npm run eslint
CI=true npm test -- --passWithNoTests
