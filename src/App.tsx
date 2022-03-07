import { Routes, Route, Link } from "react-router-dom";
import Layout from './components/Layout'
import PostPage from './pages/posts'
import ListPage from './pages/list'
import TagsPage from './pages/tags'
import SettingPage from './pages/setting'
import 'antd/dist/antd.css';
import './App.less';

interface RouteItem {
  name: string;
  path: string;
  isMenu: boolean;
  component: any;
  layout: boolean
}
const ROUTES: RouteItem[] = [
  {name: '文章列表', path: "/pages", layout: true, isMenu: true, component: ListPage },
  {name: '标签列表', path: "/tags", layout: true, isMenu: true, component: TagsPage },
  {name: '标签文章列表', path: "/tags/:tagName", layout: true, isMenu: false, component: ListPage },
  {name: '文章内容', path: "/post/:id", layout: true, isMenu: false, component: PostPage },
  {name: '系统设置', path: "/setting", layout: true, isMenu: true, component: SettingPage },
]

function createRoute(route: RouteItem) {
  if (route.layout) {
    return (
      <Route key={route.name} path={route.path} element={<Layout routes={ROUTES}><route.component /></Layout>} />
    )
  }
  return <Route key={route.name} path={route.path} element={<route.component />} />
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/test" element={<PostPage />} />
        {
          ROUTES.map(createRoute)
        }
      </Routes>
    </div>
  );
}

export default App;
