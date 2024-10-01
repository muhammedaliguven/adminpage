import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Varsayılan kullanıcı adı ve şifre
    const validUsername = "admin";
    const validPassword = "123";

    // Kullanıcı adı ve şifreyi kontrol et
    if (username === validUsername && password === validPassword) {
      // Doğruysa ana menüye yönlendir
      navigate("/sidebar");
    } else {
      // Yanlışsa hata mesajı göster
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;