const products = [
{
id: "axolotl",
name: "Axolotl Rėmėjas",
icon: "🦎",
price: "2.99 €",
description: "Palaikyk Axolotl Network ir gauk išskirtines privilegijas.",
features: ["Rėmėjo statusas", "Speciali žinutė", "Axolotl privilegijos"]
},
{
id: "warden",
name: "Warden Rėmėjas",
icon: "🛡️",
price: "4.99 €",
description: "Galingesnis rėmėjo rangas tikriems serverio palaikytojams.",
features: ["Warden statusas", "Papildomos privilegijos", "Warden išskirtinumas"]
},
{
id: "fox",
name: "Fox Rėmėjas",
icon: "🦊",
price: "7.99 €",
description: "Išskirtinis Fox rangas ir daugiau privilegijų.",
features: ["Fox statusas", "Fox privilegijos", "Išskirtinis rangas"]
},
{
id: "parrot",
name: "Papūga Rėmėjas",
icon: "🦜",
price: "10.00 €",
description: "Aukščiausias iš šių rėmėjo rangų.",
features: ["Papūga statusas", "Papūgos privilegijos", "Aukščiausias rangas"]
}
];

const productsContainer = document.getElementById("products");
const checkout = document.getElementById("checkout");
const chosen = document.getElementById("chosen");
const chosenPrice = document.getElementById("chosenPrice");
const message = document.getElementById("message");
const nickInput = document.getElementById("nick");
const paypalContainer = document.getElementById("paypal-button-container");

let selectedProduct = null;
let paypalButtons = null;

function renderProducts() {
productsContainer.innerHTML = "";

for (let i = 0; i < products.length; i++) {
const product = products[i];

const card = document.createElement("div");
card.className = "card";

if (i === 1) {
  card.classList.add("featured");
}

card.innerHTML =
  '<div class="icon">' + product.icon + '</div>' +
  '<h2>' + product.name + '</h2>' +
  '<p>' + product.description + '</p>' +
  '<div class="price">' + product.price + '</div>' +
  '<ul>' +
  '<li>✓ ' + product.features[0] + '</li>' +
  '<li>✓ ' + product.features[1] + '</li>' +
  '<li>✓ ' + product.features[2] + '</li>' +
  '</ul>' +
  '<button class="buy" type="button">🫧 Pasirinkti</button>';

card.querySelector(".buy").addEventListener("click", function () {
  selectProduct(product);
});

productsContainer.appendChild(card);

}
}

function selectProduct(product) {
selectedProduct = product;

chosen.textContent = product.name;
chosenPrice.textContent = product.price;
message.innerHTML = "";
nickInput.value = "";

document.getElementById("shop").classList.add("hidden");
checkout.classList.remove("hidden");

loadPayPal();

window.scrollTo(0, 0);
}

async function loadPayPal() {
paypalContainer.innerHTML = "⏳ Kraunamas PayPal...";

try {
const configResponse = await fetch("/api/paypal/config");
const config = await configResponse.json();

```
if (!config.clientId) {
  paypalContainer.innerHTML = "❌ PayPal Client ID nerastas.";
  return;
}

if (window.paypal) {
  renderPayPalButtons();
  return;
}

const script = document.createElement("script");

script.src =
  "https://www.paypal.com/sdk/js?client-id=" +
  encodeURIComponent(config.clientId) +
  "&currency=EUR";

script.onload = function () {
  renderPayPalButtons();
};

script.onerror = function () {
  paypalContainer.innerHTML =
    "❌ Nepavyko užkrauti PayPal.";
};

document.head.appendChild(script);

} catch (error) {
console.error(error);

```
paypalContainer.innerHTML =
  "❌ Nepavyko prisijungti prie PayPal.";
```

}
}

function renderPayPalButtons() {
if (!window.paypal || !selectedProduct) {
return;
}

paypalContainer.innerHTML = "";

paypalButtons = window.paypal.Buttons({
createOrder: async function () {
const nick = nickInput.value.trim();

```
  if (!nick) {
    message.innerHTML =
      "❌ Pirmiausia įrašyk savo Minecraft nick.";
    throw new Error("Minecraft nick missing");
  }

  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
    message.innerHTML =
      "❌ Minecraft nick turi būti 3–16 simbolių.";
    throw new Error("Invalid Minecraft nick");
  }

  const response = await fetch(
    "/api/paypal/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: selectedProduct.id,
        minecraftName: nick
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    message.innerHTML =
      "❌ " +
      (data.error || "Nepavyko sukurti užsakymo.");

    throw new Error(
      data.error || "Create order failed"
    );
  }

  return data.id;
},

onApprove: async function (data) {
  const nick = nickInput.value.trim();

  message.innerHTML =
    "⏳ Patvirtinamas PayPal mokėjimas...";

  try {
    const response = await fetch(
      "/api/paypal/capture-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: data.orderID,
          productId: selectedProduct.id,
          minecraftName: nick
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      message.innerHTML =
        "❌ " +
        (result.error ||
          "Mokėjimo nepavyko patvirtinti.");
      return;
    }

    message.innerHTML =
      "✅ Mokėjimas sėkmingas!<br><br>" +
      "Rangas: <strong>" +
      result.order.product +
      "</strong><br>" +
      "Minecraft nick: <strong>" +
      result.order.minecraftName +
      "</strong><br><br>" +
      "🦎 Užsakymas: <strong>" +
      result.order.id +
      "</strong>";

    nickInput.value = "";

  } catch (error) {
    console.error(error);

    message.innerHTML =
      "❌ Įvyko klaida patvirtinant mokėjimą.";
  }
},

onCancel: function () {
  message.innerHTML =
    "⚠️ PayPal mokėjimas atšauktas.";
},

onError: function (error) {
  console.error(error);

  message.innerHTML =
    "❌ PayPal klaida. Bandyk dar kartą.";
}

});

paypalButtons.render("#paypal-button-container");
}

function back() {
checkout.classList.add("hidden");
document.getElementById("shop").classList.remove("hidden");

selectedProduct = null;
paypalContainer.innerHTML = "";
message.innerHTML = "";

window.scrollTo(0, 0);
}

window.back = back;

renderProducts();
