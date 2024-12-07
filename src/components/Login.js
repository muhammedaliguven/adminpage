import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/axiosInstance';
import '../styles.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Varsayılan kullanıcı adı ve şifre
    const validUsername = "admin";
    const validPassword = "123";

    try {
      const response = await axiosInstance.post('/api/user/isPresent', {
        username,
        password,
      });
      console.log(response);
      // Başarılı giriş
      if (response.data) {
        // Token'ı localStorage'da saklayın (ya da isteğe bağlı başka bir yerde)
        localStorage.setItem('token', response.data.token);

        // Ana sayfaya yönlendir
        navigate('/app/category')
      }
    } catch (error) {
      // Hata durumunda hata mesajını göster
      console.log(error);
      setError('Kullanıcı adı veya şifre hatalı!');
    }

    // Kullanıcı adı ve şifreyi kontrol et
    if (username === validUsername && password === validPassword) {
      // Doğruysa ana menüye yönlendir
      navigate('/app/category')
    } else {
      // Yanlışsa hata mesajı göster
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Kullanıcı Adı:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Şifre:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-button"
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
