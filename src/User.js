import bcrypt from 'bcryptjs';

class User {
    constructor(database) {
        this.database = database;
    }

    async createUser(username, password) {
        try {
            // Check if the user already exists
            const existingUser = await this.findUser(username);
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Generate hash of the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user in the database
            const newUser = {
                username: username,
                password: hashedPassword
            };

            await this.database.saveData(newUser);
            return 'User created successfully';
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async findUser(username) {
        try {
            return await this.database.getByAttribute('username', username);
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    async modifyUser(username, newPassword) {
        try {
            // Check if the user exists
            const user = await this.findUser(username);
            if (!user) {
                throw new Error('User does not exist');
            }

            // Generate hash of the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user's password in the database
            await this.database.updateUser(username, { password: hashedPassword });
            return 'User password updated successfully';
        } catch (error) {
            console.error('Error modifying user:', error);
            throw error;
        }
    }
}

export default User;
