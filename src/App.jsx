import React, { useState, useEffect, useRef } from 'react';
import { 
  MonitorSmartphone, Settings, LogOut, Power, User, Users, 
  LayoutDashboard, Server, Download, ShieldCheck, Search, 
  Filter, Grid, List, Plus, ChevronRight, ChevronLeft, X
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyATKKSrUm6NKATdZdJeDxhQ5Dj2Q32ujh0",
  authDomain: "q-base-dev.firebaseapp.com",
  projectId: "q-base-dev",
  storageBucket: "q-base-dev.firebasestorage.app",
  messagingSenderId: "756427289812",
  appId: "1:756427289812:web:217c6ebb1bfbd1d931f741"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === CSS Styles for Cinematic Animations ===
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
  .animate-fade-in {
    animation: cinematicFadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  @keyframes simpleFade {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-simple-fade {
    animation: simpleFade 0.5s ease-in-out forwards;
  }

  @keyframes breathing {
    0% { box-shadow: 0 0 0px rgba(156, 163, 175, 0); border-color: transparent; }
    50% { box-shadow: 0 0 15px rgba(156, 163, 175, 0.4); border-color: rgba(209, 213, 219, 0.8); }
    100% { box-shadow: 0 0 0px rgba(156, 163, 175, 0); border-color: transparent; }
  }
  .hover-breath {
    transition: all 0.3s ease;
  }
  .hover-breath:hover {
    animation: breathing 2.5s infinite ease-in-out;
    transform: translateY(-2px);
  }

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

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const INITIAL_DEVICES = [
  { id: 'd1', name: 'Galaxy Z Fold 5', type: 'Fold', os: 'Android', status: '보관중', renter: '', manufacturer: 'Samsung' },
  { id: 'd2', name: 'iPhone 15 Pro', type: 'Bar', os: 'iOS', status: '사용중', renter: '홍길동', manufacturer: 'Apple' },
  { id: 'd3', name: 'Galaxy S24 Ultra', type: 'Bar', os: 'Android', status: '대여중', renter: '김철수', manufacturer: 'Samsung' },
  { id: 'd4', name: 'Galaxy Z Flip 4', type: 'Flip', os: 'Android', status: '보관중', renter: '', manufacturer: 'Samsung' },
  { id: 'd5', name: 'iPhone 13 Mini', type: 'Bar', os: 'iOS', status: '보관중', renter: '', manufacturer: 'Apple' },
];

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
        <img src="/icon-192x192.png" alt="QA Base App Icon" className="w-28 h-28 mb-6 drop-shadow-xl animate-pulse" />
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

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanId = id.trim();
    const cleanPw = pw.trim();
    
    if (cleanId === 'wow1324332' && cleanPw === 'djslzja1!') {
      onLogin({ id: cleanId, name: 'ADMIN', role: 'admin' });
    } else {
      onLogin({ id: cleanId || 'user', name: name.trim() || '사용자', role: 'user' });
    }
  };

  const handleGuest = () => {
    onLogin({ id: 'guest', name: 'Guest', role: 'viewer' });
  };

  return (
    <div className="w-screen h-screen bg-[#f0f2f5] flex items-center justify-center relative animate-simple-fade">
      <button 
        onClick={onInstallApp}
        className="absolute top-8 right-8 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur hover-breath shadow-sm"
      >
        <Download className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wide">앱 설치</span>
      </button>

      <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white p-8 animate-fade-in relative z-10">
        
        <div className="flex justify-center mb-8">
          <img src="/icon-192x192.png" alt="QA Base App Icon" className="w-20 h-20 drop-shadow-lg" />
        </div>

        <div className="flex w-full mb-8 relative border-b border-gray-200">
          <button 
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button 
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
                className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800 accent-gray-800 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">로그인 기억하기</label>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button 
              type="submit" 
              className="w-full bg-gray-800 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
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
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-gray-800 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-sm text-gray-500 tracking-widest uppercase animate-pulse">{title} 로딩중...</p>
    </div>
  );
};

const FunctionalBoard = ({ user, onNavigate, onLogout, onShowToast, onUpdateUser }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(1); 

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] flex flex-col animate-simple-fade">
      <header className="h-20 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <img src="/icon-192x192.png" alt="QA Base" className="w-10 h-10 drop-shadow-md" />
          <span className="text-xl font-medium tracking-wider text-gray-800">QA BASE</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-md hover-breath cursor-default">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">{onlineUsersCount}명 접속중</span>
          </div>

          {user.role === 'admin' && (
            <button 
              onClick={() => setShowAdminModal(true)}
              className="p-2 text-gray-400 hover:text-gray-800 transition-colors hover-breath rounded-full shadow-sm bg-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover-breath p-1 pr-3 bg-white rounded-full border border-gray-100 shadow-md"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                {user.profileImg ? (
                  <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name === 'ADMIN' ? 'A' : user.name.charAt(0)
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.12)] border border-gray-100 py-2 animate-fade-in z-50">
                <button 
                  onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
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
              className="bg-white rounded-3xl p-8 cursor-pointer border border-transparent shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover-breath group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-500 shadow-inner">
                <Server className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Devices</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                QA 검증용 시료(단말기) 현황을 조회하고<br/>상태 및 대여 현황을 관리합니다.
              </p>
            </div>
            
            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 opacity-60 shadow-sm">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">Test Cases</h3>
              <p className="text-sm text-gray-400 leading-relaxed">준비중인 기능입니다.</p>
            </div>
          </div>
        </div>
      </main>

      {showAdminModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] border border-gray-100 flex flex-col relative">
            <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-5 h-5 text-gray-800" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">가입 요청 관리</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-gray-100 mb-6 shadow-inner">
              <span className="text-sm text-gray-500">현재 대기 중인 가입 요청이 없습니다.</span>
            </div>
            <button 
              onClick={() => setShowAdminModal(false)}
              className="w-full bg-gray-800 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[320px] border border-gray-100 flex flex-col items-center relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5"/>
            </button>
            <h3 className="text-lg font-medium text-gray-800 mb-6 w-full text-left">프로필 수정</h3>
            
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-white text-3xl font-medium mb-4 shadow-md ring-4 ring-gray-50 overflow-hidden">
              {user.profileImg ? (
                <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name === 'ADMIN' ? 'A' : user.name.charAt(0)
              )}
            </div>
            <p className="text-xs text-gray-500 mb-6">새로운 프로필 사진을 등록하세요.</p>
            
            <div className="w-full space-y-3">
              <label className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer shadow-sm">
                이미지 선택
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateUser({ ...user, profileImg: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </label>
              <button 
                onClick={() => { setShowProfileModal(false); onShowToast('프로필이 성공적으로 업데이트되었습니다.'); }}
                className="w-full bg-gray-800 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KanbanBoard = ({ devices, setDevices, user, setRentModal }) => {
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

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (user.role === 'viewer') return; 

    const deviceId = e.dataTransfer.getData('deviceId');
    const device = devices.find(d => d.id === deviceId);
    
    if (!device || device.status === targetStatus) return;

    if (targetStatus === '보관중') {
      const deviceRef = doc(db, 'devices', deviceId);
      await updateDoc(deviceRef, { status: targetStatus, renter: '' });
    } else {
      setRentModal({ isOpen: true, deviceId, targetStatus });
    }
  };

  return (
    <div className="flex h-full gap-6 w-full animate-fade-in pb-4 overflow-x-auto no-scrollbar">
      {columns.map(col => (
        <div 
          key={col.id} 
          className="flex-1 min-w-[300px] bg-gray-50/50 rounded-2xl p-4 flex flex-col border border-gray-100"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-medium text-gray-700">{col.title}</h3>
            <span className="bg-white text-xs px-2 py-1 rounded-full shadow-sm text-gray-500 border border-gray-100">
              {devices.filter(d => d.status === col.id).length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-2">
            {devices.filter(d => d.status === col.id).map(device => (
              <div 
                key={device.id}
                draggable={user.role !== 'viewer'}
                onDragStart={(e) => handleDragStart(e, device.id)}
                className={`bg-white p-4 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-gray-100 ${user.role !== 'viewer' ? 'cursor-grab active:cursor-grabbing hover-breath' : ''} group`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">{device.manufacturer}</span>
                  <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">{device.type}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">{device.name}</h4>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span>{device.os}</span>
                  {device.renter ? (
                    <span className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
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

const ListView = ({ devices }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden animate-fade-in">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">상태</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">디바이스명</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">제조사</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">OS</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">형태</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 tracking-wider">사용/대여자</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <td className="px-6 py-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  device.status === '보관중' ? 'bg-gray-100 text-gray-600' :
                  device.status === '사용중' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {device.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{device.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{device.manufacturer}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{device.os}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{device.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
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
  const [devices, setDevices] = useState(INITIAL_DEVICES);

  useEffect(() => {
    const devicesRef = collection(db, 'devices');
    const unsubscribe = onSnapshot(devicesRef, (snapshot) => {
      if (snapshot.empty) {
        // DB가 비어있다면 초기 데이터를 자동으로 세팅합니다
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
        // 실시간으로 변경된 데이터를 가져옵니다
        const devicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDevices(devicesData);
      }
    });
    return () => unsubscribe();
  }, []);

  const [rentModal, setRentModal] = useState({ isOpen: false, deviceId: null, targetStatus: '' });
  const [renterName, setRenterName] = useState('');

  const [osFilter, setOsFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredDevices = devices.filter(d => {
    if (osFilter !== 'All' && d.os !== osFilter) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (typeFilter !== 'All' && d.type !== typeFilter) return false;
    return true;
  });

  const summary = {
    total: filteredDevices.length,
    storage: filteredDevices.filter(d => d.status === '보관중').length,
    inUse: filteredDevices.filter(d => d.status === '사용중').length,
    rented: filteredDevices.filter(d => d.status === '대여중').length,
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    if (!renterName.trim()) return;
    
    const deviceRef = doc(db, 'devices', rentModal.deviceId);
    await updateDoc(deviceRef, { status: rentModal.targetStatus, renter: renterName });
    
    setRentModal({ isOpen: false, deviceId: null, targetStatus: '' });
    setRenterName('');
  };

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] flex flex-col overflow-hidden animate-simple-fade">
      <header className="h-16 px-6 flex justify-between items-center bg-white border-b border-gray-100 z-20 shrink-0 shadow-sm relative">
        <div className="flex items-center space-x-3">
          <img src="/icon-192x192.png" alt="QA Base" className="w-8 h-8 drop-shadow-sm" />
          <span className="text-lg font-medium tracking-wide text-gray-800">QA BASE</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 mr-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-500">1</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover-breath">
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-[10px] font-medium overflow-hidden">
              {user.profileImg ? (
                <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name === 'ADMIN' ? 'A' : user.name.charAt(0)
              )}
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
          className={`bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col z-10 shadow-sm ${
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
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-900 font-medium">
              <Server className="w-4 h-4 text-gray-700" />
              <span className="text-sm">대시보드 (Devices)</span>
            </button>
            <button 
              onClick={() => { setOsFilter('Android'); if(!sidebarOpen) setSidebarOpen(true); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${osFilter === 'Android' ? 'bg-green-50/50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">Android</span>
              </div>
            </button>
            <button 
              onClick={() => { setOsFilter('iOS'); if(!sidebarOpen) setSidebarOpen(true); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${osFilter === 'iOS' ? 'bg-blue-50/50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-sm font-medium">iOS</span>
              </div>
            </button>
          </div>
        </aside>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-6 z-20 bg-white border border-gray-200 shadow-sm rounded-full p-1.5 text-gray-500 hover:text-gray-800 transition-all duration-300 ${
            sidebarOpen ? 'left-[244px]' : 'left-4'
          }`}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <main className={`flex-1 overflow-hidden flex flex-col p-8 transition-all duration-300 ${!sidebarOpen ? 'ml-12' : ''}`}>
          
          <div className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {osFilter === 'All' ? '전체 디바이스' : osFilter}
                </h1>
                {user.role === 'viewer' && (
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider shadow-sm">Read Only</span>
                )}
              </div>
              <p className="text-sm text-gray-500">테스트 단말기의 상태를 모니터링하고 관리합니다.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
                <button 
                  onClick={() => setViewType('kanban')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'kanban' ? 'bg-gray-100 text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-gray-100 text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {user.role !== 'viewer' && (
                <button className="bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-md shadow-gray-200 flex items-center hover-breath">
                  <Plus className="w-4 h-4 mr-1.5" /> 추가
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-2 pl-6 rounded-2xl shadow-sm border border-gray-100 mb-6 shrink-0">
            <div className="flex space-x-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total</span>
                <span className="text-lg font-medium text-gray-800">{summary.total}</span>
              </div>
              <div className="w-px bg-gray-100 my-1"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">사용중</span>
                <span className="text-lg font-medium text-green-600">{summary.inUse}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">대여중</span>
                <span className="text-lg font-medium text-blue-600">{summary.rented}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">보관중</span>
                <span className="text-lg font-medium text-gray-600">{summary.storage}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50/50 p-1.5 rounded-xl border border-gray-50 shadow-inner">
              <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
              <select 
                value={osFilter} onChange={(e) => setOsFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-gray-600 focus:ring-0 cursor-pointer py-1"
              >
                <option value="All">OS 전체</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
              </select>
              <div className="w-px h-3 bg-gray-200"></div>
              <select 
                value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-gray-600 focus:ring-0 cursor-pointer py-1"
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
               <KanbanBoard devices={filteredDevices} setDevices={setDevices} user={user} setRentModal={setRentModal} />
             ) : (
               <div className="h-full overflow-auto no-scrollbar">
                 <ListView devices={filteredDevices} />
               </div>
             )}
          </div>
        </main>
      </div>

      {rentModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
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
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

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
          onUpdateUser={setUser}
          onNavigate={(target) => setScreen(target === 'dashboard' ? 'loadingDash' : target)}
          onLogout={() => { setUser(null); setScreen('login'); }}
          onShowToast={showToast}
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
    </>
  );
}
