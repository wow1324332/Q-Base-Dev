import React, { useState, useEffect } from 'react';
import { 
  MonitorSmartphone, Settings, LogOut, Power, User, Users, 
  LayoutDashboard, Server, Download, ShieldCheck, 
  Filter, Grid, List, Plus, ChevronRight, ChevronLeft, X, Upload
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, writeBatch, updateDoc, addDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATKKSrUm6NKATdZdJeDxhQ5Dj2Q32ujh0",
  authDomain: "q-base-dev.firebaseapp.com",
  projectId: "q-base-dev",
  storageBucket: "q-base-dev.firebasestorage.app",
  messagingSenderId: "756427289812",
  appId: "1:756427289812:web:217c6ebb1bfbd1d931f741"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_DEVICES = [
  { id: 'd1', name: 'Galaxy Z Fold 5', type: 'Fold', os: 'Android', status: '보관중', renter: '', manufacturer: 'Samsung' },
  { id: 'd2', name: 'iPhone 15 Pro', type: 'Bar', os: 'iOS', status: '사용중', renter: '홍길동', manufacturer: 'Apple' },
  { id: 'd3', name: 'Galaxy S24 Ultra', type: 'Bar', os: 'Android', status: '대여중', renter: '김철수', manufacturer: 'Samsung' },
  { id: 'd4', name: 'Galaxy Z Flip 4', type: 'Flip', os: 'Android', status: '보관중', renter: '', manufacturer: 'Samsung' },
  { id: 'd5', name: 'iPhone 13 Mini', type: 'Bar', os: 'iOS', status: '보관중', renter: '', manufacturer: 'Apple' },
];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap');

  body {
    font-family: 'Pretendard', sans-serif;
    background-color: #f8f9fa;
    color: #1f2937;
    overflow: hidden;
  }

  @keyframes cinematicFadeIn {
    0% { opacity: 0; transform: translateY(15px); filter: blur(4px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  .animate-fade-in { animation: cinematicFadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

  @keyframes simpleFade {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-simple-fade { animation: simpleFade 0.5s ease-in-out forwards; }

  @keyframes breathing {
    0% { box-shadow: 0 0 0px rgba(156, 163, 175, 0); border-color: transparent; }
    50% { box-shadow: 0 0 15px rgba(156, 163, 175, 0.4); border-color: rgba(209, 213, 219, 0.8); }
    100% { box-shadow: 0 0 0px rgba(156, 163, 175, 0); border-color: transparent; }
  }
  .hover-breath { transition: all 0.3s ease; }
  .hover-breath:hover { animation: breathing 2.5s infinite ease-in-out; transform: translateY(-2px); }

  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .bg-cinematic {
    background: linear-gradient(-45deg, #f8f9fa, #e9ecef, #dee2e6, #f8f9fa);
    background-size: 400% 400%;
    animation: gradientBG 10s ease infinite;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const AppLogo = ({ className }) => {
  const [imgError, setImgError] = useState(false);
  
  if (imgError) {
    return <MonitorSmartphone className={`text-gray-800 ${className}`} strokeWidth={1.5} />;
  }
  return (
    <img 
      src="/icon-192x192.png" 
      alt="QA Base" 
      className={`object-contain ${className}`} 
      onError={() => setImgError(true)} 
    />
  );
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100 flex items-center space-x-3">
      <ShieldCheck className="w-5 h-5 text-gray-700" />
      <span className="text-sm font-medium text-gray-800">{message}</span>
    </div>
  );
};

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-cinematic flex flex-col items-center justify-center animate-simple-fade">
      <div className="animate-fade-in flex flex-col items-center">
        <AppLogo className="w-32 h-32 mb-6 relative z-10" />
        <h1 className="text-4xl font-light tracking-widest text-gray-800 mb-2">QA BASE</h1>
        <p className="text-sm text-gray-500 tracking-wider">Quality Assurance Command Center</p>
        <div className="w-48 h-1 bg-gray-200 rounded-full mt-12 overflow-hidden">
          <div className="h-full bg-gray-600 rounded-full w-full origin-left animate-[scaleX_3s_ease-in-out]"></div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, onInstallApp }) => {
  const [tab, setTab] = useState('login');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('qaBaseId');
    const savedPw = localStorage.getItem('qaBasePw');
    if (savedId && savedPw) {
      setId(savedId);
      setPw(savedPw);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.trim() || !pw.trim()) return;

    if (remember) {
      localStorage.setItem('qaBaseId', id);
      localStorage.setItem('qaBasePw', pw);
    } else {
      localStorage.removeItem('qaBaseId');
      localStorage.removeItem('qaBasePw');
    }

    let userRole = 'user';
    let userName = name || id;

    if (id.trim() === 'wow1324332' && pw === 'djslzja1!') {
      userRole = 'admin';
      userName = 'ADMIN';
    }

    try {
      const userRef = doc(db, 'users', id.trim());
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.name) userName = userData.name;
        if (userData.profileImage) {
          onLogin({ id: id.trim(), name: userName, role: userRole, profileImage: userData.profileImage });
          return;
        }
      } else if (tab === 'create') {
         await setDoc(userRef, { name: userName, role: userRole });
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }

    onLogin({ id: id.trim(), name: userName, role: userRole, profileImage: null });
  };

  const handleGuest = () => {
    onLogin({ id: 'guest', name: 'Guest', role: 'viewer', profileImage: null });
  };

  return (
    <div className="w-screen h-screen bg-[#f0f2f5] flex items-center justify-center relative animate-simple-fade">
      <button 
        onClick={onInstallApp}
        className="absolute top-8 right-8 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur hover-breath shadow-sm border border-gray-100"
      >
        <Download className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wide">앱 설치</span>
      </button>

      <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white p-8 animate-fade-in relative z-10">
        <div className="flex justify-center mb-8">
          <AppLogo className="w-20 h-20" />
        </div>

        <div className="flex w-full mb-8 relative border-b border-gray-200">
          <button 
            type="button"
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button 
            type="button"
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${tab === 'create' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setTab('create')}
          >
            Create
          </button>
          <div className={`absolute bottom-0 h-[2px] bg-gray-800 w-1/2 transition-transform duration-300 ease-out ${tab === 'login' ? 'translate-x-0' : 'translate-x-full'}`}></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="ID" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>
          
          {tab === 'create' && (
            <div className="animate-fade-in">
              <input 
                type="text" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          )}

          {tab === 'login' && (
            <div className="flex items-center space-x-2 pt-1">
              <input 
                type="checkbox" 
                id="remember" 
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800 accent-gray-800 cursor-pointer shadow-sm"
              />
              <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">로그인 기억하기</label>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button 
              type="submit" 
              className="w-full bg-gray-800 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-300"
            >
              {tab === 'login' ? '로그인' : '계정 생성'}
            </button>
            <button 
              type="button" 
              onClick={handleGuest}
              className="w-full bg-white text-gray-600 border border-gray-200 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
              게스트로 시작 (Viewer)
            </button>
          </div>
        </form>
      </div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s'}}></div>
    </div>
  );
};

const TransitionLoading = ({ title, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] flex flex-col items-center justify-center animate-simple-fade absolute inset-0 z-50">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full shadow-inner"></div>
        <div className="absolute inset-0 border-2 border-gray-800 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-sm text-gray-500 tracking-widest uppercase animate-pulse">{title} 로딩중...</p>
    </div>
  );
};

const FunctionalBoard = ({ user, onNavigate, onLogout, onShowProfileModal, onShowAdminModal }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const onlineUsersCount = 1;

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] flex flex-col animate-simple-fade">
      <header className="h-20 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <AppLogo className="w-8 h-8" />
          <span className="text-xl font-medium tracking-wider text-gray-800">QA BASE</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-md hover-breath cursor-default">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">{onlineUsersCount}명 접속중</span>
          </div>

          {user.role === 'admin' && (
            <button 
              onClick={onShowAdminModal}
              className="p-2 text-gray-400 hover:text-gray-800 transition-colors hover-breath rounded-full bg-white shadow-sm border border-gray-100"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover-breath p-1 pr-3 bg-white rounded-full border border-gray-200 shadow-md"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                {user.profileImage ? <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 animate-fade-in z-50">
                <button 
                  onClick={() => { setShowProfileMenu(false); onShowProfileModal(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <User className="w-4 h-4 mr-3" /> 프로필 수정
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-3" /> 로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-12 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-light text-gray-800 mb-2">Functional Board</h2>
          <p className="text-sm text-gray-500 mb-10">원하는 업무 기지를 선택하세요.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => onNavigate('dashboard')}
              className="bg-white rounded-3xl p-8 cursor-pointer border border-gray-200 shadow-md hover-breath group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-500 shadow-sm border border-gray-100">
                <Server className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Devices</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                QA 검증용 시료(단말기) 현황을 조회하고<br/>상태 및 대여 현황을 관리합니다.
              </p>
            </div>
            
            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 opacity-60">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
                <LayoutDashboard className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">Test Cases</h3>
              <p className="text-sm text-gray-400 leading-relaxed">준비중인 기능입니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileModal = ({ user, onClose, onUpdateProfile }) => {
  const [imagePreview, setImagePreview] = useState(user.profileImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    onUpdateProfile(imagePreview);
    try {
       const userRef = doc(db, 'users', user.id);
       await updateDoc(userRef, { profileImage: imagePreview }, { merge: true });
    } catch(err) {
       await setDoc(doc(db, 'users', user.id), { profileImage: imagePreview, name: user.name, role: user.role });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] border border-gray-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-gray-600"/> 프로필 수정</h3>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden border border-gray-200 shadow-inner">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl text-gray-400 font-medium">{user.name.charAt(0)}</span>
            )}
          </div>
          <label className="cursor-pointer bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm flex items-center">
            <Upload className="w-4 h-4 mr-2" /> 이미지 선택
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <button onClick={handleSave} className="w-full bg-gray-800 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-900 transition-colors shadow-md">저장하기</button>
      </div>
    </div>
  );
};

const AdminModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] border border-gray-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-gray-600"/> 가입 신청 승인</h3>
        <p className="text-sm text-gray-500 mb-6">현재 대기 중인 가입 신청이 없습니다.</p>
        <button onClick={onClose} className="w-full bg-gray-100 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">닫기</button>
      </div>
    </div>
  );
};

const DeviceAddModal = ({ isOpen, onClose, formData, setFormData, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] border border-gray-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center"><Plus className="w-5 h-5 mr-2 text-gray-600"/> 디바이스 추가</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div><label className="text-xs font-medium text-gray-500 mb-1 block">디바이스명</label><input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500 mb-1 block">제조사</label><input required value={formData.manufacturer} onChange={e=>setFormData({...formData, manufacturer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 mb-1 block">OS</label><select value={formData.os} onChange={e=>setFormData({...formData, os: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>Android</option><option>iOS</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500 mb-1 block">형태</label><select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>Bar</option><option>Fold</option><option>Flip</option></select></div>
            <div><label className="text-xs font-medium text-gray-500 mb-1 block">상태</label><select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>보관중</option><option>사용중</option><option>대여중</option></select></div>
          </div>
          <div><label className="text-xs font-medium text-gray-500 mb-1 block">시리얼 번호</label><input value={formData.serial} onChange={e=>setFormData({...formData, serial: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
          <div><label className="text-xs font-medium text-gray-500 mb-1 block">사용/대여자</label><input value={formData.renter} onChange={e=>setFormData({...formData, renter: e.target.value})} placeholder="상태가 보관중이면 비워두세요" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
          <button type="submit" className="w-full bg-gray-800 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-900 transition-colors mt-2 shadow-md">저장하기</button>
        </form>
      </div>
    </div>
  );
};

const DeviceDetailModal = ({ device, onClose, onUpdate, onDelete, user }) => {
  if (!device) return null;
  const isViewer = user.role === 'viewer';
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({...device});

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setEditMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] border border-gray-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        <h3 className="text-lg font-medium text-gray-800 mb-4">디바이스 상세 정보</h3>
        
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
             <div><label className="text-xs font-medium text-gray-500 mb-1 block">디바이스명</label><input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs font-medium text-gray-500 mb-1 block">제조사</label><input required value={formData.manufacturer} onChange={e=>setFormData({...formData, manufacturer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
               <div><label className="text-xs font-medium text-gray-500 mb-1 block">OS</label><select value={formData.os} onChange={e=>setFormData({...formData, os: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>Android</option><option>iOS</option></select></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs font-medium text-gray-500 mb-1 block">형태</label><select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>Bar</option><option>Fold</option><option>Flip</option></select></div>
               <div><label className="text-xs font-medium text-gray-500 mb-1 block">상태</label><select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none shadow-sm"><option>보관중</option><option>사용중</option><option>대여중</option></select></div>
             </div>
             <div><label className="text-xs font-medium text-gray-500 mb-1 block">사용/대여자</label><input value={formData.renter} onChange={e=>setFormData({...formData, renter: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-gray-400 shadow-sm" /></div>
             <div className="flex space-x-2 mt-4">
               <button type="button" onClick={() => setEditMode(false)} className="flex-1 bg-gray-100 text-gray-600 text-sm font-medium py-2 rounded-xl border border-gray-200 shadow-sm">취소</button>
               <button type="submit" className="flex-1 bg-gray-800 text-white text-sm font-medium py-2 rounded-xl shadow-md">저장</button>
             </div>
          </form>
        ) : (
          <div className="space-y-4">
             <div><span className="text-xs text-gray-400 block mb-1">디바이스명</span><div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">{device.name}</div></div>
             <div className="grid grid-cols-2 gap-4">
               <div><span className="text-xs text-gray-400 block mb-1">제조사</span><div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">{device.manufacturer}</div></div>
               <div><span className="text-xs text-gray-400 block mb-1">OS</span><div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">{device.os}</div></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><span className="text-xs text-gray-400 block mb-1">상태</span><div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">{device.status}</div></div>
               <div><span className="text-xs text-gray-400 block mb-1">대여자</span><div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">{device.renter || '없음'}</div></div>
             </div>
             {!isViewer && (
               <div className="flex space-x-2 pt-4 border-t border-gray-100">
                 <button onClick={() => setEditMode(true)} className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">수정하기</button>
                 <button onClick={() => { onDelete(device.id); onClose(); }} className="flex-1 bg-red-50 text-red-600 text-sm font-medium py-2 rounded-xl hover:bg-red-100 transition-colors border border-red-100 shadow-sm">삭제하기</button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ devices, user, onStatusChange, onShowDetails }) => {
  const columns = [
    { id: '보관중', title: '보관중' },
    { id: '사용중', title: '사용중' },
    { id: '대여중', title: '대여중' }
  ];

  const handleDragStart = (e, deviceId) => {
    e.dataTransfer.setData('deviceId', deviceId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (user.role === 'viewer') return;

    const deviceId = e.dataTransfer.getData('deviceId');
    onStatusChange(deviceId, targetStatus);
  };

  return (
    <div className="flex h-full gap-6 w-full animate-fade-in pb-4 overflow-x-auto no-scrollbar">
      {columns.map(col => (
        <div 
          key={col.id} 
          className="flex-1 min-w-[300px] bg-gray-50/80 rounded-2xl p-4 flex flex-col border border-gray-200 shadow-md"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-medium text-gray-700">{col.title}</h3>
            <span className="bg-white text-xs px-2 py-1 rounded-full shadow-sm text-gray-600 border border-gray-200 font-semibold">
              {devices.filter(d => d.status === col.id).length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-2">
            {devices.filter(d => d.status === col.id).map(device => (
              <div 
                key={device.id}
                draggable={user.role !== 'viewer'}
                onDragStart={(e) => handleDragStart(e, device.id)}
                onClick={() => onShowDetails(device)}
                className={`bg-white p-4 rounded-xl shadow-md border border-gray-200 ${user.role !== 'viewer' ? 'cursor-grab active:cursor-grabbing hover-breath' : ''} group`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">{device.manufacturer}</span>
                  <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100 font-medium">{device.type}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">{device.name}</h4>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span className="font-medium text-gray-600">{device.os}</span>
                  {device.renter ? (
                    <span className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
                      <User className="w-3 h-3 mr-1" /> {device.renter}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">미할당</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ListView = ({ devices, onShowDetails }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden animate-fade-in">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">상태</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">디바이스명</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">제조사</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">OS</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">형태</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 tracking-wider">사용/대여자</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr 
              key={device.id} 
              onClick={() => onShowDetails(device)}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  device.status === '보관중' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                  device.status === '사용중' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {device.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-800">{device.name}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-600">{device.manufacturer}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-600">{device.os}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-600">{device.type}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-600">
                {device.renter || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DevicesDashboard = ({ user, onNavigate, onLogout, onQuit }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewType, setViewType] = useState('kanban'); 
  const [devices, setDevices] = useState(INITIAL_DEVICES); // Fallback to initial devices to prevent empty UI
  
  const [rentModal, setRentModal] = useState({ isOpen: false, deviceId: null, targetStatus: '' });
  const [renterName, setRenterName] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Bar', os: 'Android', status: '보관중', serial: '', manufacturer: '', renter: '' });
  
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [osFilter, setOsFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const devicesRef = collection(db, 'devices');
    const unsubscribe = onSnapshot(devicesRef, (snapshot) => {
      if (snapshot.empty) {
        const seedData = async () => {
          const batch = writeBatch(db);
          INITIAL_DEVICES.forEach(device => {
            const docRef = doc(devicesRef, device.id);
            batch.set(docRef, device);
          });
          await batch.commit();
        };
        seedData();
      } else {
        const devicesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setDevices(devicesData);
      }
    }, (error) => {
      console.error("Firebase fetch error", error);
      // Fallback in case of permissions or network errors
      setDevices(INITIAL_DEVICES);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToSave } = formData;
      await addDoc(collection(db, 'devices'), dataToSave);
      setShowAddModal(false);
      setFormData({ name: '', type: 'Bar', os: 'Android', status: '보관중', serial: '', manufacturer: '', renter: '' });
    } catch(err) {
      console.error("Error adding device", err);
    }
  };

  const handleUpdateDevice = async (updatedData) => {
    try {
      const { id, ...dataToSave } = updatedData;
      const deviceRef = doc(db, 'devices', id);
      await updateDoc(deviceRef, dataToSave);
    } catch(err) {
      console.error("Error updating device", err);
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      await deleteDoc(doc(db, 'devices', id));
    } catch(err) {
      console.error("Error deleting device", err);
    }
  };

  const handleStatusChangeRequest = (deviceId, targetStatus) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || device.status === targetStatus) return;

    if (targetStatus === '보관중') {
      const deviceRef = doc(db, 'devices', deviceId);
      updateDoc(deviceRef, { status: targetStatus, renter: '' }).catch(console.error);
    } else {
      setRentModal({ isOpen: true, deviceId, targetStatus });
    }
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    if (!renterName.trim()) return;
    
    try {
      const deviceRef = doc(db, 'devices', rentModal.deviceId);
      await updateDoc(deviceRef, { status: rentModal.targetStatus, renter: renterName });
    } catch (err) {
      console.error("Error updating rent status", err);
    }
    
    setRentModal({ isOpen: false, deviceId: null, targetStatus: '' });
    setRenterName('');
  };

  const filteredDevices = devices.filter(d => {
    if (osFilter !== 'All' && d.os !== osFilter) return false;
    if (typeFilter !== 'All' && d.type !== typeFilter) return false;
    return true;
  });

  const summary = {
    total: filteredDevices.length,
    storage: filteredDevices.filter(d => d.status === '보관중').length,
    inUse: filteredDevices.filter(d => d.status === '사용중').length,
    rented: filteredDevices.filter(d => d.status === '대여중').length,
  };

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] flex flex-col overflow-hidden animate-simple-fade">
      <header className="h-16 px-6 flex justify-between items-center bg-white border-b border-gray-100 z-20 shrink-0 shadow-sm relative">
        <div className="flex items-center space-x-3">
          <AppLogo className="w-6 h-6" />
          <span className="text-lg font-medium tracking-wide text-gray-800">QA BASE</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 mr-4 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm cursor-default">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">1명 접속중</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover-breath cursor-default">
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-[10px] font-medium overflow-hidden">
              {user.profileImage ? <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-gray-700">{user.name}</span>
          </div>

          <div className="h-4 w-px bg-gray-200"></div>

          <button onClick={onLogout} className="text-gray-400 hover:text-gray-800 transition-colors p-1.5 hover-breath rounded-md">
            <LogOut className="w-4 h-4" />
          </button>
          <button onClick={onQuit} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover-breath rounded-md">
            <Power className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside 
          className={`bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col z-10 overflow-hidden whitespace-nowrap ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1 w-64">
            <div className="text-xs font-semibold text-gray-400 tracking-wider mb-4 px-3 mt-2">MENU</div>
            <button 
              onClick={() => onNavigate('board')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-medium">기능 보드 이동</span>
            </button>
            <div className="h-px bg-gray-100 my-2 mx-3"></div>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-900 font-medium border border-gray-200 shadow-sm">
              <Server className="w-4 h-4 text-gray-700" />
              <span className="text-sm">대시보드 (Devices)</span>
            </button>
            <button 
              onClick={() => { setOsFilter('Android'); if(!sidebarOpen) setSidebarOpen(true); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${osFilter === 'Android' ? 'bg-green-50/50 text-green-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm"></div>
                <span className="text-sm">Android</span>
              </div>
            </button>
            <button 
              onClick={() => { setOsFilter('iOS'); if(!sidebarOpen) setSidebarOpen(true); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${osFilter === 'iOS' ? 'bg-blue-50/50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm"></div>
                <span className="text-sm">iOS</span>
              </div>
            </button>
          </div>
        </aside>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-6 z-20 bg-white border border-gray-200 shadow-md rounded-full p-1.5 text-gray-600 hover:text-gray-900 transition-all duration-300 ${
            sidebarOpen ? 'left-[244px]' : 'left-4'
          }`}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <main className={`flex-1 overflow-hidden flex flex-col p-8 transition-all duration-300 ${!sidebarOpen ? 'ml-12' : ''}`}>
          
          <div className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {osFilter === 'All' ? '전체 디바이스' : osFilter}
                </h1>
                {user.role === 'viewer' && (
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded border border-gray-200 font-semibold uppercase tracking-wider">Read Only</span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">테스트 단말기의 상태를 모니터링하고 관리합니다.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
                <button 
                  onClick={() => setViewType('kanban')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'kanban' ? 'bg-gray-100 text-gray-800 shadow-sm font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-gray-100 text-gray-800 shadow-sm font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {user.role !== 'viewer' && (
                <button 
                  onClick={() => {
                    setFormData({ name: '', type: 'Bar', os: 'Android', status: '보관중', serial: '', manufacturer: '', renter: '' });
                    setShowAddModal(true);
                  }}
                  className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-md hover-breath flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> 추가
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-3 pl-6 rounded-2xl shadow-md border border-gray-200 mb-6 shrink-0">
            <div className="flex space-x-8">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total</span>
                <span className="text-xl font-bold text-gray-800">{summary.total}</span>
              </div>
              <div className="w-px bg-gray-200 my-1"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">사용중</span>
                <span className="text-xl font-bold text-green-600">{summary.inUse}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">대여중</span>
                <span className="text-xl font-bold text-blue-600">{summary.rented}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">보관중</span>
                <span className="text-xl font-bold text-gray-600">{summary.storage}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-sm">
              <Filter className="w-4 h-4 text-gray-500 ml-2" />
              <select 
                value={osFilter} onChange={(e) => setOsFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-gray-700 focus:ring-0 cursor-pointer py-1 outline-none"
              >
                <option value="All">OS 전체</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
              </select>
              <div className="w-px h-4 bg-gray-300"></div>
              <select 
                value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-gray-700 focus:ring-0 cursor-pointer py-1 outline-none"
              >
                <option value="All">형태 전체</option>
                <option value="Fold">폴드</option>
                <option value="Flip">플립</option>
                <option value="Bar">바</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
             {viewType === 'kanban' ? (
               <KanbanBoard devices={filteredDevices} user={user} onStatusChange={handleStatusChangeRequest} onShowDetails={setSelectedDevice} />
             ) : (
               <div className="h-full overflow-auto no-scrollbar">
                 <ListView devices={filteredDevices} onShowDetails={setSelectedDevice} />
               </div>
             )}
          </div>
        </main>
      </div>

      {rentModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[320px] transform transition-all border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {rentModal.targetStatus === '사용중' ? '사용자 정보 입력' : '대여자 정보 입력'}
            </h3>
            <p className="text-xs text-gray-500 mb-5">상태를 변경하려면 이름을 입력해주세요.</p>
            <form onSubmit={handleRentSubmit}>
              <input 
                autoFocus
                type="text" 
                placeholder="이름 (예: 홍길동)" 
                value={renterName}
                onChange={(e) => setRenterName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-gray-400 focus:bg-white transition-all mb-6 shadow-sm"
              />
              <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setRentModal({ isOpen: false, deviceId: null, targetStatus: '' })}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors shadow-md"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeviceAddModal isOpen={showAddModal} onClose={()=>setShowAddModal(false)} formData={formData} setFormData={setFormData} onSubmit={handleAddSubmit} />
      <DeviceDetailModal device={selectedDevice} onClose={()=>setSelectedDevice(null)} onUpdate={handleUpdateDevice} onDelete={handleDeleteDevice} user={user} />
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen('loadingBoard');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  return (
    <>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      {screen === 'splash' && (
        <SplashScreen onComplete={() => setScreen('login')} />
      )}
      
      {screen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onInstallApp={() => showToast('기기가 PWA 설치를 지원하지 않거나 이미 설치되어 있습니다.')} 
        />
      )}

      {screen === 'loadingBoard' && (
        <TransitionLoading title="Functional Board" onComplete={() => setScreen('board')} />
      )}

      {screen === 'board' && (
        <FunctionalBoard 
          user={user} 
          onNavigate={(target) => setScreen(target === 'dashboard' ? 'loadingDash' : target)}
          onLogout={() => { setUser(null); setScreen('login'); }}
          onShowProfileModal={() => setShowProfileModal(true)}
          onShowAdminModal={() => setShowAdminModal(true)}
        />
      )}

      {screen === 'loadingDash' && (
        <TransitionLoading title="Devices Dashboard" onComplete={() => setScreen('dashboard')} />
      )}

      {screen === 'dashboard' && (
        <DevicesDashboard 
          user={user}
          onNavigate={(target) => setScreen(target === 'board' ? 'loadingBoard' : target)}
          onLogout={() => { setUser(null); setScreen('login'); }}
          onQuit={() => { setUser(null); setScreen('splash'); }}
        />
      )}

      {showProfileModal && user && (
        <ProfileModal 
           user={user} 
           onClose={() => setShowProfileModal(false)} 
           onUpdateProfile={(image) => setUser({...user, profileImage: image})} 
        />
      )}
      {showAdminModal && (
        <AdminModal onClose={() => setShowAdminModal(false)} />
      )}
    </>
  );
}
