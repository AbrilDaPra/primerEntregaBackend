import User from '../models/users.model.js';

class UserManager {
    constructor(){}

    async registerUser(user){
        try{
            const exist = await User.findOne({ email: user.email });

            if(exist) {
                throw new Error("The email already exists");
            }

            const newUser = await User.create(user);
            return newUser;
        } catch (err) {
            throw new Error("Error registering user: " + err.message);
        }
    }

    async logInUser(email, password){
        try{
            const user = await User.findOne({ email: email });
            if(!user){
                throw new Error("Error with credentials");
            }

            const isValidPassword = await this.isValidPassword(user, password);
            if (!isValidPassword) {
                throw new Error("Error with credentials");
            }

            return {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
            };
        } catch (err) {
            throw new Error("Error logging in: " + err.message);
        }
    }
}

export default UserManager;