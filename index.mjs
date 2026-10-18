#!/usr/bin/env node
// cryptofeed402-mcp: stdio MCP server that proxies the hosted cryptofeed402 MCP endpoint.
// Holds no keys. Paid tools return x402 payment requirements; pay over HTTP with your own x402 client.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const BASE = (process.env.CRYPTOFEED402_URL || "https://cryptofeed402.site").replace(/\/+$/, "");
const REF = process.env.CRYPTOFEED402_REF || "mcp-stdio";
let nextId = 1;
async function remote(method, params) {
  const r = await fetch(`${BASE}/mcp?ref=${encodeURIComponent(REF)}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "user-agent": "cryptofeed402-mcp-stdio/1.0.0", "x-ref": REF },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
    signal: AbortSignal.timeout(15000),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${j.error.code}: ${j.error.message}`);
  return j.result;
}
const server = new Server({ name: "cryptofeed402", version: "1.0.0" }, { capabilities: { tools: {} }, instructions: "Crypto market data for AI agents (Hyperliquid funding/OI, OKX spot, twice-daily brief). Free: get_teaser, get_sample_brief, get_pricing. Paid tools return x402 requirements (USDC on Base). Not financial advice." });
server.setRequestHandler(ListToolsRequestSchema, async () => remote("tools/list", {}));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try { return await remote("tools/call", { name: req.params.name, arguments: req.params.arguments || {} }); }
  catch (e) { return { content: [{ type: "text", text: `cryptofeed402 error: ${e.message}` }], isError: true }; }
});
await server.connect(new StdioServerTransport());
