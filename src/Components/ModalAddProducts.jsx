import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { createProduct, getAvailableProducts, getProducts, getSales } from '../Services/products.sercices';
import Swal from 'sweetalert2';

const ModalAddProducts = ({setProducts,showModalAdd,setShowModalAdd,setProductsAvailable, setSales}) => {
    
    const [errors, setErrors] = useState({});
    const [addProducts, setAddProducts] = useState({
        product_name: '',
        reference: '',
        price: '',
        weight: '',
        category: '',
        stock: '',
    });

    const handleClose = () => setShowModalAdd(!showModalAdd);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddProducts({
            ...addProducts,
            [name]: value
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!addProducts.product_name) tempErrors.product_name = 'El nombre del producto es obligatorio';
        if (!addProducts.reference) tempErrors.reference = 'La referencia es obligatoria';
        if (!addProducts.price || isNaN(addProducts.price)) tempErrors.price = 'El precio debe ser un número válido';
        if (!addProducts.weight || isNaN(addProducts.weight)) tempErrors.weight = 'El peso debe ser un número válido';
        if (!addProducts.category) tempErrors.category = 'La categoría es obligatoria';
        if (!addProducts.stock || isNaN(addProducts.stock)) tempErrors.stock = 'El stock debe ser un número válido';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const createProd = await createProduct(
                    addProducts.product_name,
                    addProducts.reference,
                    addProducts.price,
                    addProducts.weight,
                    addProducts.category,
                    addProducts.stock
                );
                if (createProd) {                    
                    const data = await getProducts();
                    setProducts(data);
                    const availableProd = await getAvailableProducts();
                    setProductsAvailable(availableProd);
                    const dataSales = await getSales();
                    setSales(dataSales);
                    setAddProducts({
                        product_name: '',
                        reference: '',
                        price: '',
                        weight: '',
                        category: '',
                        stock: ''
                    });
                    setErrors({});
                    Swal.fire({
                    
                        icon: "success",
                        title: "Producto almacenado",
                        showConfirmButton: false,
                        timer: 1500
                      });
                      setShowModalAdd(!showModalAdd)
                }
            } catch (error) {
                console.log('Error al crear producto', error.message);
            }
        }
    };
    
    return (
        <>
            <Modal show={showModalAdd} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="col-12">
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del producto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="product_name"
                                        value={addProducts.product_name || ''}
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
                                        value={addProducts.reference || ''}
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
                                        type="text"
                                        name="price"
                                        value={addProducts.price || ''}
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
                                        type="text"
                                        name="weight"
                                        value={addProducts.weight || ''}
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
                                        value={addProducts.category || ''}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.category}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.category}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="stock"
                                        value={addProducts.stock || ''}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.stock}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.stock}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Agregar Producto
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalAddProducts
