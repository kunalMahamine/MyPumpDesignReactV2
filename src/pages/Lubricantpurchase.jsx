import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient';
import Notification from '../utils/notification';


function Lubricantpurchase() {
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [productName, setProductName] = useState('');
    const [note, setNote] = useState('');
    const [mrp, setMRP] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [productOptions, setProductOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null); 

    useEffect(() => {
        const fetchProductsAndStocks = async () => {
            setLoading(true);
            setError(null);
            try {
                const productResponse = await apiClient.get('products');
                setProductOptions(productResponse.data);

                const stockResponse = await apiClient.get('stocks');
                setStocks(stockResponse.data);
            } catch (error) {
                console.error('Error fetching products and stocks:', error);
                setError('Failed to load products and stocks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndStocks();
    }, []);

    useEffect(() => {
        setAmount(price * quantity);
    }, [price, quantity]);

    const validateInputs = () => {
        if (!productName.trim()) {
            setValidationError('Product Name is required.');
            return false;
        }
        // Check if MRP is empty or not a valid non-negative number
        if (mrp === '' || isNaN(mrp) || parseFloat(mrp) < 0) {
            setValidationError('MRP is required and must be a non-negative number.');
            return false;
        }
        // Check if Price is empty or not a valid non-negative number
        if (price === '' || isNaN(price) || parseFloat(price) < 0) {
            setValidationError('Price is required and must be a non-negative number.');
            return false;
        }
        // Check if Quantity is empty or not a valid positive number
        if (quantity === '' || isNaN(quantity) || parseFloat(quantity) <= 0) {
            setValidationError('Quantity is required and must be a positive number.');
            return false;
        }
        // Clear validation error if all inputs are valid
        setValidationError(null);
        return true;
    };

    const addRowOtherProductPurchase = () => {
        if (!validateInputs()) {
            return;
        }
        const selectedProduct = productOptions.find(product => product.name === productName);
        const newProduct = { productId: selectedProduct.id, productName, note, mrp, price, quantity, amount };
        setProducts([...products, newProduct]);
        setProductName('');
        setNote('');
        setMRP('');
        setPrice('');
        setQuantity('');
        setAmount('');
    };
    const deleteRowProductPurchase = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };
    const calculateTotalQuantity = () => {
        return products.reduce((total, product) => total + parseFloat(product.quantity || 0), 0);
    };
    const calculateTotalAmount = () => {
        return products.reduce((total, product) => total + parseFloat(product.amount || 0), 0);
    };

    const resetForm = () => {
        setProducts([]);
        setProductName('');
        setNote('');
        setMRP('');
        setPrice('');
        setQuantity('');
        setAmount('');
    };

    const handleSave = async () => {
        if (products.length === 0) { // Check if there are no products in the list
            alert('Please add at least one product before saving.');
            return; // Exit the function if no products are added
        }
        setLoading(true);
        setError(null);
        try {
            const purchaseTransaction = {
                Supplier: 'Default Supplier',
                TotalQuantity: calculateTotalQuantity(),
                TotalAmount: calculateTotalAmount(),
                IsCancelled: false,
                Date: new Date().toISOString(), // Later replace with date input 
                CreatedBy: 1, // Placeholder user ID
                CreatedDate: new Date().toISOString()
            };

            const purchaseTransactionResponse = await apiClient.post('PurchaseTransaction', purchaseTransaction);
            const purchaseTransactionId = purchaseTransactionResponse.data.id;

            for (let product of products) {
                const purchase = {
                    PurchaseTransactionId: purchaseTransactionId,
                    ProductId: product.productId,
                    ProductName: product.productName,
                    PurchasePrice: parseFloat(product.price),
                    SellingPrice: parseFloat(product.mrp),
                    Quantity: parseFloat(product.quantity),
                    Note: product.note,
                    IsCancelled: false,
                    CreatedBy: 1, // Placeholder user ID
                    CreatedDate: new Date().toISOString()
                };

                await apiClient.post('Purchase', purchase);

                let stockId;
                const existingStock = stocks.find(stock =>
                    stock.productId === product.productId &&
                    stock.purchasePrice === parseFloat(product.price) &&
                    stock.sellingPrice === parseFloat(product.mrp)
                );

                if (existingStock) {
                    const updatedStock = {
                        ...existingStock,
                        availableStock: existingStock.availableStock + parseFloat(product.quantity)
                    };
                    await apiClient.put(`stocks/${existingStock.id}`, updatedStock);
                    stockId = existingStock.id;
                } else {
                    const newStock = {
                        purchasePrice: parseFloat(product.price),
                        sellingPrice: parseFloat(product.mrp),
                        availableStock: parseFloat(product.quantity)
                    };
                    const newStockResponse = await apiClient.post(`products/${product.productId}/stocks`, newStock);
                    stockId = newStockResponse.data.stockId;
                }

                const stockTransaction = {
                    StockId: stockId,
                    Quantity: parseFloat(product.quantity),
                    Particulars: `Purchase: ${product.note}`,
                    Date: new Date().toISOString().split('T')[0] // Today's date; later replace with date input
                };
                await apiClient.post('StockTransaction', stockTransaction);
            }
            alert('Stocks, Purchase Transactions, and Stock Transactions updated successfully');
            resetForm();

            const productResponse = await apiClient.get('products');
            setProductOptions(productResponse.data);
            const stockResponse = await apiClient.get('stocks');
            setStocks(stockResponse.data);
        } catch (error) {
            console.error('Error updating stock:', error);
            setError('Failed to update stock. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
    };

    return (
      <div className="boxed-inner">
    {loading && <Loader />}
    {error && <Notification message={error} />}
      <span className="screen-darken"></span>
      <main className="main-content">
         
         <NavBar />
        <div className="conatiner-fluid content-inner pb-0">          {/* conatiner-fluid spelling mistake in design tempalate itself */}
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between flex-wrap">
                        <div className="header-title">
                            <h4 className="card-title mb-0">Other Products: Lubricants/Oil Purchase</h4>
                        </div>
                        {/* <div className="">              ************Can Implement this later
                            <a href="#" className=" text-center btn btn-primary btn-icon mt-lg-0 mt-md-0 mt-3" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewProduct">
                                <i className="btn-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </i>
                                <span>Add New Product</span>
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
                                                    <select className="form-select" id="category" value={newProduct.category} onChange={handleNewProductChange}>
                                                        <option selected="" disabled="">Product Category</option>
                                                        <option value="1">Fuel (MS/HSD)</option>
                                                        <option value="2">Other Products/Lubricants</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="name" value={newProduct.name} onChange={handleNewProductChange} placeholder="New Product Name" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="description" value={newProduct.description} onChange={handleNewProductChange} placeholder="New Product Description" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="price" value={newProduct.price} onChange={handleNewProductChange} placeholder="MRP, Price/Unit" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="cost" value={newProduct.cost} onChange={handleNewProductChange} placeholder="Cost per unit" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="quantity" value={newProduct.quantity} onChange={handleNewProductChange} placeholder="Opening Quantity/Stock" />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="stockValue" value={newProduct.cost * newProduct.quantity} placeholder="Stock Value" disabled />
                                                </div>
                                                <div className="form-group">
                                                    <input type="date" className="form-control" id="effectiveFromDate" value={newProduct.effectiveFromDate} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" id="note" value={newProduct.note} onChange={handleNewProductChange} placeholder="Add new product note" />
                                                </div>
                                                <div className="text-start mt-2 text-center">
                                                    <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal" onClick={handleAddProduct}>Save</button>
                                                    <button type="button" className="btn btn-danger m-1" data-bs-dismiss="modal">Cancel</button>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className="card-body">
                        
                        {/* <OtherProductPurchaseTable /> */}

                        <div className="form-card text-start mb-2" id="otherProductPurchaseForm" name="other-product-purchase-form">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card mb-0">
                                        <div className="card-header d-flex justify-content-between flex-wrap">
                                            <div className="">
                                                <div className="form-group row w-100">
                                                    <div className="col-4">
                                                        <select className="form-select" value={productName} onChange={(e) => setProductName(e.target.value)} id="otherProductPurchaseName" name="other-product-purchase-name">
                                                            <option selected="" disabled="">Product Name</option>
                                                            {productOptions.map(product => (
                                                                <option key={product.id} value={product.name}>{product.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-3">
                                                        <input type="text" className="form-control" value={note} onChange={(e) => setNote(e.target.value)} id="otherProductPurchaseNote" name="other-product-purchase-note" placeholder="Note" />
                                                    </div>
                                                    <div className="col-1">
                                                        <input type="text" className="form-control" value={mrp} onChange={(e) => setMRP(e.target.value)} id="otherProductPurchaseMRP" name="other-product-purchase-mrp" placeholder="MRP" />
                                                    </div>
                                                    <div className="col-1">
                                                        <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} id="otherProductPurchasePrice" name="other-product-purchase-price" placeholder="Price" />
                                                    </div>
                                                    <div className="col-1">
                                                        <input type="text" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} id="otherProductPurchaseQty" name="other-product-purchase-qty" placeholder="Qty" />
                                                    </div>
                                                    <div className="col-1">
                                                        <input type="text" className="form-control px-2" value={amount} id="otherProductPurchaseAmt" name="other-product-purchase-amt" placeholder="Amt" disabled />
                                                    </div>
                                                    <button type="button" className="text-center btn btn-primary col-1" id="addOtherProductPurhcaseButton" name="add-other-product-purhcase-button" value="Add" onClick={addRowOtherProductPurchase}>Add</button>
                                                </div>
                                                {validationError && <Notification message={validationError} />}
                                            </div>
                                        </div>
                                        <div className="card-body mt-0 mb-0">
                                            <div className="table-responsive">
                                                <table className="table table-bordered" id="otherProductPurchaseTable" name="other-product-purchase-table">
                                                    <thead>
                                                        <tr className="custom-bg-blue-white">
                                                            <th className="text-center px-1">#</th>
                                                            <th>Product Name</th>
                                                            <th>Note</th>
                                                            <th className="text-center">MRP</th>
                                                            <th className="text-center">Price</th>
                                                            <th className="text-center">Qty</th>
                                                            <th className="text-center">Amount</th>
                                                            <th className="text-center px-0"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {products.map((product, index) => (
                                                            <tr key={index}>
                                                                <td className="text-center px-1">{index + 1}</td>
                                                                <td>{product.productName}</td>
                                                                <td>{product.note}</td>
                                                                <td className="text-center">{product.mrp}</td>
                                                                <td className="text-center">{product.price}</td>
                                                                <td className="text-center">{product.quantity}</td>
                                                                <td className="text-center">{product.amount}</td>
                                                                <td className="text-center px-0">
                                                                    {/* <button type="button" className="btn btn-danger" onClick={() => deleteRowProductPurchase(index)}>Delete</button> */}
                                                                    <a className="btn btn-sm btn-icon text-danger" title="Delete Purchase Entry" id="otherProductPurchaseDeleteIcon-1" name="delete-other-product-purchase-row" onClick={() => deleteRowProductPurchase(index)}>
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
                                                            <th className="text-center">{calculateTotalQuantity()}</th>
                                                            <th className="text-center">{calculateTotalAmount()}</th>
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
                        <div className="text-start mt-2 text-center">
                            <button type="button" className="btn btn-primary m-1" onClick={handleSave} disabled={loading}>Save</button>
                            <button type="button" className="btn btn-danger m-1" onClick={handleCancel} disabled={loading}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
  
        <Footer />
       
       </main>
    </div>
    )
   };

export default Lubricantpurchase