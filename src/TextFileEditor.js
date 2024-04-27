import { promises as fs } from 'fs';

class TextFileEditor {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return data;
    } catch (err) {
      // Si el error es debido a que el archivo no existe, lo creamos
      if (err.code === 'ENOENT') {
        console.log(`El archivo ${this.filePath} no existe. Creando el archivo...`);
        await this.write('');
        return ''; // Devolvemos una cadena vacía ya que el archivo acaba de ser creado
      } else {
        throw err;
      }
    }
  }

  async write(content) {
    try {
      await fs.writeFile(this.filePath, content, 'utf8');
    } catch (err) {
      throw err;
    }
  }

  async append(content) {
    try {
      await fs.appendFile(this.filePath, content, 'utf8');
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    try {
      await fs.unlink(this.filePath);
    } catch (err) {
      throw err;
    }
  }
}

export default TextFileEditor;