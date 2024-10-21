import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { getAvailableProducts, getProducts, getSales, updateProduct } from '../Services/products.sercices';

const ModalEditProducts = ({ showModalEdit, setShowModalEdit, productToEdit, idToEdit, setProducts,setProductsAvailable,setSales}) => {
    const [editProduct, setEditProduct] = useState({
        product_name: '',
        reference: '',
        price: '',
        weight: '',
        category: '',
        stock: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productToEdit) {
            setEditProduct({
                product_name: productToEdit.product_name || '',
                reference: productToEdit.reference || '',
                price: productToEdit.price || '',
                weight: productToEdit.weight || '',
                category: productToEdit.category || '',
                stock: productToEdit.stock || '',
            });
        }
    }, [productToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProduct({
            ...editProduct,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!editProduct.product_name) tempErrors.product_name = 'El nombre es obligatorio';
        if (!editProduct.reference) tempErrors.reference = 'La referencia es obligatoria';
        if (!editProduct.price || isNaN(editProduct.price)) tempErrors.price = 'El precio debe ser un número';
        if (!editProduct.weight || isNaN(editProduct.weight)) tempErrors.weight = 'El peso debe ser un número';
        if (!editProduct.category) tempErrors.category = 'La categoría es obligatoria';
        if (!editProduct.stock || isNaN(editProduct.stock)) tempErrors.stock = 'El stock debe ser un número';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const updateProd = await updateProduct(editProduct.product_name, editProduct.reference, editProduct.price, editProduct.weight, editProduct.category, editProduct.stock, idToEdit)
            if (updateProd && updateProd.message === 'producto actualizado') {
                const data = await getProducts();
                setProducts(data);
                const availableProd = await getAvailableProducts();
                setProductsAvailable(availableProd);
                const dataSales = await getSales();
                setSales(dataSales);
                setShowModalEdit(!showModalEdit);
            }
        }
    };

    return (
        <Modal show={showModalEdit} onHide={() => setShowModalEdit(!showModalEdit)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del producto</Form.Label>
                        <Form.Control
                            type="text"
                            name="product_name"
                            value={editProduct.product_name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.product_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.product_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Referencia</Form.Label>
                        <Form.Control
                            type="text"
                            name="reference"
                            value={editProduct.reference}
                            onChange={handleInputChange}
                            isInvalid={!!errors.reference}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reference}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={editProduct.price}
                            onChange={handleInputChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Peso</Form.Label>
                        <Form.Control
                            type="number"
                            name="weight"
                            value={editProduct.weight}
                            onChange={handleInputChange}
                            isInvalid={!!errors.weight}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.weight}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            type="text"
                            name="category"
                            value={editProduct.category}
                            onChange={handleInputChange}
                            isInvalid={!!errors.category}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={editProduct.stock}
                            onChange={handleInputChange}
                            isInvalid={!!errors.stock}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stock}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Guardar Cambios
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalEditProducts;
