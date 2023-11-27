const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');
const Section = require('../Models/Section')
const Product = require('../Models/Product')

router.post('/category', async (req, res) => {
    try {
        const { title, image } = req.body;
        const category = new Category({ title, image });
        await category.save();
        res.status(201).json({ message: 'Категория успешно добавлена' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Удаление категории по идентификатору (id)
router.delete('/category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: 'Категория успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Редактирование категории по идентификатору (id)
router.put('/category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image } = req.body;
        await Category.findByIdAndUpdate(id, { categoryName: title, image });
        res.status(200).json({ message: 'Категория успешно обновлена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// Добавление раздела
router.post('/section', async (req, res) => {
    try {
        const { categoryID, sectionName } = req.body;

        if (!categoryID) {
            return res.status(400).json({ status: "Идентификатор категории отсутствует" });
        }

        if (!sectionName) {
            return res.status(400).json({ status: "Название раздела отсутствует" });
        }

        const section = new Section({
            sectionName: sectionName,
            category: categoryID
        });

        await section.save();

        const category = await Category.findById(categoryID);

        if (!category) {
            return res.status(404).json({ status: "Категория не найдена" });
        }

        category.sections.push(section._id);
        await category.save();

        res.status(201).json({ status: "Раздел успешно добавлен" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
    }
});


// Удаление раздела по идентификатору (id)
router.delete('/section/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Section.findByIdAndDelete(id);
        res.status(200).json({ message: 'Раздел успешно удален' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Редактирование раздела по идентификатору (id)
router.put('/section/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { sectionName, categoryId } = req.body;
        await Section.findByIdAndUpdate(id, { sectionName, category: categoryId });
        res.status(200).json({ message: 'Раздел успешно обновлен' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавление продукта
router.post('/product', async (req, res) => {
    try {
        const { array, sectionID } = req.body;
        const products = await Product.insertMany(array);

        const section = await Section.findById(sectionID);
        if (!section) {
            return res.status(404).json({ status: 'Section exists' });
        }

        products.forEach(product => {
            section.products.push(product._id);
        });

        await section.save();

        res.status(201).json({ status: 'Products added successfully' })
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: `${e}` });
    }
});
// Deleting a product by its identifier (id)
router.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Updating a product by its identifier (id)
router.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, imageUrl, liked, isOnSale, oldPrice, newPrice, text, containerVolume, section } = req.body;
        await Product.findByIdAndUpdate(id, { title, imageUrl, liked, isOnSale, oldPrice, newPrice, text, containerVolume, section });
        res.status(200).json({ message: 'Product successfully updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/product/liked/:id', async (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;

  try {
    await Product.findByIdAndUpdate(id, { liked: liked });
    res.status(200).json({ message: 'Product successfully updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/product/isOnSale/:id', async (req, res) => {
  const { id } = req.params;
  const { isOnSale } = req.body;

  try {
    await Product.findByIdAndUpdate(id, { isOnSale: isOnSale });
    res.status(200).json({ message: 'Product successfully updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/products/popular', async (req, res) => {
    try {
        const popularProducts = await Product.find({ liked: true });
        res.status(200).json({ popularProducts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/getAllProducts', async (req, res) => {
    try {
        const products = await Category.find().populate({
            path: 'sections',
            populate: {
                path: 'products',
                model: 'Product'
            }
        });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/products/new', async (req, res) => {
    try {
        const newProducts = await Product.find().sort({ _id: -1 }).limit(10);
        res.status(200).json({ newProducts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/products/sale', async (req, res) => {
    try {
        const onSaleProducts = await Product.find({ isOnSale: true });
        res.status(200).json({ onSaleProducts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/section/find/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const section = await Section.findById(id)
            .populate('products');
        if (!section) {
            return res.status(404).json({ status: 'Section not found' });
        }
        res.status(200).json({ section });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/category/find/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ status: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/category/findAll/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id).populate({
          path: 'sections',
          populate: {
            path: 'products',
          }
        });
        res.status(200).json({category})
    } catch(e) {
        console.log(e)
    }
});
router.get('/section/:id', async (req, res) => {
    try {
        const section = await Section.find()
            .populate('products');
        res.json(section);
    } catch (e) {
        console.log(e);
    }
})
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/product/find/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ status: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/actions', async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('sections');
        res.json(categories);
    } catch (e) {
        console.log(e);
    }
});
router.get('/search/:request', async (req, res) => {
    try {
        const { request } = req.params;
        const regex = new RegExp(request, 'i');
        const products = await Product.find({ title: regex }).exec();
        res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});




module.exports = router;
