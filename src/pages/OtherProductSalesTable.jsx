import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

function OtherProductSalesTable({products, addProduct, deleteProduct }) {
    const [allProducts, setAllProducts] = useState([]);
    const [allStocks, setAllStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedStock, setSelectedStock] = useState({});
    const [note, setNote] = useState('');
    const [mrp, setMrp] = useState('0');
    const [quantity, setQuantity] = useState('0');
    const [amount, setAmount] = useState('0');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null); 

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('products');
                setAllProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const fetchStocks = async () => {
            try {
                const response = await apiClient.get('stocks');
                setAllStocks(response.data);
            } catch (error) {
                console.error('Error fetching stocks:', error);
                setError('Failed to load stocks. Please try again later.');
            }
        };
        fetchProducts();
        fetchStocks();
    }, []);
 
    useEffect(() => {
        setAmount(mrp * quantity);                   // Calculate the amount whenever mrp or quantity changes
      }, [mrp, quantity]);

    const handleProductChange = (e) => {
        const productId = parseInt(e.target.value);
        setSelectedProductId(productId);
        setFilteredStocks(allStocks.filter(stock => stock.productId === productId));
    };
    const handleStockChange = (e) => {
        const stockId = parseInt(e.target.value);
        const stock = filteredStocks.find(stock => stock.id === stockId);
        setSelectedStock(stock);
        setMrp(stock ? stock.sellingPrice : '0');
    };

    // Validation Function
    const validateProductInputs = () => {
        // Check required fields
        if (!selectedProductId || !selectedStock.id || !mrp || !quantity || !amount) {
            setValidationError('All fields are required.');
            return false;
        }
        // Check valid decimal numbers and that they are greater than 0
        const isValidDecimal = (value) => /^\d*\.?\d+$/.test(value) && parseFloat(value) >= 0;
        if (!isValidDecimal(mrp) || !isValidDecimal(quantity) || !isValidDecimal(amount)) {
            setValidationError('Price, Quantity, and Amount must be valid positive decimal numbers.');
            return false;
        }
        // If all checks pass, clear any validation errors
        setValidationError(null);
        return true;
    };

    const handleAddProduct = () => {
        if (!validateProductInputs()) {
            return; // Do not add product if validation fails
        }
        const newProduct = {
            productName: allProducts.find(product => product.id === selectedProductId)?.name,
            stockSelected: selectedStock,
            note,
            mrp,
            quantity,
            amount,
        };
        addProduct(newProduct);
        setSelectedProductId('');
        setSelectedStock({});
        setNote('');
        setMrp('');
        setQuantity('');
        setAmount('');
    };
    const calculateTotalQuantity = () => {
        return products.reduce((total, product) => total + parseFloat(product.quantity || 0), 0);
    };
    const calculateTotalAmount = () => {
        return products.reduce((total, product) => total + parseFloat(product.amount || 0), 0);
    };

  return (
    <div>
        {loading && <p>Loading...</p>}
        <div className="form-card text-start mb-2" id="otherProductForm" name="other-product-form">
        {error && <p className="error text-danger">{error}</p>}
        {validationError && <p className="error text-danger">{validationError}</p>}
            <div className="row">
                <div className="col-sm-12">
                    <div className="card mb-0">
                        <div className="card-header d-flex justify-content-between flex-wrap">
                            <div className="">
                                <div className="form-group row">
                                    <div className="col-3 pe-0" style={{ width: '30%' }}>
                                        <p className="text-left pt-2">Other Product Name</p>
                                        <select className="form-select ps-1 pe-4" value={selectedProductId} onChange={handleProductChange} id="otherProductName" name="other-product-name" >
                                            <option selected="" disabled="">
                                                    Lubricant/Oil Name
                                                </option>
                                                {allProducts.map((product) => (
                                                    <option key={product.id} value={product.id}>{product.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                    {/* <div className="col-1 pt-1" style={{ width: '4%'}} >             ********** can work on it later*************
                                        <a className="nav-link me-3 text-primary" title="Add new product" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewProduct">
                                            <i className="icon">
                                                <svg className="icon-32" width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                
                                                    <path opacity="0.4" d="M16.6667 2H7.33333C3.92889 2 2 3.92889 2 7.33333V16.6667C2 20.0622 3.92 22 7.33333 22H16.6667C20.0711 22 22 20.0622 22 16.6667V7.33333C22 3.92889 20.0711 2 16.6667 2Z" fill="currentColor"></path>                                <path d="M15.3205 12.7083H12.7495V15.257C12.7495 15.6673 12.4139 16 12 16C11.5861 16 11.2505 15.6673 11.2505 15.257V12.7083H8.67955C8.29342 12.6687 8 12.3461 8 11.9613C8 11.5765 8.29342 11.2539 8.67955 11.2143H11.2424V8.67365C11.2824 8.29088 11.6078 8 11.996 8C12.3842 8 12.7095 8.29088 12.7495 8.67365V11.2143H15.3205C15.7066 11.2539 16 11.5765 16 11.9613C16 12.3461 15.7066 12.6687 15.3205 12.7083Z" fill="currentColor"></path>
                                                </svg>
                                            </i>
                                        </a>
                                        <div className="modal fade" id="staticBackdropAddNewProduct" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelAddNewProduct" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabelAddNewProduct">Add New Product </h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="newProductName" placeholder="New Product Name" />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="newProductDescription" placeholder="New Product Description" />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="newProductQuantity" placeholder="Opening Qunatity/Stock" />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="date" className="form-control" id="newProductDate" value="2019-12-18" />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="newProductCost" placeholder="Cost per unit" />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="newProductPrice" placeholder="MRP, Price/Unit" />
                                                        </div>
                                                        <div className="text-start mt-2 text-center">
                                                            <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal">Save</button>
                                                            <button type="button" className="btn btn-danger m-1">Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-2 pe-0" style={{ width: '19%' }}>
                                        <p className="text-left pt-2">Available Stock</p>
                                        <select className="form-select ps-1 pe-4"  value={selectedStock.id || ''} onChange={handleStockChange} id="otherProductStocks" name="other-product-stocks">
                                                <option selected="" disabled="">Select Stock</option>
                                                {filteredStocks.map(stock => (
                                                    <option key={stock.id} value={stock.id}>
                                                        {`${stock.purchasePrice}(P)-${stock.sellingPrice}(S)-${stock.availableStock}(Q)`}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="col-2 pe-0"  style={{ width: '22%' }}>  
                                        <p className="text-left pt-2">Note</p>
                                        <input type="text " className="form-control px-2"  value={note} onChange={(e) => setNote(e.target.value)} id="otherProductNote" name="other-product-note" placeholder="Note" />
                                    </div>
                                    <div className="col-1 pe-0" style={{ width: '7%' }} >
                                        <p className="text-center pt-2">Price</p>
                                        <input type="text" className="form-control px-2" value={mrp} onChange={(e) => setMrp(e.target.value)} id="otherProductMrp" name="other-product-mrp" />
                                    </div>
                                    <div className="col-1 pe-0" style={{ width: '6.5%' }}>
                                       <p className="text-center pt-2">Quantity</p>
                                        <input type="text" className="form-control px-2" value={quantity} onChange={(e) => setQuantity(e.target.value)} id="otherProductQty" name="other-product-qty" />
                                    </div>
                                    <div className="col-1 pe-1 me-1">
                                        <p className="text-center pt-2">Amount</p>
                                        <input type="text" className="form-control px-2" value={parseFloat(amount).toFixed(2)} id="otherProductAmt" name="other-product-amt" disabled/>
                                    </div>
                                    <div className="col-1 p-0" style={{ width: '2%'}}>
                                        <p className="text-center pt-2">&nbsp; </p>
                                        <button type="button" className="text-center btn btn-primary " id="addOtherProductButton" name="add-other-product-button" value="Add" onClick={handleAddProduct} >Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body mt-0 mb-0">
                            <div className="table-responsive" >
                                <table className="table table-bordered" id="otherProductTable" name="other-product-table">
                                    <thead>
                                        <tr className="custom-bg-blue-white" >
                                            <th>#</th>
                                            <th className="">PRODUCT NAME</th>
                                            <th className="">STOCK</th>
                                            <th className="">NOTE</th>
                                            <th className="text-center">PRICE</th>
                                            <th className="text-center">QUANTITY</th>
                                            <th className="text-center">AMOUNT</th>
                                            <th className="text-center" style={{ width: '20px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td className="text-center px-1">{index + 1}</td>
                                            <td>{product.productName}</td>
                                            <td>{`${product.stockSelected.purchasePrice}(P)-${product.stockSelected.sellingPrice}(S)-${product.stockSelected.availableStock}(Q)`}</td>
                                            <td>{product.note}</td>
                                            <td className="text-center">{product.mrp}</td>
                                            <td className="text-center">{product.quantity}</td>
                                            <td className="text-center">{parseFloat(product.amount).toFixed(2)}</td>
                                            <td className="text-center px-0">
                                                <a className="btn btn-sm btn-icon text-danger" title="Delete Sales Entry" id={`otherProductDeleteIcon-${index+1}`}  name="delete-other-product-row" onClick={() => deleteProduct(index)}>
                                                    <span className="btn-inner">
                                                        <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                            <path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                     
                                    </tbody>
                                    <thead>
                                    <tr className="heading3">
                                        <th colSpan="5" className="text-end">Total</th>
                                        <th className="text-center" id="totalOtherProductsSaleQuantity">{calculateTotalQuantity()}</th>
                                        <th className="text-center" id="totalOtherProductsSaleAmount">{parseFloat(calculateTotalAmount()).toFixed(2)}</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OtherProductSalesTable;