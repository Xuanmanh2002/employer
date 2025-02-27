import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Service from "views/examples/BuyService/Service";
import Job from "views/examples/jobManager/Job";
import CreateJob from "views/examples/jobManager/CreateJob";
import UpdateJob from "views/examples/jobManager/UpdateJob";
import Cart from "views/examples/cart/Cart";
import ApplicationDocuments from "views/examples/applications/ApplicationDocuments";
import MyService from "views/examples/BuyService/MyService";
import ServiceDetail from "views/examples/BuyService/ServiceDetail";

var routes = [
  {
    path: "/",
    name: "Bảng điều khiển",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/employer",
  },
  {
    path: "/thong-tin-cua-toi",
    component: <Profile />,
    layout: "/employer",
  },
  {
    path: "/mua-dich-vu",
    name: "Mua dịch vụ",
    icon: "ni ni-shop text-green",
    component: <Service />,
    layout: "/employer",
  },
  {
    path: "/quan-ly-cong-viec",
    name: "Quản lý công việc",
    icon: "ni ni-briefcase-24 text-pink",
    component: <Job />,
    layout: "/employer",
  },
  {
    path: "/quan-ly-cv",
    name: "Quản lý cv",
    icon: "ni ni-email-83 text-black",
    component: <ApplicationDocuments />,
    layout: "/employer",
  },
  {
    path: "/dich-vu-cua-toi",
    name: "Quản lý dịch vụ",
    icon: "ni ni-bag-17 text-purple",
    component: <MyService />,
    layout: "/employer",
  },
  {
    path: "/dang-nhap",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/tao-moi-cong-viec",
    component: <CreateJob />,
    layout: "/employer",
  },
  {
    path: "/dang-ky",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/cap-nhat-cong-viec/:id",
    component: <UpdateJob />,
    layout: "/employer",
  },

  {
    path: "/gio-hang",
    component: <Cart />,
    layout: "/employer",
  },

  {
    path: "/mua-dich-vu/chi-tiet-dich-vu/:id",
    component: <ServiceDetail />,
    layout: "/employer",
  } 
  
  
];
export default routes;
