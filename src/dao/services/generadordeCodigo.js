function generateUniqueCode() {
  // Obtenemos la marca de tiempo actual en milisegundos
  const timestamp = Date.now().toString();
  // Generamos un número aleatorio de 4 dígitos
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  // Concatenamos la marca de tiempo con el número aleatorio
  const uniqueCode = timestamp + randomNumber;
  return uniqueCode;
}

export default generateUniqueCode;
