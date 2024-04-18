import bcrypt from 'bcrypt';

class Login {
    constructor(username, password,database) {
        this.username = username;
        this.password = password;
        this.database = database;
    }

    async verifyCredentials(username, password) {
        try {
            // Buscar el usuario por nombre de usuario
            const user = await this.searchUser(username);
            if (!user) {
                console.error('Usuario no encontrado');
                return false;
            }

            // Verificar la contraseña
            const isValidPassword = await this.checkPassword(user, password);
            if (!isValidPassword) {
                console.error('Contraseña incorrecta');
                return false;
            }

            // Credenciales válidas
            console.log('Credenciales válidas');
            return true;
        } catch (error) {
            console.error('Error al verificar credenciales:', error);
            return false;
        }
    }

    async searchUser(username) {
        try {
            this.database.use("users")
            // Obtener el usuario por nombre de usuario
            const users = await this.database.getByAttribute('username', username);
            return users.length > 0 ? users[0] : null;
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            return null;
        }
    }

    async checkPassword(user, password) {
        try {
            // Verificar la contraseña utilizando bcrypt
            return password== user.password;
        } catch (error) {
            console.error('Error al verificar contraseña:', error);
            return false;
        }
    }
}

export default Login;
