import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'
import { deleteProduct, getAvailableProducts, getOneProduct, getProducts, getSales, sellProduct } from './Services/products.sercices';
import { Alert, Button, Form, Tab, Table, Tabs } from 'react-bootstrap';
import Icons from './Components/Icons';
import ModalAddProducts from "./Components/ModalAddProducts";
import ModalEditProducts from './Components/ModalEditProducts';
import Swal from 'sweetalert2';


function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [productToEdit, setProductToEdit] = useState([]);
  const [idToEdit, setIdToEdit] = useState(0);

  const [productsAvailable, setProductsAvailable] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  console.log('sales', sales)

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error al listar los productos:', error.message);
    }
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error al listar los productos:', error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {

      Swal.fire({
        title: `¿Eliminar el producto?`,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `No`
      }).then(async (result) => {

        if (result.isConfirmed) {
          const deleteProd = await deleteProduct(id);
          if (deleteProd) {
            const data = await getProducts();
            setProducts(data);
            const availableProd = await getAvailableProducts();
            setProductsAvailable(availableProd);
          }
          Swal.fire("Producto eliminado!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Descartado", "", "info");
        }
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAvailableProducts()
    fetchSales()
  }, []);


  const handleGetOneProduct = async (id) => {
    try {
      const getOneProd = await getOneProduct(id);
      if (getOneProd) {
        setProductToEdit(getOneProd.getProduct)
        const data = await getProducts();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  };



  const fetchAvailableProducts = async () => {
    try {
      const data = await getAvailableProducts();
      setProductsAvailable(data);
    } catch (error) {
      console.error('Error al listar los productos:', error.message);
    }
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setError('');
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setError('')
  };

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    setError('')
    if (!selectedProduct) {
      setError('Por favor, selecciona un producto.');
      return;
    }

    if (!quantity || quantity <= 0) {
      setError('Por favor, ingresa una cantidad válida (mayor a 0).');
      return;
    }

    try {
      const sellProd = await sellProduct(selectedProduct, quantity);
      if (sellProd && sellProd.message === "venta registrada con éxito.") {
        const data = await getProducts();
        setProducts(data);
        const availableProd = await getAvailableProducts();
        setProductsAvailable(availableProd);
        Swal.fire({

          icon: "success",
          title: "Venta realizada!",
          showConfirmButton: false,
          timer: 1500
        });
        setSelectedProduct('');
        setQuantity('');
        setError('')
        return
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: sellProd.message,
        });
      }
    } catch (error) {
      console.log('Error al vender producto', error.message);
    }



  };



  return (
    <main className='App container'>
      <div className="my-4">
        <div className="row">
          <div className="col-12">
            <h2>Modulo de Ventas de producto</h2>
            <div className='formSales'>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmitSale}>
                <div className="row mb-3">
                  <div className='col-6'>
                    <Form.Group controlId="formProductSelect">
                      <Form.Label>Seleccionar Producto</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedProduct}
                        onChange={handleProductChange}
                      >
                        <option value="">-- Selecciona un Producto --</option>
                        {productsAvailable.map((product, i) => (
                          <option key={i} value={product.id_product}>
                            {product.product_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className='col-6'>
                    <Form.Group controlId="formQuantity">
                      <Form.Label>Cantidad</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button variant="primary" type="submit">
                  Registrar Venta
                </Button>
              </Form>
            </div>
          </div>

          <div className="col-12  mt-5">

            <Tabs
              defaultActiveKey="productos"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="productos" title="Productos">
                <h2>Listado de Productos <Button title='Agregar Producto' onClick={() => {
                  setShowModalAdd(true);
                }} variant="primary" type="submit"><Icons name='add' /></Button></h2>
                <div className='table-responsive '>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre producto</th>
                        <th>Referencia</th>
                        <th>Precio</th>
                        <th>Peso</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(products) && products.length > 0 &&
                        products.map((prod, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{prod.product_name}</td>
                            <td>{prod.reference}</td>
                            <td>{prod.price}</td>
                            <td>{prod.weight}</td>
                            <td>{prod.category}</td>
                            <td>{prod.stock}</td>
                            <td>{prod.formattedDate}</td>
                            <td>
                              <Button className='m-1' title='Editar producto' variant="warning" size="sm" onClick={() => { handleGetOneProduct(prod.id_product); setShowModalEdit(true); setIdToEdit(prod.id_product) }}><Icons name='edit' /></Button>
                              <Button className='m-1' title='Eliminar producto' variant="danger" size="sm" onClick={() => handleDeleteProduct(prod.id_product)}><Icons name='delete' /></Button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="ventas" title="Ventas">
                <h2>Ventas de Productos</h2>
                <div className='table-responsive '>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre producto</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(sales) && sales.length > 0 &&
                        sales.map((sal, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{sal.product_name}</td>
                            <td>{sal.quantity}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>



          </div>
        </div>
      </div>
      <ModalAddProducts showModalAdd={showModalAdd} setShowModalAdd={setShowModalAdd} setProducts={setProducts} setProductsAvailable={setProductsAvailable} />
      <ModalEditProducts idToEdit={idToEdit} productToEdit={productToEdit} showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} setProducts={setProducts} setProductsAvailable={setProductsAvailable} />
    </main>
  );
}

export default App;
