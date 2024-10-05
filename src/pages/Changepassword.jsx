import React from 'react';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';

const changepassword = () => {
  return (
    <div>
    <div className="boxed-inner">
        <Loader />

    <span className="screen-darken"></span>
    <main className="main-content">
       
       <NavBar />
        
        <div className="conatiner-fluid content-inner pb-0">
         <div className="d-flex justify-content-center">
                     <div className="card card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
                        <div className="card-body">
                           <h4 className="mb-4 text-center">Change Password</h4>
                           <form>
                                    <div className="form-group">
                                       <input type="password" className="form-control" id="current-password" placeholder="Current Password" />
                                    </div>
                                    <div className="form-group">
                                       <input type="password" className="form-control" id="new-password" placeholder="New Password" />
                                    </div>
                                    <div className="form-group">
                                       <input type="text" className="form-control" id="confirm-password" placeholder="Confirm New Password" />
                                    </div>
                              <div className="d-flex mt-4 justify-content-center">
                                 <button type="button" className="btn btn-primary m-1">Change</button>
                                 <button type="button" className="btn btn-danger m-1">Cancel</button>
                              </div>
                           </form>
                        </div>
                     </div>
            </div>  
        </div>
        <Footer />
     </main>
    </div>
    </div>
  )
}

export default changepassword