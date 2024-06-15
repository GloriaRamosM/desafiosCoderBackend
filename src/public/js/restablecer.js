document.getElementById("restablecer").addEventListener("click", async () => {
  try {
    const email = document.getElementById("emailInput").value;

    if (!email) {
      throw new Error("Por favor ingresa tu correo electrónico.");
    }

    const response = await fetch("/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error(
        "Hubo un problema al intentar restablecer la contraseña."
      );
    }

    console.log("Contraseña restablecida correctamente");

    // Aquí podrías manejar la respuesta exitosa, como mostrar un mensaje al usuario
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error.message);
    // Aquí podrías manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
  }
});
