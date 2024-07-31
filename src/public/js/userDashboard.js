document.addEventListener("DOMContentLoaded", () => {
  // Logout button
  document.getElementById("logout").addEventListener("click", () => {
    window.location.href = "/api/sessions/logout";
  });

  // Handle delete user buttons
  const deleteButtons = document.querySelectorAll(".delete-user");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.getAttribute("data-id");

      if (userId) {
        try {
          const response = await fetch(`/api/user/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            // Eliminar el elemento del DOM si la solicitud fue exitosa
            event.target.parentElement.remove();
            alert("Usuario eliminado exitosamente.");
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
          alert("Hubo un error al intentar eliminar el usuario.");
        }
      }
    });
  });

  // Handle edit role buttons
  const editRoleButtons = document.querySelectorAll(".edit-rol");

  editRoleButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.getAttribute("data-id");

      if (userId) {
        try {
          const response = await fetch(`/api/users/premium/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            alert("Rol editado exitosamente.");
            // Refrescar la página después de editar el rol
            window.location.reload();
          } else {
            const errorData = await response.json();
            alert(
              "Error: El usuario no cuenta con los documentos para cambiar de User a Premium"
            );
          }
        } catch (error) {
          console.error("Error al cambiar el rol del usuario:", error);
          alert("Hubo un error al intentar cambiar el rol del usuario.");
        }
      }
    });
  });
});
