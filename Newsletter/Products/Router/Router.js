const express = require("express");
const router = express.Router();
const Category = require("../Models/Category");
const Section = require("../Models/Section");
const Product = require("../Models/Product");

//  Имба, которая спасла мне когда-то жизнь
const transliterate = (text) => {
    if (!text) {
        return '';
    }

    const transliterationMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'і': 'i', 'ї': 'yi', 'є': 'ie', 'ґ': 'g',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'І': 'I', 'Ї': 'Yi', 'Є': 'Ie', 'Ґ': 'G',
        ' ': '_',
    };

    return text.split('').map(char => transliterationMap[char] || char).join('');
};
const updateAllUrlLinks = async () => {
    try {
        const categories = await Category.find();
        const sections = await Section.find();
        const products = await Product.find();

        const updateUrlLink = async (model, type, titleField) => {
            for (const item of model) {
                const urlLink = transliterate(item[titleField]);
                item.urlLink = urlLink;
                await item.save();
            }
            console.log(`UrlLinks updated successfully for all ${type}`);
        };

        await Promise.all([
            updateUrlLink(categories, 'categories', 'title'),
            updateUrlLink(sections, 'sections', 'sectionName'),
            updateUrlLink(products, 'products', 'title'),
        ]);

        console.log('All UrlLinks updated successfully');
    } catch (error) {
        console.error('Error updating UrlLinks:', error);
    }
};
router.post("/category", async (req, res) => {
  try {
    const { title, image } = req.body;
    const urlLink = transliterate(title);
    const category = new Category({ title, image, urlLink });
    await category.save();
    res.status(201).json({ message: "Категория успешно добавлена" });
  } catch (error) {
    res.status(500).json({ error });
  }
});


//  Имба, которая спасла мне когда-то жизнь

router.get("/updateCategories", async (req, res) => {
    try {
        await updateAllUrlLinks();
        res.status(999).json({ idinahui4ert: "ha-ha-ha" });
    } catch (error) {
        console.error("Error in updating UrlLinks:", error);
        res.status(500).json({ error: "Server error" });
    }
});
// Удаление категории по идентификатору (id)
router.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Категория успешно удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Редактирование категории по идентификатору (id)
router.put("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image } = req.body;
    await Category.findByIdAndUpdate(id, { categoryName: title, image });
    res.status(200).json({ message: "Категория успешно обновлена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
// Добавление раздела
router.post("/section", async (req, res) => {
  try {
    const { categoryID, sectionName } = req.body;

    if (!categoryID) {
      return res
        .status(400)
        .json({ status: "Идентификатор категории отсутствует" });
    }

    if (!sectionName) {
      return res.status(400).json({ status: "Название раздела отсутствует" });
    }

    const section = new Section({
      sectionName: sectionName,
      category: categoryID,
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
router.delete("/section/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Section.findByIdAndDelete(id);
    res.status(200).json({ message: "Раздел успешно удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Редактирование раздела по идентификатору (id)
router.put("/section/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionName, categoryId } = req.body;
    await Section.findByIdAndUpdate(id, { sectionName, category: categoryId });
    res.status(200).json({ message: "Раздел успешно обновлен" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавление продукта
router.post("/product", async (req, res) => {
  try {
    const { array, sectionID } = req.body;
    const products = await Product.insertMany(array);

    const section = await Section.findById(sectionID);
    if (!section) {
      return res.status(404).json({ status: "Section exists" });
    }

    products.forEach(async (product) => {
      section.products.push(product._id);

      product.urlLink = transliterate(product.title);
      await product.save();
    });

    await section.save();

    res.status(201).json({ status: "Products added successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: `${e}` });
  }
});
// Deleting a product by its identifier (id)
router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Updating a product by its identifier (id)
router.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      imageUrl,
      liked,
      isOnSale,
      oldPrice,
      newPrice,
      text,
      containerVolume,
      section,
    } = req.body;
    await Product.findByIdAndUpdate(id, {
      title,
      imageUrl,
      liked,
      isOnSale,
      oldPrice,
      newPrice,
      text,
      containerVolume,
      section,
    });
    res.status(200).json({ message: "Product successfully updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/product/liked/:id", async (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;

  try {
    await Product.findByIdAndUpdate(id, { liked: liked });
    res.status(200).json({ message: "Product successfully updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/product/isOnSale/:id", async (req, res) => {
  const { id } = req.params;
  const { isOnSale } = req.body;

  try {
    await Product.findByIdAndUpdate(id, { isOnSale: isOnSale });
    res.status(200).json({ message: "Product successfully updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Retrieving popular products
router.get("/products/popular", async (req, res) => {
  try {
    const popularProducts = await Product.find({ liked: true });
    res.status(200).json({ popularProducts });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Category.find().populate({
      path: "sections",
      populate: {
        path: "products",
        model: "Product",
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Retrieving new products
router.get("/products/new", async (req, res) => {
  try {
    const newProducts = await Product.find().sort({ _id: -1 }).limit(10);
    res.status(200).json({ newProducts });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Retrieving on-sale products
router.get("/products/sale", async (req, res) => {
  try {
    const onSaleProducts = await Product.find({ isOnSale: true });
    res.status(200).json({ onSaleProducts });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Retrieving a section by its identifier (id)
router.get("/section/find/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findOne({urlLink: id}).populate("products");
    if (!section) {
      return res.status(404).json({ status: "Section not found" });
    }
    res.status(200).json({ section });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Retrieving a category by its identifier (id)
router.get("/category/find/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({urlLink: id});
    if (!category) {
        let newcategory = await Category.findById(id);

        if (!newcategory)  {
            res.status(404).json({category: null})
        }
        res.status(200).json({newcategory})
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/category/findAll/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findOne({urlLink: id}).populate({
      path: "sections",
      populate: {
        path: "products",
      },
    });
    if (!category) {
        let category = await Category.findById(id).populate({
            path: "sections",
            populate: {
                path: "products"
            }
        });

        if (!category)  {
            res.status(404).json({category: null})
        }
        res.status(200).json({category})
    }
    res.status(200).json({ category });
  } catch (e) {
    console.log(e);
  }
});
// Получение раздела
router.get("/section/:id", async (req, res) => {
  try {
    const section = await Section.find().populate("products");
    res.json(section);
  } catch (e) {
    console.log(e);
  }
});
// Retrieving all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Retrieving a product by its identifier (id)
router.get("/product/find/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Searching for product with urlLink:', id);
  
      const product = await Product.findOne({ urlLink: id });
      if (!product) {
        console.log('Product not found');
        return res.status(404).json({ status: "Product not found" });
      }
  
      console.log('Product found:', product);
      res.status(200).json({ product });
    } catch (error) {
      console.error('Error searching for product:', error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
router.get("/actions", async (req, res) => {
  try {
    const categories = await Category.find().populate("sections");
    res.json(categories);
  } catch (e) {
    console.log(e);
  }
});
router.get("/search/:request", async (req, res) => {
  try {
    const { request } = req.params;
    const regex = new RegExp(request, "i");
    const products = await Product.find({ title: regex }).exec();
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
