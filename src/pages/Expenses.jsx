import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function Expenses() {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [expensesFromDate, setExpensesFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [expensesToDate, setExpensesToDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  const fetchExpenses = async (fromDate, toDate) => {
   setLoading(true);
   setError(null); // Reset error before fetching
   try {
         //const customerResponse = await apiClient.get(`customers/${customerId}`);
         const response = await apiClient.get(`LedgerTransactions/expenses`, {
         params: { from: fromDate, to: toDate },
     });
     setExpenses(response.data);
   } catch (error) {
     console.error('Error fetching expenses:', error);
     setError('Failed to fetch expenses data. Please try again later.');
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    fetchExpenses(expensesFromDate, expensesToDate);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    fetchExpenses(expensesFromDate, expensesToDate);
  };

  const formatIndianNumber = (number) => {
    return number.toLocaleString('en-IN');
  };

  const calculateTotals = () => {
    let totalAmt = 0;
    expenses.forEach((transaction) => {
        totalAmt += transaction.amt;
    });
    return totalAmt;
  };

  const totalAmt = calculateTotals();

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
                        <h4 className="card-title">Expenses</h4>
                     </div>
                      <div className="float-end">
                        <form className="form-horizontal" onSubmit={handleSubmit}>
                          <div className="form-group row">
                              <label className="control-label col align-self-center mb-0 p-0" htmlFor="expensesFromDate">From:</label>
                              <div className="col  pe-5">
                                <input type="date" className="form-control" id="expensesFromDate" value={expensesFromDate} onChange={(e) => setExpensesFromDate(e.target.value)} />
                              </div>
                              <label className="control-label col align-self-center mb-0 p-0" htmlFor="expensesToDate">To:</label>
                              <div className="col pe-5">
                                <input type="date" className="form-control" id="expensesToDate" value={expensesToDate} onChange={(e) => setExpensesToDate(e.target.value)} />
                              </div>
                              <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  <div className="card-body pt-0">
                     <div className="table-responsive ">
                      <p className="float-end m-0">All Amounts In Rupees</p>
                        <table id="datatable" className="reports table table-striped table-bordered" data-toggle="" >
                           <thead>
                              <tr>
                                 <th>Sr</th>
                                 <th>Date</th>
                                 <th>Particulars</th>
                                 <th>Amounts</th>
                              </tr>
                           </thead>
                           <tbody>
                              {error ? (
                              <tr>
                                 <td colSpan="7" className="text-center text-danger">
                                    {error}
                                 </td>
                              </tr>
                              ) : expenses.length === 0 ? (
                              <tr>
                                 <td colSpan="7" className="text-center">
                                    No records found.
                                 </td>
                              </tr>
                              ) : (
                              expenses
                                 .sort((a, b) => new Date(a.date) - new Date(b.date))
                                 .map((expense, index) => (
                                   <tr key={expense.id}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(expense.date).toLocaleDateString('en-GB')}</td>
                                    <td>{expense.note}</td>
                                    <td>{formatIndianNumber(expense.amt.toFixed(2))}</td>
                                   </tr>
                                 ))
                              )}
                           </tbody>
                           <thead>
                              <tr>
                                 <th colSpan="3" className="text-end">
                                    Total
                                 </th>
                                 <th>{formatIndianNumber(totalAmt.toFixed(2))}</th>
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

export default Expenses;