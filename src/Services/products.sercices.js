import { URL_BASE } from "../Constants/constants.js";

export const getProducts = async () => {
    const res = await fetch(`${URL_BASE}getProducts`);
    if (res) {
        return (res.json())
    }
}

export const createProduct = async (product_name, reference, price, weight, category, stock) => {
    const res = await fetch(`${URL_BASE}createProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "product_name": product_name,
            "reference": reference,
            "price": price,
            "weight": weight,
            "category": category,
            "stock": stock
        })
    });
    if (res) {
        return (res.json())
    }
}

export const deleteProduct = async (id) => {
    const res = await fetch(`${URL_BASE}deleteProduct/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res) {
        return (res.json())
    }
}

export const getOneProduct = async (id) => {
    const res = await fetch(`${URL_BASE}getOneProduct/${id}`);
    if (res) {
        return (res.json())
    }
}

export const updateProduct = async (product_name, reference, price, weight, category, stock, id) => {
    const res = await fetch(`${URL_BASE}updateProduct/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "product_name": product_name,
            "reference": reference,
            "price": price,
            "weight": weight,
            "category": category,
            "stock": stock
        })
    });
    if (res) {
        return (res.json())
    }
}



export const getAvailableProducts = async () => {
    const res = await fetch(`${URL_BASE}getAvailableProducts`);
    if (res) {
        return (res.json())
    }
}

export const sellProduct = async (producto_id, quantity) => {
    const res = await fetch(`${URL_BASE}sellProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "producto_id": producto_id,
            "quantity": quantity,
        })
    });
    if (res) {
        return (res.json())
    }
}

export const getSales = async () => {
    const res = await fetch(`${URL_BASE}getSales`);
    if (res) {
        return (res.json())
    }
}
