import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { cacheControl } from "./hosting.mjs";
import { brotliCompressSync, constants } from "node:zlib";

const args = process.argv.slice(2);
const port = Number(args[args.indexOf("--port") + 1]) || 4173;
const host = args.includes("--host") ? args[args.indexOf("--host") + 1] : "127.0.0.1";
const root = resolve("dist");
const routes = JSON.parse(await readFile(`${root}/routes.json`, "utf8"));
const compressed = new Map();
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".avif": "image/avif", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".json": "application/json" };

createServer(async (request, response) => {
  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const url = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const clean = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
    if (routes.includes(clean) && pathname !== clean) {
      response.writeHead(308, { Location: clean + url.search }).end();
      return;
    }
    const asset = routes.includes(pathname) ? (pathname === "/" ? "/index.html" : `${pathname}/index.html`) : pathname;
    const file = resolve(root, `.${asset}`);
    let status = 200;
    let body;
    let type = types[extname(file)] || "application/octet-stream";
    try {
      if (!file.startsWith(root + sep) || (await stat(file)).isDirectory()) throw new Error("Not a public file");
      body = await readFile(file);
    } catch {
      status = 404;
      body = await readFile(`${root}/404.html`);
      type = types[".html"];
    }
    const headers = { "Content-Type": type, "Cache-Control": status === 404 ? "no-cache" : cacheControl(asset) };
    if (/^(text\/|application\/(xml|json))/.test(type)) {
      headers.Vary = "Accept-Encoding";
      if ((request.headers["accept-encoding"] ?? "").split(",").some(value => value.trim() === "br")) {
        const key = status === 404 ? "/404.html" : asset;
        if (!compressed.has(key)) compressed.set(key, brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }));
        body = compressed.get(key);
        headers["Content-Encoding"] = "br";
      }
    }
    headers["Content-Length"] = body.length;
    response.writeHead(status, headers);
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400).end("Bad request");
  }
}).listen(port, host, () => console.log(`Production preview: http://${host}:${port}`));
