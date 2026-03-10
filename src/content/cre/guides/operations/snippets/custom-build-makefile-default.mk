.PHONY: build

build:
	bun cre-compile main.ts wasm/workflow.wasm
