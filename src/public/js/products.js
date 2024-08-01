document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/api/sessions/logout";
  localStorage.removeItem("cartId");
  localStorage.removeItem("cartItemCount");
});

let cartId = localStorage.getItem("cartId");
let cartItemCount = localStorage.getItem("cartItemCount") || 0;

document.addEventListener("DOMContentLoaded", () => {
  const initializeCartButton = document.getElementById("initializeCart");
  const cartStatusMessage = document.getElementById("cartStatusMessage");
  const cartItemCountElement = document.getElementById("cartItemCount");

  if (cartId) {
    initializeCartButton.disabled = true;
    initializeCartButton.textContent = "Carrito ya creado";
    cartStatusMessage.textContent = "Carrito activo. Puedes agregar productos.";
    cartItemCountElement.textContent = cartItemCount;
  } else {
    cartStatusMessage.textContent =
      "Inicializa tu carrito para comenzar a agregar productos.";
    cartItemCountElement.textContent = "0";
  }
});

document
  .getElementById("initializeCart")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al crear el carrito");
      }
      const data = await response.json();
      cartId = data.payload._id;
      localStorage.setItem("cartId", cartId);
      cartItemCount = 0;
      localStorage.setItem("cartItemCount", cartItemCount);

      const initializeCartButton = document.getElementById("initializeCart");
      initializeCartButton.disabled = true;
      initializeCartButton.textContent = "Carrito ya creado";
      const cartStatusMessage = document.getElementById("cartStatusMessage");
      cartStatusMessage.textContent =
        "Carrito activo. Puedes agregar productos.";
      const cartItemCountElement = document.getElementById("cartItemCount");
      cartItemCountElement.textContent = cartItemCount;

      alert(
        "Carrito creado, ahora puedes comenzar a agregar productos al carrito."
      );
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo inicializar el carrito");
    }
  });

document.querySelectorAll(".addToCart").forEach((button) => {
  button.addEventListener("click", async (event) => {
    if (!cartId) {
      alert("Primero inicializa el carrito");
      return;
    }
    const productId = event.target.getAttribute("data-pid");
    try {
      const response = await fetch(
        `/api/carts/${cartId}/products/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al agregar el producto al carrito");
      }
      const data = await response.json();
      cartItemCount = data.payload.totalQuantity;
      localStorage.setItem("cartItemCount", cartItemCount);
      const cartItemCountElement = document.getElementById("cartItemCount");
      cartItemCountElement.textContent = cartItemCount;
      alert("Producto agregado al carrito con éxito");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo agregar el producto al carrito");
    }
  });
});

// Agrega el evento para finalizar la compra
document
  .getElementById("finalizePurchase")
  .addEventListener("click", async () => {
    if (!cartId) {
      alert("Primero inicializa el carrito");
      return;
    }
    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al finalizar la compra");
      }
      const data = await response.json();
      if (data.productsNoComprados && data.productsNoComprados.length > 0) {
        alert(
          "Algunos productos no pudieron ser comprados debido a stock insuficiente."
        );
      }
      window.location.href = `/checkout?cartId=${cartId}`; // Redirige a la página de checkout con el cartId
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo finalizar la compra");
    }
  });
