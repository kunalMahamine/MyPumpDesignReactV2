import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';

import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function Customerledger() {
    const query = useQuery();
    const customerId = query.get('customerId');

    const [customer, setCustomer] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [debitTotal, setDebitTotal] = useState(0);
    const [creditTotal, setCreditTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch customer data
                const customerResponse = await apiClient.get(`customers/${customerId}`);
                setCustomer(customerResponse.data);
                // Fetch transactions for the customer's ledger
                const { ledgerId } = customerResponse.data;
                const transactionsResponse = await apiClient.get(`LedgerTransactions/ledger/${ledgerId}`);
                setTransactions(transactionsResponse.data);
                // Calculate debit and credit totals
                let debitSum = 0;
                let creditSum = 0;
                transactionsResponse.data.forEach((transaction) => {
                    if (transaction.amt >= 0) {
                        debitSum += transaction.amt;
                    } else {
                        creditSum += -transaction.amt;
                    }
                });
                setDebitTotal(debitSum);
                setCreditTotal(creditSum);
    
            } catch (error) {
                console.error('Error fetching customer ledger data:', error);
                setError('Failed to load customer ledger data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [customerId]);

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
                        <h4 className="card-title">{customer.name}</h4>
                     </div>
                     {/* <!-- <div className="">
                      <div className="float-end">
                          <a className="btn btn-sm btn-icon btn-info" title="View Customer Details" data-bs-toggle="modal" data-bs-target="#staticBackdropViewCustomerDetails">
                              <span className="btn-inner">
                                  <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1614 12.0531C15.1614 13.7991 13.7454 15.2141 11.9994 15.2141C10.2534 15.2141 8.83838 13.7991 8.83838 12.0531C8.83838 10.3061 10.2534 8.89111 11.9994 8.89111C13.7454 8.89111 15.1614 10.3061 15.1614 12.0531Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>                                
                                  </svg>                            
                              </span>
                          </a>
                          <a className="btn btn-sm btn-icon btn-primary flex-end" title="Edit Customer Details" data-bs-toggle="modal" data-bs-target="#staticBackdropEditCustomerDetails">
                              <span className="btn-inner">
                                  <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                      <path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                      <path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  </svg>
                              </span>
                          </a>
                        </div>
                          <div className="modal fade" id="staticBackdropViewCustomerDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelViewCustomerDetails" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabelViewCustomerDetails">View Customer Details</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="card">
                                            <div className="card-header">
                                               <div className="header-title row">
                                                  <h4 className="card-title col">Name:</h4>
                                                  <h4 className="card-title col">Goyal Rice Mill</h4>
                                               </div>
                                            </div>
                                            <div className="card-body">
                                               <div className="mt-2 row">
                                               <h6 className="mb-1 col">Address:</h6>
                                               <p className="mb-1 col float-left">MG Road, East Street</p>
                                               </div>
                                               <div className="mt-2 row">
                                               <h6 className="mb-1 col">City/Village:</h6>
                                               <p className="mb-1 col float-left">Hoshiyarpur</p>
                                               </div>
                                               <div className="mt-2 row">
                                                <h6 className="mb-1 col">Pin Code:</h6>
                                                <p className="mb-1 col float-left">146001</p>
                                                </div>
                                                <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Phone Number:</h6>
                                                    <p className="mb-1 col float-left">9899099000</p>
                                                </div>
                                               <div className="mt-2 row">
                                                <h6 className="mb-1 col">Email Address:</h6>
                                                <p className="mb-1 col float-left"> austin@gmail.com</p>
                                                </div>
                                                <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Ledger Number:</h6>
                                                    <p className="mb-1 col float-left">L111</p>
                                                </div>
                                                <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Balance:</h6>
                                                    <p className="mb-1 col float-left">&#8377; 85500 Debit</p>
                                                </div>
                                                <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Effective From Date:</h6>
                                                    <p className="mb-1 col float-left">10/03/2024</p>
                                                </div>
                                            </div>
                                         </div>
                                        <div className="text-start mt-2 text-center">
                                            <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal">Okay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      <div className="modal fade" id="staticBackdropEditCustomerDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelEditCustomerDetails" aria-hidden="true">
                          <div className="modal-dialog">
                              <div className="modal-content">
                                  <div className="modal-header">
                                      <h5 className="modal-title" id="staticBackdropLabelEditCustomerDetails">Edit Customer Details</h5>
                                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div className="modal-body">
                                      <div className="form-group">
                                          <input type="text" className="form-control" id="editCustomerName" placeholder="Customer Name" value="Goyal Rice Mill">
                                      </div>
                                      <div className="form-group">
                                          <input type="text" className="form-control" id="editCustomerAddress" placeholder="Address" value="MG Road, East Street">
                                      </div>
                                      <div className="row">
                                      <div className="form-group col-9">
                                          <input type="text" className="form-control" id="editCustomerCity"  placeholder="City/Village" value="Hoshiyarpur">
                                      </div>
                                      <div className="form-group col-3">
                                          <input type="text" className="form-control" id="editCustomerPincode" placeholder="PinCode" value="146001">
                                      </div>
                                      </div>
                                      <div className="form-group">
                                          <input type="text" className="form-control" id="editCustomerPhoneNumber" placeholder="Phone Number" value="9899099000">
                                      </div>
                                      <div className="form-group">
                                          <input type="email" className="form-control" id="editCustomerEmail" placeholder="Email Address" value="adminuser@goyalmill.com">
                                      </div>
                                      <div className="row">
                                      <div className="form-group col">
                                          <input type="text" className="form-control" id="editCustomerLedgerNo" placeholder="Ledger No" value="L111">
                                      </div>
                                      <div className="form-group col">
                                          <input type="text" className="form-control" id="editCustomerOpeningBalance" placeholder="0.00" title="Opening Balance" value="5000.00">
                                      </div>
                                      <div className="form-group col">
                                          <input type="date" className="form-control" id="editCustomerOpeningBalanceDate" value="2024-05-18">
                                      </div>
                                      </div>
                                      <div className="row">
                                          <span className="col">Balance Type</span>
                                          <div className="form-check col">
                                              <input className="form-check-input" type="radio" name="editCustomerBalance" id="editCustomerDebitBalance" value="debitBalance" checked>
                                              <label className="form-check-label" for="editCustomerDebitBalance">Debit</label>
                                          </div>
                                          <div className="form-check col">
                                              <input className="form-check-input" type="radio" name="editCustomerBalance" id="editCustomerCreditBalance" value="creditBalance">
                                              <label className="form-check-label" for="editCustomerCreditBalance">Credit</label>
                                          </div>
                                      </div>
                                      <div className="text-start mt-2 text-center">
                                          <button type="button" className="btn btn-primary m-1" data-bs-dismiss="modal">Update</button>
                                          <button type="button" className="btn btn-danger m-1">Cancel</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div> --> */}
                </div>
                  <div className="card-body">
                     <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>{customer.ledgerNo}</th>
                                <th>{customer.cityVillage}</th>
                                <th>{customer.phoneNumber}</th>
                                <th className="text-center">Debit Amount: {debitTotal}</th>
                                <th className="text-center">Credit Amount: {creditTotal}</th>
                                <th className="text-center">Balance: {Math.abs(customer.balance)} {customer.balance < 0 ? 'Credit' : 'Debit'}</th>
                            </tr>
                        </thead>
                    </table>
                     <div className="table-responsive">
                        <table id="datatable" className="ledger table table-striped table-bordered"  data-toggle="data-table">
                           <thead>
                              <tr>
                                 <th>Sr</th>
                                 <th>Date</th>
                                 <th>Particulars</th>
                                 <th>Debits</th>
                                 <th>Credits</th>
                                 <th>Balance</th>
                              </tr>
                           </thead>
                           <tbody>
                        {transactions.map((transaction, index) => (
                          <tr key={transaction.Id}>
                            <td>{index + 1}</td>
                            <td>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                            <td>{transaction.note}</td>
                            <td>{transaction.amt >= 0 ? transaction.amt : ''}</td>
                            <td>{transaction.amt < 0 ? -transaction.amt : ''}</td>
                            <td>{transaction.balanceAfter}</td>
                          </tr>
                        ))}
                      </tbody>
                           <tfoot>
                              <tr>
                                  <th>Sr</th>
                                  <th>Date</th>
                                  <th>Particulars</th>
                                  <th>Debits</th>
                                  <th>Credits</th>
                                  <th>Balance</th>
                               </tr>
                           </tfoot>
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

export default Customerledger