import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import Editor from './components/Editor';

const Root = () => {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        {/* Route for Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Route for Login */}
        <Route path="/login" element={<Login setToken={setToken} />} />

        {/* Protected Route for Editor */}
        <Route
          path="/editor"
          element={
            token ? (
              <Editor token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route for App */}
        <Route
          path="/"
          element={
            token ? (
              <App token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default Root;
