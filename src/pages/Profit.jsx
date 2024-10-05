import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function Profit() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, []);

  const fetchData = async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`ProfitReport/GetProfitReport`, {
        params: {
          fromDate: from,
          toDate: to
        }
      });
      console.log("response: " + JSON.stringify(response));
      setData(response.data);
      console.log("data: " + JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching Profit data:', error);
      setError('Failed to load Profit Report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetchData(fromDate, toDate);
  };

  const calculateTotals = () => {
    const totals = {
      salesMS: 0,
      cogsMS: 0,
      profitMS: 0,
      salesHSD: 0,
      cogsHSD: 0,
      profitHSD: 0,
      salesOther: 0,
      cogsOther: 0,
      profitOther: 0,
      expenses: 0,
      totalSales: 0,
      totalExpenses: 0,
      totalProfit: 0
    };

    data.forEach((item) => {
      totals.salesMS += item.ms.msSoldAmount;
      totals.cogsMS += item.ms.msCOGS;
      totals.profitMS += item.ms.msProfit;
      totals.salesHSD += item.hsd.hsdSoldAmount;
      totals.cogsHSD += item.hsd.hsdCOGS;
      totals.profitHSD += item.hsd.hsdProfit;
      totals.salesOther += item.otherSales;
      totals.cogsOther += item.otherCOGS;
      totals.profitOther += item.profitOther;
      totals.expenses += item.expenses;
      totals.totalSales += item.ms.msSoldAmount + item.hsd.hsdSoldAmount + item.otherSales;
      totals.totalExpenses += item.ms.msCOGS + item.hsd.hsdCOGS + item.otherCOGS + item.expenses;
      totals.totalProfit += item.totalProfit;
    });

    return totals;
  };

  const roundToWholeNumber = (number) => Math.round(number);

  const totals = calculateTotals();

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
                    <h4 className="card-title">Profit Report</h4>
                  </div>
                  <div className="float-end">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="profitFromDate">From:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="profitFromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="profitToDate">To:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="profitToDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {loading ? <Loader /> : (
                    <div className="table-responsive">
                      {/* <p className="float-end m-0">All Amounts In Rupees</p> */}
                      <table id="datatable" className="reports table table-striped table-bordered" data-toggle="" >
                        <thead>
                          <tr>
                            <th colSpan="2">Amounts in &#8377;</th>
                            <th colSpan="3">MS - Petrol </th>
                            <th colSpan="3">HSD - Diesel</th>
                            <th colSpan="3">Others - Lubricants</th>
                            <th>Ledger</th>
                            <th colSpan="3">Total</th>
                          </tr>
                          <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>SalesMS</th>
                            <th>CogsMS</th>
                            <th>ProfitMS</th>
                            <th>SalesHSD</th>
                            <th>CogsHSD</th>
                            <th>ProfitHSD</th>
                            <th>SalesOthr</th>
                            <th>CogsOthr</th>
                            <th>ProfitOthr</th>
                            <th>Expenses</th>
                            <th>Sales</th>
                            <th>Expenses</th>
                            <th>Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                              <td>{roundToWholeNumber(item.ms.msSoldAmount)}</td>
                              <td>{roundToWholeNumber(item.ms.msCOGS)}</td>
                              <td>{roundToWholeNumber(item.ms.msProfit)}</td>
                              <td>{roundToWholeNumber(item.hsd.hsdSoldAmount)}</td>
                              <td>{roundToWholeNumber(item.hsd.hsdCOGS)}</td>
                              <td>{roundToWholeNumber(item.hsd.hsdProfit)}</td>
                              <td>{roundToWholeNumber(item.otherSales)}</td>
                              <td>{roundToWholeNumber(item.otherCOGS)}</td>
                              <td>{roundToWholeNumber(item.profitOther)}</td>
                              <td>{roundToWholeNumber(item.expenses)}</td>
                              <td>{roundToWholeNumber(item.ms.msSoldAmount + item.hsd.hsdSoldAmount + item.otherSales)}</td>
                              <td>{roundToWholeNumber(item.ms.msCOGS + item.hsd.hsdCOGS + item.otherCOGS + item.expenses)}</td>
                              <td>{roundToWholeNumber(item.totalProfit)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <thead>
                          <tr>
                            <th colSpan="2" className="text-end">Total</th>
                            <th>{roundToWholeNumber(totals.salesMS)}</th>
                            <th>{roundToWholeNumber(totals.cogsMS)}</th>
                            <th>{roundToWholeNumber(totals.profitMS)}</th>
                            <th>{roundToWholeNumber(totals.salesHSD)}</th>
                            <th>{roundToWholeNumber(totals.cogsHSD)}</th>
                            <th>{roundToWholeNumber(totals.profitHSD)}</th>
                            <th>{roundToWholeNumber(totals.salesOther)}</th>
                            <th>{roundToWholeNumber(totals.cogsOther)}</th>
                            <th>{roundToWholeNumber(totals.profitOther)}</th>
                            <th>{roundToWholeNumber(totals.expenses)}</th>
                            <th>{roundToWholeNumber(totals.totalSales)}</th>
                            <th>{roundToWholeNumber(totals.totalExpenses)}</th>
                            <th>{roundToWholeNumber(totals.totalProfit)}</th>
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
  );
}

export default Profit;
