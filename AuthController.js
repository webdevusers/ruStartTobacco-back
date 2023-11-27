const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')
const Product = require('../../Products/Models/Product')
const { hashSync, compareSync } = require("bcrypt");

const generateToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, "jXSFM1kfpDMF7RB7", { expiresIn: '24h' })
}

class AuthController {
    async registration(req, res) {
        try {
            const { name, surname, email, phone, password, roles } = req.body;
            if (!name && !surname && !email && !phone && !password && !roles) {
                res.status(400).json({ status: 400 })
            }
            const hashPassword = hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'Пользователь' })
            const user = await new User({
                name,
                surname,
                email,
                phone,
                password: hashPassword,
                roles: [userRole.value]
            }).save();

            return res.status(200).send(user)
        } catch (e) {
            console.log(e)
        }
    }

    async authorization(req, res) {
        try {
            const { email, password } = req.body;
            if (!email) {
                res.status(401).json({ status: 'Email' })
            }
            const user = await User.findOne({ email })

            if (!user) {
                res.status(401).json({ status: 'user' })
            }
            const validPass = compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({ status: 'Password incorrect' })
            }
            const token = generateToken(user._id)

            res.status(200).json({ token })
        } catch (e) {
            console.log(e)
        }
    }
    async changeRole(req, res) {
        const { id, role } = req.body;

        try {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.roles = [role];
            await user.save();

            return res.status(200).json({ message: 'User role changed successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (e) {
            console.log(e)
        }
    }
    async verify(req, res) {
        const { token } = req.body;

        try {
            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id
            res.status(200).json({ id })
        } catch (e) {
            console.log(e)
        }
    }
    async likedProduct(req, res) {
        try {
            const { userID, productID } = req.body;

            const user = await User.findById(userID);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.liked.push({ productID });
            await user.save();

            return res.status(200).json({ message: 'Product liked successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async dislikeProduct(req, res) {
        try {
            const { userID, productID } = req.body;

            const user = await User.findById(userID);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.liked = user.liked.filter(item => item.productID !== productID);
            await user.save();

            return res.status(200).json({ message: 'Product disliked successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUser(req, res) {
        try {
            const { token } = req.body;

            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id

            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({ status: "exist" })
            }
            res.status(200).json({ user })

        } catch (e) { console.log(e) }
    }
    async editUser(req, res) {
        const { id, updatedData } = req.body;

        const user = await User.findById(id)

        user.name = updatedData.name
        user.surname = updatedData.surname
        user.email = updatedData.email
        user.phone = updatedData.phone
    }
    async addOrder(req, res) {
        try {
            const { token, Object } = req.body;

            const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7")
            const id = decoded.id

            const user = await User.findById(id)

            if (!user) {
                res.status(400).json({ status: "exist" })
            }

            user.orders.push(Object)

            await user.save()
        } catch (e) {
            console.log(e)
        }
    }
    async getFavoriteProducts(req, res) {
        const { token } = req.body;
    
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const id = decoded.id;
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const favoriteProductIds = user.liked.map(like => like.productID);
    
        try {
            const favoriteProducts = await Product.find({ _id: { $in: favoriteProductIds } });
            res.json({ favoriteProducts });
        } catch (error) {
            console.error("Error fetching favorite products:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getViewedProducts(req, res) {
        const { token } = req.body;
    
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const id = decoded.id;
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        const viewedProductIds = user.views.map(view => view.productID);
    
        try {
            const viewedProducts = await Product.find({ _id: { $in: viewedProductIds } });
            res.json({ viewedProducts });
        } catch (error) {
            console.error("Error fetching viewed products:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async addViews(req, res) {
        const { token, productId } = req.body;

    try {
        const decoded = jwt.verify(token, "jXSFM1kfpDMF7RB7");
        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.views.push({ productId });
        await user.save();

        res.json({ success: true, message: "Product added to views" });
    } catch (error) {
        console.error("Error adding viewed product:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
}

module.exports = new AuthController();