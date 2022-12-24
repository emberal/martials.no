#!/bin/sh

if [ ! -e dist ]; then
  echo "dist directory not found, running 'vite bulid'"
  vite build
fi

# Copying the file ($1) to the dist directory, or to subdirectory ($2)
copy() {
  if [ -e "$1" ]; then
    cp "$1" dist/"$2"
  else
    echo "'$1' not found, skipping"
  fi
}

mkdir -p "dist/.well-known"

copy robots.txt
copy security.txt .well-known
copy .htaccess
