const products = [
{
name: "Axolotl Rėmėjas",
icon: "🦎",
price: "2.99 €",
description: "Palaikyk Axolotl Network ir gauk išskirtines privilegijas.",
features: [
"⭐ Rėmėjo statusas",
"🎨 Speciali žinutė",
"🦎 Axolotl privilegijos"
]
},
{
name: "Warden Rėmėjas",
icon: "🛡️",
price: "4.99 €",
description: "Galingesnis rėmėjo rangas tikriems serverio palaikytojams.",
features: [
"⭐ Warden statusas",
"⚡ Papildomos privilegijos",
"🛡️ Warden išskirtinumas"
]
},
{
name: "Fox Rėmėjas",
icon: "🦊",
price: "7.99 €",
description: "Išskirtinis Fox rangas ir daugiau privilegijų.",
features: [
"⭐ Fox statusas",
"🦊 Fox privilegijos",
"✨ Išskirtinis rangas"
]
},
{
name: "Papūga Rėmėjas",
icon: "🦜",
price: "10.00 €",
description: "Aukščiausias iš šių rėmėjo rangų.",
features: [
"⭐ Papūga statusas",
"🦜 Papūgos privilegijos",
"👑 Aukščiausias rangas"
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
if (!productsContainer) {
console.error("Nerastas #products elementas.");
return;
}

productsContainer.innerHTML = "";

products.forEach((product, index) => {
const card = document.createElement("div");

```
card.className = "card";

if (index === 1) {
  card.classList.add("featured");
}

card.innerHTML = `
  ${index === 1 ? '<div class="badge">POPULIARIAUSIAS</div>' : ""}

  <div class="icon">${product.icon}</div>

  <h2>${product.name}</h2>

  <p>${product.description}</p>

  <div class="price">
    ${product.price}
    <small> / vieną kartą</small>
  </div>

  <ul>
    ${product.features
      .map(feature => `<li>✓ ${feature}</li>`)
      .join("")}
  </ul>

  <button class="buy" type="button">
    🫧 Pasirinkti
  </button>
`;

const button = card.querySelector(".buy");

button.addEventListener("click", () => {
  selectProduct(product);
});

productsContainer.appendChild(card);
```

});
}

function selectProduct(product) {
selectedProduct = product;

if (chosen) {
chosen.textContent = product.name;
}

if (chosenPrice) {
chosenPrice.textContent = product.price;
}

if (message) {
message.innerHTML = "";
}

const shop = document.getElementById("shop");

if (shop) {
shop.classList.add("hidden");
}

if (checkout) {
checkout.classList.remove("hidden");
}

window.scrollTo({
top: 0,
behavior: "smooth"
});
}

function back() {
if (checkout) {
checkout.classList.add("hidden");
}

const shop = document.getElementById("shop");

if (shop) {
shop.classList.remove("hidden");
}

window.scrollTo({
top: 0,
behavior: "smooth"
});
}

function pay() {
const nickInput = document.getElementById("nick");

if (!nickInput || !message) {
return;
}

const nick = nickInput.value.trim();

if (!nick) {
message.innerHTML = `       <div class="success">
        ❌ Įrašyk savo Minecraft nick.       </div>
    `;

```
return;
```

}

if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
message.innerHTML = `       <div class="success">
        ❌ Minecraft nick turi būti 3–16 simbolių.       </div>
    `;

```
return;
```

}

if (!selectedProduct) {
return;
}

message.innerHTML = ` <div class="success">
✅ Užsakymas paruoštas!<br><br>

```
  <strong>${selectedProduct.name}</strong><br>

  Minecraft nick:
  <strong>${nick}</strong><br>

  Kaina:
  <strong>${selectedProduct.price}</strong>

  <br><br>

  🫧 DEMO režimas —
  tikras mokėjimas dar neprijungtas.
</div>
```

`;

nickInput.value = "";
}

window.back = back;
window.pay = pay;

renderProducts();
