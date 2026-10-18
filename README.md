# cryptofeed402-mcp

MCP server for [cryptofeed402](https://cryptofeed402.site): crypto market data for AI agents, paid per call with x402 (USDC on Base). Not financial advice.

## Use the hosted server (recommended)

Remote MCP, streamable HTTP, no auth:

```
https://cryptofeed402.site/mcp
```

## Use it over stdio

```json
{
  "mcpServers": {
    "cryptofeed402": { "command": "npx", "args": ["-y", "cryptofeed402-mcp"] }
  }
}
```

Before it is on npm, run it from a checkout: `npm install && node index.mjs`.

Optional env: `CRYPTOFEED402_URL` (default https://cryptofeed402.site), `CRYPTOFEED402_REF` (attribution tag, default `mcp-stdio`).

## Tools

| Tool | Cost | Returns |
|---|---|---|
| get_teaser | free | teaser text, Hyperliquid extreme funding (8h-equivalent), BTC/ETH/SOL + 24h change |
| get_sample_brief | free | previous brief edition, trimmed (`sample: true`) |
| get_pricing | free | per-call prices, network, payTo |
| get_price {symbol} | $0.0025 | x402 payment requirements + URL for /price/{symbol} |
| get_extreme_funding | $0.0025 | x402 requirements for /funding/extreme |
| get_latest_brief | $0.015 | x402 requirements for /brief/latest |
| get_history {from,to} | $0.005/day (cap $0.50) | x402 requirements for /history |

Prices are launch prices (50% off). Paid tools do not pay for you. This package holds no keys. Fetch the returned URL with your own x402 client (for example `@x402/fetch`). You are charged only on a successful response.
