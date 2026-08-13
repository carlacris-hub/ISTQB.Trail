import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

import { createStripeCheckoutSession } from "./src/services/stripeServer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Stripe Checkout Session Creation Endpoint
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { userId, type, billingCycle, coinPackId, countryCode, userEmail, originUrl } = req.body;
      const hostOrigin = originUrl || req.headers.origin || `http://${req.headers.host}`;

      const result = await createStripeCheckoutSession({
        userId,
        type,
        billingCycle,
        coinPackId,
        countryCode,
        userEmail,
        originUrl: hostOrigin,
      });

      res.json(result);
    } catch (error: any) {
      console.error("Erro ao criar sessão de checkout no Stripe:", error);
      res.status(500).json({
        fallback: true,
        error: "Erro no servidor ao comunicar com o Stripe.",
        details: error?.message || String(error),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ISTQB Trail Server rodando na porta ${PORT}`);
  });
}

startServer();
