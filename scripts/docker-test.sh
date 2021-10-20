#!/bin/bash
npm install
npm run test -- --reporter mocha-junit-reporter
