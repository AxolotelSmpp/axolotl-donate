const products = [
  {
    name: "Axolotl Rėmėjas",
    icon: "🦎",
    price: "2.99 €",
    description: "Palaikyk Axolotl Network ir gauk išskirtines privilegijas.",
    features: ["Rėmėjo statusas", "Speciali žinutė", "Axolotl privilegijos"]
  },
  {
    name: "Warden Rėmėjas",
    icon: "🛡️",
    price: "4.99 €",
    description: "Galingesnis rėmėjo rangas tikriems serverio palaikytojams.",
    features: ["Warden statusas", "Papildomos privilegijos", "Warden išskirtinumas"]
  },
  {
    name: "Fox Rėmėjas",
    icon: "🦊",
    price: "7.99 €",
    description: "Išskirtinis Fox rangas ir daugiau privilegijų.",
    features: ["Fox statusas", "Fox privilegijos", "Išskirtinis rangas"]
  },
  {
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

let selectedProduct = null;

function renderProducts() {
  productsContainer.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const card = document.createElement("div");
    card.className = "card";

    if (i === 1) {
      card.classList.add("featured");
    }

    card.innerHTML = `
      <div class="icon">${product.icon}</div>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <div class="price">${product.price}</div>
      <ul>
        <li>✓ ${product.features[0]}</li>
        <li>✓ ${product.features[1]}</li>
        <li>✓ ${product.features[2]}</li>
      </ul>
      <button class="buy" type="button">🫧 Pasirinkti</button>
    `;

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
    message.innerHTML = "❌ Įrašyk savo Minecraft nick.";
    return;
  }

  if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) {
    message.innerHTML = "❌ Minecraft nick turi būti 3–16 simbolių.";
    return;
  }

  if (!selectedProduct) {
    return;
  }

  message.innerHTML =
    "✅ Užsakymas paruoštas!<br><br>" +
    "<strong>" + selectedProduct.name + "</strong><br>" +
    "Minecraft nick: <strong>" + nick + "</strong><br>" +
    "Kaina: <strong>" + selectedProduct.price + "</strong><br><br>" +
    "🫧 DEMO režimas — tikras mokėjimas dar neprijungtas.";

  nickInput.value = "";
}

window.back = back;
window.pay = pay;

renderProducts();
