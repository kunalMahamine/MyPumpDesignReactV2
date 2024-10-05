import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient';
import Notification from '../utils/notification';

function Stockreport() {
    const [stockData, setStockData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        setToDate(today.toISOString().split('T')[0]);
        setFromDate(oneMonthAgo.toISOString().split('T')[0]);

        fetchStockData(oneMonthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    }, []);

   const fetchStockData = async (from, to) => {
      setLoading(true);
      setError(null);
      try {
          const response = await apiClient.get('StockTransaction/Report', {
              params: {
                  fromDate: from,
                  toDate: to,
              },
          });
          setStockData(response.data);
      } catch (error) {
          console.error('Error fetching stock data:', error);
          setError('Failed to fetch stock data. Please try again later.');
      } finally {
          setLoading(false);
      }
   };

   const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        fetchStockData(fromDate, toDate);
   };

    const calculateTotalStockValue = () => {
        return stockData.reduce((total, item) => total + item.stockValue, 0);
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
                  <div className="card-header d-flex justify-content-between">
                     <div className="header-title">
                        <h4 className="card-title">Stock Report</h4>
                     </div>
                      <div className="float-end">
                        <form className="form-horizontal" onSubmit={handleSubmit}>
                          <div className="form-group row">
                            <label className="control-label col align-self-center mb-0 p-0" htmlFor="stockReportFromDate">From:</label>
                              <div className="col pe-5">
                                <input type="date" className="form-control" id="stockReportFromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                              </div>
                              <label className="control-label col align-self-center mb-0 p-0" htmlFor="stockReportToDate">To:</label>
                              <div className="col pe-5">
                                <input type="date" className="form-control" id="stockReportToDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                              </div>
                              <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  <div className="card-body pt-0">
                     <div className="table-responsive">
                      {/* <!-- <p style="float:right; margin: 0px;">All Quantities In Liters</p> --> */}
                        <table id="datatable" className="reports table table-striped table-bordered" data-toggle="" >
                           <thead>
                              <tr>
                                 <th>Sr</th>
                                 <th>Lubricant</th>
                                 <th>Opening Stock</th>
                                 <th>Receipt Stock</th>
                                 <th>Out Stock</th>
                                 <th>Closing Stock</th>
                                 <th>Stock Value</th>
                              </tr>
                           </thead>
                           <tbody>
                              {stockData.length === 0 ? (
                                    <tr>
                                       <td colSpan="7" className="text-center">No data available</td>
                                    </tr>
                              ) : (
                                    stockData.map((item, index) => (
                                       <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>{item.productName}</td>
                                          <td>{item.openingStock.toFixed(2)}</td>
                                          <td>{item.inQuantity.toFixed(2)}</td>
                                          <td>{item.outQuantity.toFixed(2)}</td>
                                          <td>{item.closingStock.toFixed(2)}</td>
                                          <td>&#8377; {(item.stockValue).toFixed(2).toLocaleString()}</td>
                                       </tr>
                                    ))
                              )}
                           </tbody>
                           <thead>
                              <tr>
                                  <th colSpan="6" className="text-end">Total</th>
                                  <th>&#8377; {Math.round(calculateTotalStockValue()).toLocaleString()}</th>
                              </tr>
                           </thead>
                        </table>
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

export default Stockreport