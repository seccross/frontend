
import HomePage from "./pages/home"
import ScanPage from "./pages/scan"
import AnalyPage from "./pages/analy"
import DefaultLayout from "./layout"

const routes = [

  {
    path: '/',
    element: <DefaultLayout />,
    children: [

      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'scan/:id',
        element: <ScanPage />
      },
      {
        path: 'analy/:id',
        element: <AnalyPage />
      },
      {
        path: '*',
        element: <HomePage />
      }
    ],
    
  }
]

export default routes


