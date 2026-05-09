.PHONY: build

build:
	echo "Running my custom build step..." # highlight-line
	bun cre-compile main.ts wasm/workflow.wasm
