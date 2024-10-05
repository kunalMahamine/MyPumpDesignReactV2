// src/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-body">
        <ul className="left-panel list-inline mb-0 p-0">
          {/* <li className="list-inline-item"><a href="dashboard/extra/privacy-policy.html">Privacy Policy</a></li>
          <li className="list-inline-item"><a href="dashboard/extra/terms-of-service.html">Terms of Use</a></li> */}
        </ul>
         <div className="right-panel"> {/*MyPump, Designed and Developed by <a href="https://binarybird.in/">Binary Bird.</a> */}
           ©{currentYear} MyPump, Designed and Developed by <a href="https://binarybird.in/">Binary Bird</a>.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
