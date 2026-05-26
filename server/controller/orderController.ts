import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

//Create order
export const createOrder = async (req : Request, res : Response) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Check if order items are empty
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    }

    // Look up actual price from database
    const productIds = items.map((item: any) => item.product);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });
    const productMap: Record<string, (typeof products)[0]> = {};

    products.forEach((product: any) => (productMap[product.id] = product));

    for (const item of items) {
        const product = productMap[item.product];
        if (!product || (product.stock ?? 0) < item.quantity) {
            return res.status(400).json({ message: `Product ${item.product} is out of stock` });
        }
    }

    const orderItems = items.map((item: any) => {
        const dbProduct = productMap[item.product];
        if (!dbProduct) {
            throw new Error(`Product with ID ${item.product} not found`);
        }
        return {
            product: dbProduct.id,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price,
            quantity: item.quantity,
            unit: dbProduct.unit,
        }
    });

    const subtotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.07 * 100) / 100; // 7% tax
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100; // round to 2 decimal places

    const order = await prisma.order.create({
        data: {
            userId: req.user!.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }],
        }
    })

    if (paymentMethod === "card") {
        // payhere link
    }

    res.status(201).json(order);

    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.product },
            data: { stock: { decrement: item.quantity } },
        });
    }

    // Send stock update events for each product in the order
    for (const item of orderItems) {
        await inngest.send({
            name: "inventory/stock-updated",
            data: { productId: item.product},
        });
    }

    await inngest.send({
        name: "orders/placed",
        data: { orderId: order.id },
    });
    
}

// Get user's orders
// Get /api/orders
export const getUserOrders = async (req : Request, res : Response) => {
    const { status } = req.query;

    const where: any = { 
        userId: req.user!.id,
        NOT: [{paymentMethod: "card", isPaid: false}] // exclude unpaid card orders
    };

    if (status && status !== "all") {
        where.status = status;
    }

    const orders = await prisma.order.findMany({
        where,
        include: {deliveryPartner: { select: { name: true, phone: true } }},
        orderBy: { createdAt: "desc" },
    });

    res.json(orders);
}

// Get single order details
// Get /api/orders/:id
export const getOrder = async (req : Request, res : Response) => {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
        where: { id : id as string, userId: req.user!.id },
        include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } },
    });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
}

// Update order status
// Put /api/orders/:id/status
export const updateOrderStatus = async (req : Request, res : Response) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const order = await prisma.order.findUnique({
        where: { id: id as string},
    });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[];
    history.push({ status, note: note || `Order ${status.toLowerCase()}`, timestamp: new Date() });

    const updatedOrder = await prisma.order.update({
        where: { id: id as string },
        data: {
            status,
            statusHistory: history
        },
    });

    res.json(updatedOrder);
}

// get all orders
export const getAllOrders = async (req : Request, res : Response) => {
    const orders = await prisma.order.findMany({
        where: { NOT: [{paymentMethod: "card", isPaid: false}] // exclude unpaid card orders
        },
        include: { 
            user: { select: { name: true, email: true } },
            deliveryPartner: { select: { name: true, phone: true } }
        },
        orderBy: { createdAt: "desc" },
    });

    res.json(orders);
}

// get order location for live tracking
export const getOrderLocation = async (req : Request, res : Response) => {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
        where: { id : id as string, userId: req.user!.id },
        select: { liveLocation: true, status: true },
    });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({ liveLocation: order.liveLocation, status: order.status });
}