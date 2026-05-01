import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { URL } from "node:url"

const ROOT = path.resolve("dist/client")
const PORT = 4321

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

function send(
  res: http.ServerResponse,
  status: number,
  body: Buffer | string,
  headers: Record<string, string> = {}
): void {
  res.writeHead(status, headers)
  res.end(body)
}

function safeJoin(root: string, pathname: string): string | null {
  const fullPath = path.normalize(path.join(root, pathname))
  if (!fullPath.startsWith(root)) return null
  return fullPath
}

function fileExists(p: string): boolean {
  try {
    return fs.statSync(p).isFile()
  } catch {
    return false
  }
}

function dirExists(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url || "/", `http://${req.headers.host}`)
  let pathname = decodeURIComponent(parsed.pathname)

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1)
  }

  const directPath = safeJoin(ROOT, pathname)
  if (!directPath) {
    return send(res, 403, "Forbidden")
  }

  if (fileExists(directPath)) {
    const ext = path.extname(directPath).toLowerCase()
    return send(res, 200, fs.readFileSync(directPath), {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    })
  }

  if (dirExists(directPath)) {
    const indexPath = path.join(directPath, "index.html")
    if (fileExists(indexPath)) {
      return send(res, 200, fs.readFileSync(indexPath), {
        "Content-Type": "text/html; charset=utf-8",
      })
    }
  }

  const nestedIndexPath = safeJoin(ROOT, path.join(pathname, "index.html"))
  if (nestedIndexPath && fileExists(nestedIndexPath)) {
    return send(res, 200, fs.readFileSync(nestedIndexPath), {
      "Content-Type": "text/html; charset=utf-8",
    })
  }

  return send(res, 404, "Page not found.")
})

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`)
})
