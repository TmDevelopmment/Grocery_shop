import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { originalPrice: "desc" },
    });

    const productWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return {
            ...p,
            discount,
        };
    });

    res.json({ products: productWithDiscount.slice(0, 8) });
};

// Get /api/products
export const getProducts = async (req: Request, res: Response) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const where: any = { stock: { gt: 0 } };

    if (category && category !== "all") {
        where.category = category as string;
    }
    if (search) {
        where.name = { contains: search as string, mode: "insensitive" };
    }
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any = {};
    if (sort === "price-low") orderBy.price = "asc";
    else if (sort === "price-high") orderBy.price = "desc";
    else if (sort === "newest") orderBy.createdAt = "desc";
    else orderBy.createdAt = "desc";

    const products = await prisma.product.findMany({ where, orderBy });

    const productWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return {
            ...p,
            discount
        };
    });

    res.json({products: productWithDiscount});
}

// Get /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: id as string } });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    res.json({ product: { ...product, discount } });
}

// Post /api/products
export const createProduct = async (req: Request, res: Response) => {
    
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json({ message: "Product created successfully", product });
}

// Put /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.update({ where: { id: id as string }, data: req.body });
    res.json({ message: "Product updated successfully", product });
}

// Delete /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: id as string } });
    res.json({ message: "Product deleted successfully" });
}