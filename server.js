import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

const ordersFile = path.join(__dirname, "data", "orders.json");

fs.mkdirSync(path.dirname(ordersFile), { recursive: true });

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]");
}

const products = {
    axolotl: {
        name: "Axolotl Rėmėjas",
        price: 0.99
    },
    warden: {
        name: "Warden Rėmėjas",
        price: 1.49
    },
    fox: {
        name: "Fox Rėmėjas",
        price: 1.99
    },
    parrot: {
        name: "Papūga Rėmėjas",
        price: 2.50
    }
};

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   PAYPAL
========================= */

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials nenustatyti.");
  }

  const auth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description || "PayPal autentifikacija nepavyko."
    );
  }

  return data.access_token;
}

app.get("/api/paypal/config", (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || ""
  });
});

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { productId, minecraftName } = req.body;

    if (!products[productId]) {
      return res.status(400).json({
        error: "Neteisingas paketas."
      });
    }

    const nick = String(minecraftName || "").trim();

    if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
      return res.status(400).json({
        error: "Minecraft nick turi būti 3–16 simbolių."
      });
    }

    const product = products[productId];
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `AXO-${Date.now()}`
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: `${product.name} - Minecraft: ${nick}`,
              custom_id: product.id,
              amount: {
                currency_code: "EUR",
                value: product.price.toFixed(2)
              }
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal create order error:", data);

      return res.status(500).json({
        error: "Nepavyko sukurti PayPal užsakymo."
      });
    }

    res.json({
      id: data.id
    });

  } catch (error) {
    console.error("PayPal create error:", error);

    res.status(500).json({
      error: "PayPal klaida."
    });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, productId, minecraftName } = req.body;

    if (!orderId || !products[productId]) {
      return res.status(400).json({
        error: "Neteisingas užsakymas."
      });
    }

    const nick = String(minecraftName || "").trim();

    if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
      return res.status(400).json({
        error: "Minecraft nick turi būti 3–16 simbolių."
      });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: "{}"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal capture error:", data);

      return res.status(500).json({
        error: "Nepavyko patvirtinti PayPal mokėjimo."
      });
    }

    if (data.status !== "COMPLETED") {
      return res.status(400).json({
        error: "Mokėjimas nebuvo užbaigtas."
      });
    }

    const orders = JSON.parse(
      fs.readFileSync(ordersFile, "utf8")
    );

    const product = products[productId];

    const order = {
      id: "AXO-" + Date.now(),
      paypalOrderId: orderId,
      minecraftName: nick,
      product: product.name,
      productId: product.id,
      amount: product.price,
      status: "PAID",
      createdAt: new Date().toISOString()
    };

    orders.unshift(order);

    fs.writeFileSync(
      ordersFile,
      JSON.stringify(orders, null, 2)
    );

    res.json({
      ok: true,
      order: order
    });

  } catch (error) {
    console.error("PayPal capture error:", error);

    res.status(500).json({
      error: "PayPal klaida."
    });
  }
});

/* =========================
   PRODUCTS
========================= */

app.get("/api/products", (req, res) => {
  res.json(Object.values(products));
});

/* =========================
   DEMO ORDERS
========================= */

app.post("/api/orders", (req, res) => {
  const { productId, minecraftName } = req.body;

  if (!products[productId]) {
    return res.status(400).json({
      error: "Neteisingas paketas."
    });
  }

  const nick = String(minecraftName || "").trim();

  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
    return res.status(400).json({
      error: "Minecraft nick turi būti 3–16 simbolių."
    });
  }

  const orders = JSON.parse(
    fs.readFileSync(ordersFile, "utf8")
  );

  const product = products[productId];

  const order = {
    id: "AXO-" + Date.now(),
    minecraftName: nick,
    product: product.name,
    productId: product.id,
    amount: product.price,
    status: "DEMO_PAID",
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);

  fs.writeFileSync(
    ordersFile,
    JSON.stringify(orders, null, 2)
  );

  res.json({
    ok: true,
    order: order
  });
});

/* =========================
   ADMIN
========================= */

app.get("/api/admin/orders", (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== "axolotl123") {
    return res.status(401).json({
      error: "Neteisingas slaptažodis."
    });
  }

  const orders = JSON.parse(
    fs.readFileSync(ordersFile, "utf8")
  );

  res.json(orders);
});

/* =========================
   MAIN PAGE
========================= */

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🦎 Axolotl Donate paleistas!");
  console.log("🌐 Portas: " + PORT);
});
