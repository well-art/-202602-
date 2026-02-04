import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2693988') {
      onLogin();
    } else {
      setError('密碼錯誤，請重新輸入');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div 
        className={`bg-white p-12 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-corp-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="text-white w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-corp-gray mb-3">智匯中心</h1>
          <p className="text-gray-500 text-base">請輸入授權碼以存取資料</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="password" className="block text-base font-medium text-corp-gray mb-2">
              存取密碼
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-corp-green focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest text-corp-gray"
              placeholder="•••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-base mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-corp-green hover:bg-[#1f8c3c] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center group text-lg"
          >
            <span>進入系統</span>
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="mt-10 text-center text-sm text-gray-500 border-t pt-6 border-gray-100">
          僅供內部使用，嚴禁未經授權之外流與攜出。
        </div>
      </div>
    </div>
  );
};

export default Login;