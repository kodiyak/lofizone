import AdminLayout from './components/layouts/admin-layout';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { createPage, type ICreatePage } from './lib/create-page';

const adminPages: ICreatePage[] = [
  { path: '/', lazy: () => import('@/pages/home') },
  { path: '/prompts/:promptId', lazy: () => import('@/pages/prompt') },
  { path: '/books', lazy: () => import('@/pages/books') },
  { path: '/books/:bookId', lazy: () => import('@/pages/book') },
];

const router = createBrowserRouter(adminPages.map(createPage));

function App() {
  return (
    <>
      <AdminLayout>
        <RouterProvider router={router} />
      </AdminLayout>
    </>
  );
}

export default App;
