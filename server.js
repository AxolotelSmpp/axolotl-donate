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
id: "axolotl",
name: "Axolotl Rėmėjas",
price: 2.99,
features: [
"⭐ Rėmėjo statusas",
"🎨 Speciali žinutė",
"🦎 Axolotl privilegijos"
]
},

warden: {
id: "warden",
name: "Warden Rėmėjas",
price: 4.99,
features: [
"⭐ Warden statusas",
"⚡ Papildomos privilegijos",
"🛡️ Warden išskirtinumas"
]
},

fox: {
id: "fox",
name: "Fox Rėmėjas",
price: 7.99,
features: [
"⭐ Fox statusas",
"🦊 Fox privilegijos",
"✨ Išskirtinis rangas"
]
},

parrot: {
id: "parrot",
name: "Papūga Rėmėjas",
price: 10.00,
features: [
"⭐ Papūga statusas",
"🦜 Papūgos privilegijos",
"👑 Aukščiausias rangas"
]
}
};

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
res.json(Object.values(products));
});

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

app.get("/", (req, res) => {
res.sendFile(
path.join(__dirname, "public", "index.html")
);
});

app.listen(PORT, "0.0.0.0", () => {
console.log("🦎 Axolotl Donate paleistas!");
console.log("🌐 Portas: " + PORT);
});
