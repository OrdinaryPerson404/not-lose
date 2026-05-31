import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';
import PublishClue from './pages/PublishClue';
import PublishSearch from './pages/PublishSearch';
import PostDetail from './pages/PostDetail';
import MatchResult from './pages/MatchResult';
import HomeWall from './pages/HomeWall';
import Profile from './pages/Profile';
import './styles/global.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publish/clue" 
          element={
            <ProtectedRoute>
              <PublishClue />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publish/search" 
          element={
            <ProtectedRoute>
              <PublishSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post/:id" 
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/match/:id" 
          element={
            <ProtectedRoute>
              <MatchResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home-wall" 
          element={
            <ProtectedRoute>
              <HomeWall />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;