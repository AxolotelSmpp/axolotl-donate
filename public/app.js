const products = [
{
name: "Axolotl Rėmėjas",
icon: "🦎",
price: "2.99 €",
description: "Palaikyk Axolotl Network ir gauk išskirtines privilegijas.",
features: [
"Rėmėjo statusas",
"Speciali žinutė",
"Axolotl privilegijos"
]
},
{
name: "Warden Rėmėjas",
icon: "🛡️",
price: "4.99 €",
description: "Galingesnis rėmėjo rangas tikriems serverio palaikytojams.",
features: [
"Warden statusas",
"Papildomos privilegijos",
"Warden išskirtinumas"
]
},
{
name: "Fox Rėmėjas",
icon: "🦊",
price: "7.99 €",
description: "Išskirtinis Fox rangas ir daugiau privilegijų.",
features: [
"Fox statusas",
"Fox privilegijos",
"Išskirtinis rangas"
]
},
{
name: "Papūga Rėmėjas",
icon: "🦜",
price: "10.00 €",
description: "Aukščiausias iš šių rėmėjo rangų.",
features: [
"Papūga statusas",
"Papūgos privilegijos",
"Aukščiausias rangas"
]
}
];

const productsContainer = document.getElementById("products");
const checkout = document.getElementById("checkout");
const chosen = document.getElementById("chosen");
const chosenPrice = document.getElementById("chosenPrice");
const message = document.getElementById("message");

let selectedProduct = null;

function renderProducts() {
products.forEach(function(product, index) {

```
const card = document.createElement("div");
card.className = "card";

if (index === 1) {
  card.className = "card featured";
}

const icon = document.createElement("div");
icon.className = "icon";
icon.textContent = product.icon;

const title = document.createElement("h2");
title.textContent = product.name;

const description = document.createElement("p");
description.textContent = product.description;

const price = document.createElement("div");
price.className = "price";
price.textContent = product.price;

const list = document.createElement("ul");

product.features.forEach(function(feature) {
  const item = document.createElement("li");
  item.textContent = "✓ " + feature;
  list.appendChild(item);
});

const button = document.createElement("button");
button.className = "buy";
button.type = "button";
button.textContent = "🫧 Pasirinkti";

button.onclick = function() {
  selectProduct(product);
};

card.appendChild(icon);
card.appendChild(title);
card.appendChild(description);
card.appendChild(price);
card.appendChild(list);
card.appendChild(button);

productsContainer.appendChild(card);
```

});
}

function selectProduct(product) {
selectedProduct = product;

chosen.textContent = product.name;
chosenPrice.textContent = product.price;

message.textContent = "";

document.getElementById("shop").classList.add("hidden");
checkout.classList.remove("hidden");

window.scrollTo(0, 0);
}

function back() {
checkout.classList.add("hidden");
document.getElementById("shop").classList.remove("hidden");

window.scrollTo(0, 0);
}

function pay() {
const nickInput = document.getElementById("nick");
const nick = nickInput.value.trim();

if (!nick) {
message.textContent = "❌ Įrašyk savo Minecraft nick.";
return;
}

if (!selectedProduct) {
return;
}

message.textContent =
"✅ Užsakymas paruoštas! " +
selectedProduct.name +
" — " +
nick +
" — " +
selectedProduct.price +
". DEMO režimas.";

nickInput.value = "";
}

window.back = back;
window.pay = pay;

renderProducts();
