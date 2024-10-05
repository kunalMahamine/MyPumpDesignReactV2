import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import apiClient from '../utils/apiClient'; 
import Notification from '../utils/notification'; 

function Daily() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, []); // fromDate, toDate

  const fetchData = async (from, to) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`DayBooks`, {
        params: {
          from: from,
          to: to
        }
      });
      console.log("response: " + JSON.stringify(response));
      const fetchedData = response.data || [];
      console.log("fetchedData: " + JSON.stringify(fetchedData));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching Daily data:', error);
      setError('Failed to load Daily Report. Please try again later.');

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
      totalCredits: 0,
      totalDebits: 0,
      drawerCash: 0
    };

    data.forEach((item) => {
      totals.totalCredits += item.totalCredits || 0;
      totals.totalDebits += item.totalDebits || 0;
      totals.drawerCash += item.drawerCash || 0;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="boxed-inner">
    {loading && <Loader />}
    {error && <Notification message={error} />}
      <span className="screen-darken"></span>
      <main className="main-content">
        <NavBar />
        <div className="conatiner-fluid content-inner pb-0">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Debit, Credit, & Cash Report</h4>
                  </div>
                  <div className="float-end">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="dailyReportFromDate">From:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="dailyReportFromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <label className="control-label col align-self-center mb-0 p-0" htmlFor="dailyReportToDate">To:</label>
                        <div className="col pe-5">
                          <input type="date" className="form-control" id="dailyReportToDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary col mx-3">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {loading ? <Loader /> : (
                    <div className="table-responsive">
                      <p className="float-end m-0">All Amounts In Rupees</p>
                      <table id="datatable" className="reports table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>Total Credits</th>
                            <th>Total Debits</th>
                            <th>Cash</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{new Date(row.date).toLocaleDateString('en-GB')}</td>
                              <td>{parseFloat(row.totalCredits).toFixed(2)}</td>
                              <td>{parseFloat(row.totalDebits).toFixed(2)}</td>
                              <td>{parseFloat(row.drawerCash).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <thead>
                          <tr>
                            <th colSpan="2" className="text-end">Total</th>
                            <th>{parseFloat(totals.totalCredits).toFixed(2)}</th>
                            <th>{parseFloat(totals.totalDebits).toFixed(2)}</th>
                            <th>{parseFloat(totals.drawerCash).toFixed(2)}</th>
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

export default Daily;
