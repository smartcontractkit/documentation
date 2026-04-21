JAVY_PLUGIN := $(abspath ./node_modules/@chainlink/cre-sdk-javy-plugin)

.PHONY: build clean

build:
	mkdir -p wasm
	CRE_SDK_JAVY_PLUGIN_HOME="$(JAVY_PLUGIN)" bun cre-compile \
		--cre-exports ./my-plugin \ # highlight-line
		./main.ts \
		./wasm/workflow.wasm

clean:
	rm -rf wasm
