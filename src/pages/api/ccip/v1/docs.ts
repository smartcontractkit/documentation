import type { APIRoute } from "astro"
import { successHeaders } from "../utils.ts"

export const prerender = false

export const GET: APIRoute = async () => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CCIP Chains API</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        #swagger-ui {
            max-width: 1460px;
            margin: 0 auto;
            padding: 20px;
        }
        .swagger-ui .topbar {
            background-color: #375bd2;
        }
        .swagger-ui .info .title small.version-stamp {
            background-color: #375bd2;
        }
        .swagger-ui .scheme-container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
        }
        .swagger-ui .opblock-tag {
            border-bottom: 1px solid #e9ecef;
            padding: 10px 0;
        }
        .swagger-ui .opblock {
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .swagger-ui .opblock .opblock-summary {
            padding: 8px 20px;
        }
        .swagger-ui .opblock .opblock-summary-method {
            min-width: 80px;
            text-align: center;
        }
        .swagger-ui .model-box {
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.addEventListener('load', function() {
            const ui = SwaggerUIBundle({
                url: '/api/ccip/v1/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                defaultModelsExpandDepth: 3,
                defaultModelExpandDepth: 3,
                displayRequestDuration: true,
                docExpansion: "list",
                filter: true,
                showExtensions: true,
                tryItOutEnabled: true,
                syntaxHighlight: {
                    activated: true,
                    theme: "monokai"
                }
            });

            window.ui = ui;
        });
    </script>
</body>
</html>
`

  return new Response(html, {
    headers: {
      ...successHeaders,
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
