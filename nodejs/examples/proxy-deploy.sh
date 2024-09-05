#!/bin/bash

extension=$(basename "$1" | sed 's/\/$//')
output=

script=$(cat <<'EOF'
#!/bin/bash
set -euo pipefail

OWN_FILENAME="$(basename $0)"
LAMBDA_EXTENSION_NAME="$OWN_FILENAME" # (external) extension name has to match the filename

echo "[extension-bash] Launching ${LAMBDA_EXTENSION_NAME}"
exec "/opt/${LAMBDA_EXTENSION_NAME}/index.js"
EOF
)

wrapper=$(cat <<'EOF'
#!/bin/bash
echo "[extension-wrapper] Running wrapper"
args=("$@")
export AWS_LAMBDA_RUNTIME_API="sandbox.localdomain:9009"
echo "[extension-wrapper] AWS_LAMBDA_RUNTIME_API=$AWS_LAMBDA_RUNTIME_API"
exec "${args[@]}"
EOF
)

check_dir() {
  if [ ! -d "$extension" ]; then
    echo "$extension directory not found."
    exit 1
  fi
}

buildAndDeploy() {
  tmp=$(mktemp -d)
  output="$tmp/extension.zip"
  bootstrap="$tmp/extensions/$extension"
  proxy_wrapper="$tmp/proxy_wrapper.sh"
  mkdir -p $(dirname $bootstrap)
  echo "$script" > "$bootstrap"
  echo "$wrapper" > "$proxy_wrapper"

  chmod +x "$bootstrap"
  chmod +x "$proxy_wrapper"
  chmod +x "$extension"/index.js
  npm install --prefix "$extension"
  zip -r "$output" "$extension"
  cd "$tmp" && zip -r "$output" "."

  aws lambda publish-layer-version \
    --layer-name "$extension" \
    --zip-file fileb://"$output" \
    --compatible-runtimes nodejs16.x nodejs18.x nodejs20.x

  echo "$output"
}

# Check if a folder argument was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <directory>"
  exit 1
else
  check_dir;
  echo "Building $extension"
  buildAndDeploy;
fi