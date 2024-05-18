import fs from "fs";
class MessageManager {
  path;
  constructor(path) {
    this.path = path;
    console.log(this.path);
    if (fs.existsSync(this.path)) {
      this.message = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      console.log("existe el archivo de users");
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.users));
      console.log("no existe el archivo de users");
    }
  }
  getAll = async () => {
    const messagefile = await fs.promises.readFile(this.path, "utf-8");
    const message = await JSON.parse(messagefile);
    this.message = message;
    return limit ? this.message.slice(0, limit) : this.message;
  };

  addMessage = async (message) => {
    // const message = {
    //   nombre: nombre,
    //   message: this.message,
    // };

    this.message.push(message);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.message, null, "\t")
    );
    return message;
  };
}

export default MessageManager;
