#!/bin/sh

if [ ! -e dist ]; then
  echo "dist directory not found, running 'vite bulid'"
  vite build
fi

if [ -e robots.txt ]; then
  cp robots.txt dist
else
  echo "robots.txt not found"
fi

mkdir -p "dist/.well-known"

if [ -e "dist/.well-known" ]; then
  if [ -e security.txt ]; then
    cp security.txt dist/.well-known
  else
    echo "security.txt not found"
  fi
fi

if [ -e .htaccess ]; then
  cp .htaccess dist
fi
