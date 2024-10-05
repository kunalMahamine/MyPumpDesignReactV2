import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';

import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function Lubricanttransactions() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');
    const productName = queryParams.get('productName');

    const [transactions, setTransactions] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [stockIds, setStockIds] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockIds = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`products/${productId}/stocks`);
            const stockIds = response.data.map(stock => stock.id);
            setStockIds(stockIds);
        } catch (error) {
            console.error('Error fetching stock IDs:', error);
            setError('Failed to load stock IDs. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [productId]);

        // Calculate the opening stock for the product
        // const calculateOpeningStock = useCallback(async (fromDate) => {
        //     let totalOpeningStock = 0;
        //     for (let stockId of stockIds) {
        //         try {
        //             const transactionsResponse = await apiClient.get(`StockTransaction/Stock/${stockId}`, {
        //                 params: {
        //                     toDate: `${fromDate}T00:00:00`, // Fetch transactions up to the day before 'fromDate'
        //                 }
        //             });
        //             console.log("transactionsResponse: " + JSON.stringify(transactionsResponse));
        //             const lastTransaction = transactionsResponse.data
        //                 //.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort transactions by date descending
        //                 .sort((a, b) => b.id - a.id) // Sort transactions by id
        //                 .find(transaction => new Date(transaction.date) < new Date(fromDate)); // Find the last transaction before 'fromDate'
        //             console.log("lastTransaction: " + JSON.stringify(lastTransaction));
        //             if (lastTransaction) {
        //                 totalOpeningStock += lastTransaction.closingStock; // Use the closing stock of the last transaction as the opening stock
        //             }
        //         } catch (error) {
        //             console.error(`Error fetching opening stock for stock ID ${stockId}:`, error);
        //         }
        //         console.log(totalOpeningStock)
        //     }
        //     console.log("totalOpeningStock : " + totalOpeningStock);
        //     return totalOpeningStock;
        // }, [stockIds]);

    // const fetchTransactions = useCallback(async (fromDate, toDate) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const allTransactions = [];
    //         for (let stockId of stockIds) {
    //             const transactionsResponse = await apiClient.get(`StockTransaction/Stock/${stockId}`, {
    //                 params: {
    //                     fromDate: `${fromDate}T00:00:00`,
    //                     toDate: `${toDate}T23:59:59`
    //                 }
    //             });
    //             allTransactions.push(...transactionsResponse.data);
    //         }
    //         setTransactions(allTransactions);
    //     } catch (error) {
    //         console.error('Error fetching transactions:', error);
    //         setError('Failed to load transactions. Please try again later.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [stockIds]);


     // Fetch transactions for the given date range and calculate closing stock
     const fetchTransactions = useCallback(async (fromDate, toDate) => {
        setLoading(true);
        setError(null);
        try {
            const allTransactions = [];
            for (let stockId of stockIds) {
                const transactionsResponse = await apiClient.get(`StockTransaction/Stock/${stockId}`, {
                    params: {
                        fromDate: `${fromDate}T00:00:00`,
                        toDate: `${toDate}T23:59:59`
                    }
                });
                const transactions = transactionsResponse.data;
                allTransactions.push(...transactions);
            }
            setTransactions(allTransactions.sort((a, b) => a.id - b.id)); // Sort transactions by id
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transactions. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [stockIds]);


    const handleDateChange = (e) => {
        const { id, value } = e.target;
        if (id === 'stockReportFromDate') {
            setFromDate(value);
        } else if (id === 'stockReportToDate') {
            setToDate(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        fetchTransactions(fromDate, toDate);
    };

    const calculateTotals = (transactions) => {
        let totalPurchase = 0;
        let totalSold = 0;

        transactions.forEach(transaction => {
            if (transaction.quantity > 0) {
                totalPurchase += transaction.quantity;
            } else {
                totalSold += Math.abs(transaction.quantity);
            }
        });

        return { totalPurchase, totalSold };
    };

    // const calculateProductClosingStock = (transactions) => {
    //     let closingStock = 0;
    //     return transactions.map(transaction => {
    //         closingStock += transaction.quantity;
    //         return { ...transaction, productClosingStock: closingStock };
    //     });
    // };

    const { totalPurchase, totalSold } = calculateTotals(transactions);

    useEffect(() => {
        if (productId) {
            fetchStockIds();
        }
    }, [fetchStockIds, productId]);

    useEffect(() => {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const defaultFromDate = oneMonthAgo.toISOString().split('T')[0];
        const defaultToDate = now.toISOString().split('T')[0];

        setFromDate(defaultFromDate);
        setToDate(defaultToDate);

        if (stockIds.length > 0) {
            setLoading(true);
            fetchTransactions(defaultFromDate, defaultToDate);
        }
    }, [stockIds, fetchTransactions]);

    // const transactionsWithClosingStock = calculateProductClosingStock(
    //     transactions.sort((a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id)
    // );

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
                  <div className="card-header d-flex justify-content-between">
                     <div className="header-title">
                        <h4 className="card-title text-start">{productName}</h4>
                     </div>
                     <div className="">
                      {/* <!-- <div className="float-end">
                        <h5 className="card-title text-end">Total Available Stock: 100 Units</h5>
                      </div> --> */}
                      <div className="float-end">
                        <form className="form-horizontal" onSubmit={handleSubmit}>
                            <div className="form-group row">
                                <label className="control-label col align-self-center mb-0 p-0" htmlFor="stockReportFromDate">From:</label>
                                <div className="col pe-5">
                                    <input type="date" className="form-control" id="stockReportFromDate" value={fromDate} onChange={handleDateChange} />
                                </div>
                                <label className="control-label col align-self-center mb-0 p-0" htmlFor="stockReportToDate">To:</label>
                                <div className="col pe-5">
                                    <input type="date" className="form-control" id="stockReportToDate" value={toDate} onChange={handleDateChange} />
                                </div>
                                <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                            </div>
                        </form>
                      </div>
                  </div>
                  </div>
                  <div className="card-body pt-2">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table id="datatable" className="ledger table table-striped table-bordered" data-toggle="data-table">
                                        <thead>
                                            <tr>
                                                <th>Sr</th>
                                                <th>Date</th>
                                                <th>Note</th>
                                                <th className="text-center">Sold/Out (Quantity)</th>
                                                <th className="text-center">Purchase/In (Quantity)</th>
                                                <th className="text-center">Balance (Quantity)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction, index) => (
                                                <tr key={transaction.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                                                    <td>{transaction.particulars}</td>
                                                    <td className="text-center">{transaction.quantity <= 0 ? Math.abs(transaction.quantity).toFixed(2) : ''}</td>
                                                    <td className="text-center">{transaction.quantity > 0 ? transaction.quantity.toFixed(2) : ''}</td>
                                                    <td className="text-center">{transaction.productClosingStock.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colSpan="3" className="text-end">Total</th>
                                                <th className="text-center">{totalSold.toFixed(2)}</th>
                                                <th className="text-center">{totalPurchase.toFixed(2)}</th>
                                                <th className="text-center">{(totalPurchase - totalSold).toFixed(2)}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            )}
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

export default Lubricanttransactions