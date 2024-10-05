import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient';
import Notification from '../utils/notification';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';


//const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min');

function Customers() {
    const [id, setId] = useState(0);
    const [ledgerId, setLedgerId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [cityVillage, setCityVillage] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [balanceType, setBalanceType] = useState('Debit');
    const [actOpeningDate, setActOpeningDate] = useState(new Date().toISOString().substring(0, 10));
    const [balance, setBalance]=useState('');
    const [ledgerNo, setLedgerNo]=useState('');
    const [customerList, setCustomerList]= useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiClient.get('customers');
                setCustomerList(res.data);
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError('Failed to load customers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const validateInputs = () => {
        if (!name.trim()) {
            setValidationError('Customer Name is required.');
            return false;
        }
        if (balance===''|| balance === null || balance === undefined || isNaN(balance) || parseFloat(balance) < 0) {
            setValidationError('Opening Balance is required and must be a non-negative number.');
            return false;
        }
        if (!actOpeningDate || isNaN(new Date(actOpeningDate).getTime())) {
            setValidationError('Effective From Date is required and must be a valid date.');
            return false;
        }
        if (pinCode && (!/^\d{6}$/.test(pinCode))) {
            setValidationError('Pin code must be a 6-digit number.');
            return false;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setValidationError('Invalid email address format.');
            return false;
        }
        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            setValidationError('Phone number must be a 10-digit number.');
            return false;
        }
        if (!balanceType) {
            setValidationError('Balance Type is required.');
            return false;
        }
        setValidationError(null);
        return true;
    };

    const onFormSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) return;
        setLoading(true);
        setError(null);
        const customerData={
            id: id,
            ledgerId: ledgerId,
            name:name,
            email: email,
            phoneNumber:phoneNumber,
            address: address,
            cityVillage: cityVillage,
            pinCode: pinCode,
            balanceType: balanceType,
            actOpeningDate: actOpeningDate,
            balance:balance,
            ledgerNo: ledgerNo
        }
        console.log(name, email, phoneNumber, address,cityVillage, pinCode, balanceType, actOpeningDate, balance, ledgerNo );
        
        try {
            // Post the customer data
            await apiClient.post('customers', customerData);
            // Fetch the updated customer list after successful post
            const res = await apiClient.get('customers');
            setCustomerList(res.data);
            alert('Customer Information Saved successfully');

            closeModal('staticBackdropAddNewCustomer');

            //Refresh the page after successful submission
            //window.location.reload(); // Refresh the whole page

            clearCustomer();
        } catch (error) {
            console.error('Error submitting customer data:', error);
            setError('Failed to submit customer data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

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

    const handleRadioChange = (value) => { setBalanceType(value); }; 

    const clearCustomer=()=>{
        setId(0);
        setLedgerId(0);
        setName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setCityVillage('');
        setPinCode('');
        setBalanceType('Debit');
        setActOpeningDate(new Date().toISOString().substring(0,10));
        setBalance('');
        setLedgerNo('');
        setIsEditMode(false); // Set form to add mode
        setValidationError(null); // Clear validation error
    }

    const setCustomer=(cust)=>
    {
        if(cust)
        {
            setId(cust.id);
            setLedgerId(cust.ledgerId);
            setName(cust.name || '');
            setEmail(cust.email || '');
            setPhoneNumber(cust.phoneNumber || '');
            setAddress(cust.address || '');
            setCityVillage(cust.cityVillage || '');
            setPinCode(cust.pinCode || '');
            setBalanceType(cust.balanceType || 'Debit');
            // Adjust the account opening date to account for timezone differences before converting to ISO string format.
            // This ensures that the date remains accurate and does not shift due to timezone offsets.
            setActOpeningDate(new Date(new Date(cust.actOpeningDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0,10));
            //setActOpeningDate(new Date(cust.actOpeningDate).toISOString().substring(0,10));
            //setActOpeningDate(new Date(cust.actOpeningDate).toLocaleDateString('en-GB'));
            setBalance(cust.balance !== undefined && cust.balance !== null ? cust.balance : ''); // Proper handling of zero value
            setLedgerNo(cust.ledgerNo || '');
            setIsEditMode(true); // Set form to edit mode
         }
         console.log(cust);
    }

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
                            <h4 className="card-title mb-0">Customers</h4>
                        </div>
                        <div className="">
                            <a href="#" className=" text-center btn btn-primary btn-icon mt-lg-0 mt-md-0 mt-3" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewCustomer" onClick={clearCustomer}>
                                <i className="btn-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </i>
                                <span>Add New Customer</span>
                            </a>
                            <div className="modal fade" id="staticBackdropAddNewCustomer" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelAddNewCustomer" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabelAddNewCustomer">
                                                {isEditMode ? 'Edit Customer Details' : 'Add New Customer'}
                                            </h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                        <form onSubmit={onFormSubmit}>
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="addNewCustomerName" placeholder="Customer Name" />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="addNewCustomerAddress" placeholder="Address" />
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-9">
                                                    <input type="text" className="form-control" value={cityVillage} onChange={(e) => setCityVillage(e.target.value)} id="addNewCustomerCity" placeholder="City/Village" />
                                                </div>
                                                <div className="form-group col-3">
                                                    <input type="text" className="form-control" value={pinCode} onChange={(e) => setPinCode(e.target.value)} id="addNewCustomerPincode" placeholder="PinCode" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} id="addNewCustomerPhoneNumber" placeholder="Mobile Number" />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="addNewCustomerEmail" placeholder="Email Address" />
                                            </div>
                                            <div className="row">
                                                <div className="form-group col">
                                                    <input type="text" className="form-control" title='Ledger No.' value={ledgerNo} onChange={(e) => setLedgerNo(e.target.value)} id="addNewCustomerLedgerNo" placeholder="Ledger No" />
                                                </div>
                                                {!isEditMode && (
                                                    <>
                                                        <div className="form-group col">
                                                            <input type="text" className="form-control" title="Opening Balance" value={balance} onChange={(e) => setBalance(e.target.value)} id="addNewCustomerOpeningBalance" placeholder="0.00" />
                                                        </div>
                                                        <div className="form-group col">
                                                            <input type="date" className="form-control" title='Account Opening Date' value={actOpeningDate} onChange={(e) => setActOpeningDate(e.target.value)} id="addNewCustomerOpeningBalanceDate" placeholder='dd/mm/yyyy' />
                                                        </div>
                                                        <div className="row">
                                                            <span className="col">Balance Type</span>
                                                            <div className="form-check col">
                                                                <input className="form-check-input" type="radio" name="BalenceType" onChange={() => handleRadioChange("Debit")} value="DB" checked={balanceType === 'Debit'} id='addNewCustomerDebitBalance' />
                                                                <label className="form-check-label" htmlFor="addNewCustomerDebitBalance">Debit</label>
                                                            </div>
                                                            <div className="form-check col">
                                                                <input className="form-check-input" type="radio" name="BalenceType" onChange={() => handleRadioChange("Credit")} checked={balanceType === 'Credit'} value="CR" id='addNewCustomerCreditBalance' />
                                                                <label className="form-check-label" htmlFor="addNewCustomerCreditBalance">Credit</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-start mt-2 text-center">
                                                {validationError && <Notification message={validationError} />}
                                                <button type="submit" className="btn btn-primary m-1" disabled={loading}>
                                                    {loading ? 'Saving...' : 'Save'}
                                                </button>
                                                <button type="button" className="btn btn-danger m-1" data-bs-dismiss="modal">Cancel</button>
                                            </div>
                                            </form>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id="staticBackdropViewCustomerDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabelViewCustomerDetails" aria-hidden="true">
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
                                                      <h4 className="card-title col">{name}</h4>
                                                   </div>
                                                </div>
                                                <div className="card-body">
                                                   <div className="mt-2 row">
                                                   <h6 className="mb-1 col">Address:</h6>
                                                   <p className="mb-1 col float-left">{address}</p>
                                                   </div>
                                                   <div className="mt-2 row">
                                                   <h6 className="mb-1 col">City/Village:</h6>
                                                   <p className="mb-1 col float-left">{cityVillage}</p>
                                                   </div>
                                                   <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Pin Code:</h6>
                                                    <p className="mb-1 col float-left">{pinCode}</p>
                                                    </div>
                                                    <div className="mt-2 row">
                                                        <h6 className="mb-1 col">Phone Number:</h6>
                                                        <p className="mb-1 col float-left">{phoneNumber}</p>
                                                    </div>
                                                   <div className="mt-2 row">
                                                    <h6 className="mb-1 col">Email Address:</h6>
                                                    <p className="mb-1 col float-left">{email}</p>
                                                    </div>
                                                    <div className="mt-2 row">
                                                        <h6 className="mb-1 col">Ledger Number:</h6>
                                                        <p className="mb-1 col float-left">{ledgerNo}</p>
                                                    </div>
                                                    <div className="mt-2 row">
                                                        <h6 className="mb-1 col">Balance:</h6>
                                                        <p className="mb-1 col float-left">
                                                            &#8377; {balance !== null && balance !== undefined ? Math.abs(parseFloat(balance).toFixed(2)) : '0.00'} 
                                                            {balance < 0 ? 'Credit' : 'Debit'}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 row">
                                                        <h6 className="mb-1 col">Effective From Date:</h6>
                                                        <p className="mb-1 col float-left">{new Date(actOpeningDate).toLocaleDateString('en-GB')}</p>
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
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className="">CUSTOMER NAME</th>
                                        <th className="">CITY/VILLAGE</th>
                                        <th className="">PHONE NO</th>
                                        <th className="text-center">BALANCE</th>
                                        <th className="text-center">DR/CR</th>
                                        <th className="text-center">LEDGER</th>
                                        <th className="text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerList.map(item=>{
                                    return(
                                    <tr key={item.id} className="">
                                        <td className="">{item.name}</td>
                                        <td className="">{item.cityVillage}</td>
                                        <td className="">{item.phoneNumber}</td>
                                        <td className="text-center">{balance !== null && balance !== undefined ? Math.abs(parseFloat(item.balance).toFixed(2)) : '0.00'}</td>
                                        <td className="text-center">{item.balance < 0 ? 'Credit' : 'Debit'}</td>
                                        <td className="text-center">{item.ledgerNo}</td>
                                        <td>
                                            <div className="float-end">
                                                <Link className="nav-link btn btn-sm btn-icon btn-success me-1" title="View Customer Ledger" to={`/customerledger?customerId=${item.id}`} target="_top">
                                                    <span className="btn-inner ">
                                                        <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.7379 2.76175H8.08493C6.00493 2.75375 4.29993 4.41175 4.25093 6.49075V17.2037C4.20493 19.3167 5.87993 21.0677 7.99293 21.1147C8.02393 21.1147 8.05393 21.1157 8.08493 21.1147H16.0739C18.1679 21.0297 19.8179 19.2997 19.8029 17.2037V8.03775L14.7379 2.76175Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M14.2882 15.3584H8.88818" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M12.2432 11.606H8.88721" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </span>                            
                                                </Link>
                                                <button className="btn btn-sm btn-icon btn-info me-1" title="View Customer Details" data-bs-toggle="modal" data-bs-target="#staticBackdropViewCustomerDetails" onClick={setCustomer.bind(this, item)} >
                                                    <span className="btn-inner">
                                                        <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M15.1614 12.0531C15.1614 13.7991 13.7454 15.2141 11.9994 15.2141C10.2534 15.2141 8.83838 13.7991 8.83838 12.0531C8.83838 10.3061 10.2534 8.89111 11.9994 8.89111C13.7454 8.89111 15.1614 10.3061 15.1614 12.0531Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.998 19.355C15.806 19.355 19.289 16.617 21.25 12.053C19.289 7.48898 15.806 4.75098 11.998 4.75098H12.002C8.194 4.75098 4.711 7.48898 2.75 12.053C4.711 16.617 8.194 19.355 12.002 19.355H11.998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>                                
                                                        </svg>                            
                                                    </span>
                                                </button>
                                                <button className="btn btn-sm btn-icon btn-primary flex-end" title="Edit Customer Details" data-bs-toggle="modal" data-bs-target="#staticBackdropAddNewCustomer" onClick={setCustomer.bind(this, item)} >
                                                    <span className="btn-inner">
                                                        <svg className="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                            <path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                    }) }
                                </tbody>
                            </table>
                            <div className="text-center">
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
  

export default Customers