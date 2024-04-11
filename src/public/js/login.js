const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("inicio sesion");
      // Aquí podrías redirigir al usuario a otra página si el inicio de sesión fue exitoso
      window.location.href = "/"; // Por ejemplo, redirigir a la página principal
    } else {
      const errorMessage = await response.text(); // Obtener el mensaje de error del servidor
      throw new Error(errorMessage || "Error en el inicio de sesión");
    }
  } catch (error) {
    console.error("Error en la solicitud Fetch:", error);
    // Mostrar un mensaje de error al usuario
    alert(
      "Error en el inicio de sesión. Por favor, inténtalo de nuevo más tarde."
    );
  }
});
