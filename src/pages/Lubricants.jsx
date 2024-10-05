import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';

import apiClient from '../utils/apiClient';
import Notification from '../utils/notification';

const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min');

function Lubricants() {
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedStockId, setSelectedStockId] = useState(null);
    const [editProduct, setEditProduct] = useState({});
    const [editStock, setEditStock] = useState({});
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        cost: '',
        quantity: '',
        note: '',
        category: '1',
        effectiveFromDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProductValidationError, setNewProductValidationError] = useState(null);
    const [editProductValidationError, setEditProductValidationError] = useState(null);
    const [editStockValidationError, setEditStockValidationError] = useState(null);

    useEffect(() => {
        const fetchProductsAndStocks = async () => {
            setLoading(true);
            setError(null);
            try {
                const productResponse = await apiClient.get('products');
                setProducts(productResponse.data);

                const stockResponse = await apiClient.get('stocks');
                setStocks(stockResponse.data);
            } catch (error) {
                console.error('Error fetching products and stocks:', error);
                setError('Failed to fetch products and stocks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductsAndStocks();
    }, []);

    const handleEditProductClick = (productId) => {
        const product = products.find(p => p.id === productId);
        setEditProduct(product);
        setSelectedProductId(productId);
    };
    const handleEditStockClick = (stockId) => {
        const stock = stocks.find(s => s.id === stockId);
        setEditStock(stock);
        setSelectedStockId(stockId);
    };

    const handleEditProductChange = (e) => {
        const { id, name, value, type } = e.target;
        const key = id || name; // Use id for text inputs and name for radio buttons
        setEditProduct(prev => ({
            ...prev,
            [key]: type === 'radio' ? (value === 'true') : value
        }));
    };

    const handleEditStockChange = (e) => {
        const { id, value } = e.target;
        setEditStock(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateNewProduct = () => {
        if (!newProduct.name.trim()) {
            setNewProductValidationError('Product Name is required.');
            return false;
        }
        if (newProduct.price === '' || isNaN(newProduct.price) || parseFloat(newProduct.price) < 0) {
            setNewProductValidationError('MRP must be a non-negative number.');
            return false;
        }
        if (newProduct.cost === '' || isNaN(newProduct.cost) || parseFloat(newProduct.cost) < 0) {
            setNewProductValidationError('Cost must be a non-negative number.');
            return false;
        }
        if (newProduct.quantity === '' || isNaN(newProduct.quantity) || parseFloat(newProduct.quantity) <= 0) {
            setNewProductValidationError('Quantity must be a positive number.');
            return false;
        }
        if (!newProduct.effectiveFromDate) {
            setNewProductValidationError('Effective Date is required.');
            return false;
        }
        setNewProductValidationError(null);
        return true;
    };
    const validateEditProduct = () => {
        if (!editProduct.name.trim()) {
            setEditProductValidationError('Product Name is required.');
            return false;
        }
        if (editProduct.isActive === undefined) {
            setEditProductValidationError('Please select if the product is active.');
            return false;
        }
        setEditProductValidationError(null);
        return true;
    };
    const validateEditStock = () => {
        if (editStock.sellingPrice === '' || isNaN(editStock.sellingPrice) || parseFloat(editStock.sellingPrice) < 0) {
            setEditStockValidationError('MRP must be a non-negative number.');
            return false;
        }
        if (editStock.purchasePrice === '' || isNaN(editStock.purchasePrice) || parseFloat(editStock.purchasePrice) < 0) {
            setEditStockValidationError('Cost must be a non-negative number.');
            return false;
        }
        if (editStock.availableStock === '' || isNaN(editStock.availableStock) || parseFloat(editStock.availableStock) <= 0) {
            setEditStockValidationError('Quantity must be a positive number.');
            return false;
        }
        setEditStockValidationError(null);
        return true;
    };

    const handleEditProduct = async () => {
        if (!validateEditProduct()) return;
        try {
            await apiClient.put(`products/${selectedProductId}`, editProduct);
            alert('Product updated successfully');
            setProducts(prev => prev.map(p => (p.id === selectedProductId ? editProduct : p)));
            closeModal('staticBackdropEditProduct');
        } catch (error) {
            console.error('Error updating product', error);
            setError('Failed to update the product. Please try again later.');
        }
    };
    const handleEditStock = async () => {
        if (!validateEditStock()) return;
        try {
            const oldStock = stocks.find(s => s.id === selectedStockId);
            const quantityDifference = parseFloat(editStock.availableStock) - oldStock.availableStock;

            await apiClient.put(`stocks/${selectedStockId}`, editStock);
            setStocks(prev => prev.map(s => (s.id === selectedStockId ? editStock : s)));
            // Add stock transaction entry
            const stockTransaction = {
                StockId: selectedStockId,
                Quantity: quantityDifference,
                Particulars: `Edit Stock: ${editStock.stockNote || ''}`,
                Date: new Date().toISOString().split('T')[0] // Today's date // later on replace with date input
            };
            await apiClient.post('StockTransaction', stockTransaction);
            alert('Stock updated successfully');
            closeModal('staticBackdropEditProductStock');
        } catch (error) {
            console.error('Error updating stock', error);
            setError('Failed to update the stock. Please try again later.');
        }
        //Pending- if stock edit leads to same price and cost of other existing stock item of the same product
    };

    const handleNewProductChange = (e) => {
        const { id, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddProduct = async () => {
        // Run validation logic
        const isValid = validateNewProduct();
        if (!isValid) return; // If validation fails, exit the function
        try {
            const productData = {
                ...newProduct,
                isActive: true,
                wac: newProduct.cost,
                category: '1'
            };
            console.log(productData);
            const productResponse = await apiClient.post('products', productData);
            const addedProduct = productResponse.data;
            const initialStock = {
                sellingPrice: newProduct.price,
                purchasePrice: newProduct.cost,
                availableStock: parseFloat(newProduct.quantity),
            };
            const stockResponse = await apiClient.post(`products/${addedProduct.id}/stocks`, initialStock);
            const addedStock = stockResponse.data;
            setProducts(prev => [...prev, addedProduct]);
            setStocks(prev => [...prev, { ...initialStock, productId: addedProduct.id, id: addedStock.stockId }]);
            // Add stock transaction entry
            const stockTransaction = {
                StockId: addedStock.stockId,
                Quantity: parseFloat(newProduct.quantity),
                Particulars: `NewProd InitialStock: ${newProduct.note || ''}`,
                Date: newProduct.effectiveFromDate // Use effectiveFromDate
            };
            await apiClient.post('StockTransaction', stockTransaction);
            // Close the modal after successful submission
            //alert('New Product added successfully');
            setNewProduct({
                name: '',
                description: '',
                price: '',
                cost: '',
                quantity: '',
                note: '',
                category: '1',
                effectiveFromDate: '',
            });
            closeModal('staticBackdropAddNewProduct');

        } catch (error) {
            console.error('Error adding product and stock:', error);
            setError('Failed to add the product and stock. Please try again later.');
        }
    };

    // Working closeModal and initializeModal functions 
    // const closeModal = (modalId) => {
    //     const modalInstance = initializeModal(modalId);
    //     if (modalInstance) {
    //         console.log('Closing Modal:', modalInstance._element); // Debugging log
    //         // Hide the modal
    //         modalInstance.hide();
    //         // Use an event listener to ensure the modal is fully hidden
    //         modalInstance._element.addEventListener('hidden.bs.modal', () => {
    //             console.log('Modal is now hidden and ready for disposal.');
    //             modalInstance.dispose();  // Dispose of the modal instance safely
    //             // Clean up the modal backdrop
    //             const backdrop = document.querySelector('.modal-backdrop');
    //             if (backdrop) {
    //                 backdrop.remove();
    //                 console.log('Backdrop removed');
    //             }
    //             // Remove the `style` attribute from the body tag manually
    //             document.body.style.overflow = '';
    //             document.body.style.paddingRight = '';
    //             console.log('Body styles reset');
    //         }, { once: true });  // Ensure the event listener is removed after execution
    //     }
    // };
    // const initializeModal = (modalId) => {
    //     const modalElement = document.getElementById(modalId);
    //     if (modalElement) {
    //         const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    //         return modalInstance;
    //     }
    //     return null;
    // };
    const closeModal = (modalId) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
                modalElement.addEventListener('hidden.bs.modal', () => {
                    modalInstance.dispose();
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                    // Remove the unwanted leftover `style` attribute from the body tag manually
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, { once: true });
            }
        }
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
                                        <h4 className="card-title mb-0">Other Products: Lubricants/Oil</h4>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center bg-soft-secondary rounded-1">
                                        <div className="text-end px-3">
                                            <h5 className="counter" id="totalStockValueLubricantsPage">Total Stock Value: &#8377; {stocks.reduce((total, stock) => total + (stock.availableStock * stock.purchasePrice), 0).toFixed(0)}</h5>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Link className="text-center btn btn-icon mt-lg-0 mt-md-0 mt-3 custom-bg-blue-white me-1 nav-link" to="/lubricantpurchase" target="_blank">
                                            <i className="btn-inner">
                                                <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2.75 3.25L4.83 3.61L5.793 15.083C5.87 16.02 6.653 16.739 7.593 16.736H18.502C19.399 16.738 20.16 16.078 20.287 15.19L21.236 8.632C21.342 7.899 20.833 7.219 20.101 7.113C20.037 7.104 5.164 7.099 5.164 7.099"
                                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M14.125 10.7949H16.898" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                        d="M7.15435 20.2026C7.45535 20.2026 7.69835 20.4466 7.69835 20.7466C7.69835 21.0476 7.45535 21.2916 7.15435 21.2916C6.85335 21.2916 6.61035 21.0476 6.61035 20.7466C6.61035 20.4466 6.85335 20.2026 7.15435 20.2026Z"
                                                        fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                        d="M18.4346 20.2026C18.7356 20.2026 18.9796 20.4466 18.9796 20.7466C18.9796 21.0476 18.7356 21.2916 18.4346 21.2916C18.1336 21.2916 17.8906 21.0476 17.8906 20.7466C17.8906 20.4466 18.1336 20.2026 18.4346 20.2026Z"
                                                        fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </i>
                                            <span>New Purchase</span>
                                        </Link>
                                        <Link className="text-center btn btn-success btn-icon mt-lg-0 mt-md-0 mt-3 me-1 nav-link" to="/stockreport" target="_blank">
                                            <i className="btn-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                                                    <path d="m21,15h-1.5v-5c0-1.103-.897-2-2-2h-1.5V3c0-1.103-.897-2-2-2h-4c-1.103,0-2,.897-2,2v5h-1.5c-1.103,0-2,.897-2,2v5h-1.5c-1.103,0-2,.897-2,2v6h22v-6c0-1.103-.897-2-2-2Zm-3.5-6c.552,0,1,.448,1,1v5h-6v-5c0-.552.448-1,1-1h4ZM9,3c0-.552.448-1,1-1h4c.552,0,1,.448,1,1v5h-6V3Zm-3.5,7c0-.552.448-1,1-1h4c.552,0,1,.448,1,1v5h-6v-5Zm2.5,12H2v-5c0-.552.448-1,1-1h4c.552,0,1,.448,1,1v5Zm7,0h-6v-5c0-.552.448-1,1-1h4c.552,0,1,.448,1,1v5Zm7,0h-6v-5c0-.552.448-1,1-1h4c.552,0,1,.448,1,1v5Z" fill="currentColor" />
                                                </svg>
                                            </i>
                                            <span>Stock Report</span>
                                        </Link>
                                        <a className=" text-center btn btn-primary btn-icon mt-lg-0 mt-md-0 mt-3" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewProduct">
                                            <i className="btn-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </i>
                                            <span>New Product</span>
                                        </a>

                                        {/* <AddNewProduct/> */}

                                        <div className="modal fade" id="staticBackdropAddNewProduct" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelAddNewProduct" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabelAddNewProduct">Add New Product </h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {/* <form> */}
                                                        {/* <div className="form-group">                                      Category not required now
                                                        <select className="form-select" id="category" value={newProduct.category} onChange={handleNewProductChange}>
                                                            <option selected="" disabled="">Product Category</option>
                                                            <option value="1">Fuel (MS/HSD)</option>
                                                            <option value="2">Other Products/Lubricants</option>
                                                        </select>
                                                    </div> */}
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
                                                            <input type="text" className="form-control" id="stockValue" value={(newProduct.cost * newProduct.quantity).toFixed(2)} placeholder="Stock Value" disabled />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="date" className="form-control" id="effectiveFromDate" value={newProduct.effectiveFromDate} onChange={handleNewProductChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" id="note" value={newProduct.note} onChange={handleNewProductChange} placeholder="Add new product note" />
                                                        </div>
                                                        {newProductValidationError && <Notification message={newProductValidationError} />}
                                                        <div className="text-start mt-2 text-center">
                                                            {/* <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal" onClick={handleAddProduct} disabled={loading}>Save</button> */}
                                                            <button type="button" className="btn btn-primary m-1" onClick={handleAddProduct} disabled={loading}>Save</button>
                                                            <button type="button" className="btn btn-danger m-1" data-bs-dismiss="modal" disabled={loading}>Cancel</button>
                                                        </div>
                                                        {/* </form> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    {/* <ProductList /> */}

                                    <div className="bd-example">
                                        <div className="accordion" id="accordionExample">

                                            {products.map(product => (
                                                <div className="accordion-item" key={product.id}>
                                                    <h4 className="accordion-header" id={`heading${product.id}`}>
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${product.id}`} aria-expanded="false" aria-controls={`collapse${product.id}`} >
                                                            <div className="row w-100">
                                                                <div className="col text-start">{product.name}</div>
                                                                <div className="col text-center">Stock Quantity: {stocks.filter(stock => stock.productId === product.id).reduce((total, stock) => total + parseFloat(stock.availableStock || 0), 0).toFixed(2)} units</div>
                                                                <div className="col text-center">Stock Value: <span>&#8377;</span> {stocks.filter(stock => stock.productId === product.id).reduce((total, stock) => total + (stock.availableStock * stock.purchasePrice), 0).toFixed(2)}</div>
                                                                <div className="col text-end me-2">
                                                                    <Link className="btn btn-sm btn-icon btn-success me-1 nav-link" title="View Product Transactions"
                                                                        to={`/lubricanttransactions?productId=${product.id}&productName=${encodeURIComponent(product.name)}`}
                                                                        target="_blank"
                                                                    >
                                                                        <span className="btn-inner">
                                                                            <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M14.7379 2.76175H8.08493C6.00493 2.75375 4.29993 4.41175 4.25093 6.49075V17.2037C4.20493 19.3167 5.87993 21.0677 7.99293 21.1147C8.02393 21.1147 8.05393 21.1157 8.08493 21.1147H16.0739C18.1679 21.0297 19.8179 19.2997 19.8029 17.2037V8.03775L14.7379 2.76175Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                <path d="M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                <path d="M14.2882 15.3584H8.88818" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                <path d="M12.2432 11.606H8.88721" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </Link>
                                                                    <a className="btn btn-sm btn-icon btn-primary flex-end" title="Edit Product Details" data-bs-toggle="modal" data-bs-target="#staticBackdropEditProduct" onClick={() => handleEditProductClick(product.id)}>
                                                                        <span className="btn-inner">
                                                                            <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                                                <path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                <path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </h4>
                                                    <div id={`collapse${product.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${product.id}`} data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="table-responsive">
                                                                <table className="table table-bordered daybook">
                                                                    <thead>
                                                                        <tr className="heading2">
                                                                            <th className="text-center">MRP (Selling Price)</th>
                                                                            <th className="text-center">COST (Purchase Price)</th>
                                                                            <th className="text-center">STOCK (Quantity)</th>
                                                                            <th className="text-center">STOCK (Value)</th>
                                                                            <th className="text-center"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {stocks.filter(stock => stock.productId === product.id).map(stock => (
                                                                            <tr key={stock.id}>
                                                                                <td className="text-center">{parseFloat(stock.sellingPrice).toFixed(2)}</td>
                                                                                <td className="text-center">{parseFloat(stock.purchasePrice).toFixed(2)}</td>
                                                                                <td className="text-center">{parseFloat(stock.availableStock).toFixed(2)}</td>
                                                                                <td className="text-center">{(stock.availableStock * stock.purchasePrice).toFixed(2)}</td>
                                                                                <td>
                                                                                    <div className="float-end">
                                                                                        <a className="btn btn-sm btn-icon btn-primary flex-end" title="Edit Product Stock" data-bs-toggle="modal" data-bs-target="#staticBackdropEditProductStock" onClick={() => handleEditStockClick(stock.id)}>
                                                                                            <span className="btn-inner">
                                                                                                <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                                                                    <path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                                    <path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                                </svg>
                                                                                            </span>
                                                                                        </a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="modal fade" id="staticBackdropEditProductStock" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelEditProductStock" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabelEditProductStock">Edit Product Stock</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form className="form-horizontal">
                                                        <div className="form-group row">
                                                            <label className="control-label col align-self-center mb-0" htmlFor="sellingPrice">MRP (Selling Price):</label>
                                                            <div className="col">
                                                                <input type="text" className="form-control" id="sellingPrice" value={editStock.sellingPrice} onChange={handleEditStockChange} placeholder="Edit Product MRP" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="control-label col align-self-center mb-0" htmlFor="purchasePrice">Cost (Purchase Price):</label>
                                                            <div className="col">
                                                                <input type="text" className="form-control" id="purchasePrice" value={editStock.purchasePrice} onChange={handleEditStockChange} placeholder="Edit Product Cost" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="control-label col align-self-center mb-0" htmlFor="availableStock">Quantity/Stock:</label>
                                                            <div className="col">
                                                                <input type="text" className="form-control" id="availableStock" value={editStock.availableStock} onChange={handleEditStockChange} placeholder="Edit Product Quantity" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="control-label col align-self-center mb-0" htmlFor="stockValue">Stock Value:</label>
                                                            <div className="col">
                                                                <input type="text" className="form-control" id="stockValue" value={(editStock.purchasePrice * editStock.availableStock).toFixed(2)} placeholder="Edit Product Stock Value" disabled />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="control-label col align-self-center mb-0" htmlFor="stockNote">Note:</label>
                                                            <div className="col">
                                                                <input type="text" className="form-control" id="stockNote" value={editStock.note} onChange={handleEditStockChange} placeholder="Edit Product Stock Note" />
                                                            </div>
                                                        </div>
                                                        {editStockValidationError && <Notification message={editStockValidationError} />}
                                                        <div className="form-group mt-2 text-center">
                                                            <button type="button" className="btn btn-primary m-1" onClick={handleEditStock} disabled={loading}>Save</button>
                                                            <button type="button" className="btn btn-danger m-1" data-bs-dismiss="modal" disabled={loading}>Cancel</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal fade" id="staticBackdropEditProduct" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelEditProduct" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabelEditProduct">Edit Product Details </h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form className="form-horizontal" >
                                                        <div className="form-group row">
                                                            <label className="control-label col-5 align-self-center mb-0" htmlFor="editProductName">Product Name:</label>
                                                            <div className="col-7">
                                                                <input type="text" className="form-control" id="name" value={editProduct.name} onChange={handleEditProductChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="control-label col-5 align-self-center mb-0" htmlFor="editProductDescription">Product Description:</label>
                                                            <div className="col-7">
                                                                <input type="text" className="form-control" id="description" value={editProduct.description} onChange={handleEditProductChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <span className="col-5">Is Active</span>
                                                            <div className="form-check col">
                                                                <input className="form-check-input" type="radio" name="isActive" value="true" checked={editProduct.isActive === true} onChange={handleEditProductChange} />
                                                                <label className="form-check-label" htmlFor="active">Active</label>
                                                            </div>
                                                            <div className="form-check col">
                                                                <input className="form-check-input" type="radio" name="isActive" value="false" checked={editProduct.isActive === false} onChange={handleEditProductChange} />
                                                                <label className="form-check-label" htmlFor="inactive">Inactive</label>
                                                            </div>
                                                        </div>
                                                        {editProductValidationError && <Notification message={editProductValidationError} />}
                                                        <div className="form-group mt-2 text-center">
                                                            <button type="button" className="btn btn-primary m-1" onClick={handleEditProduct} disabled={loading}>Save</button>
                                                            <button type="button" className="btn btn-danger m-1" data-bs-dismiss="modal" disabled={loading}>Cancel</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
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

export default Lubricants