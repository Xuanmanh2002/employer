import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Icons from "views/examples/Icons.js";
import Service from "views/examples/BuyService/Service";
import Job from "views/examples/JobManager/Job";
import CreateJob from "views/examples/JobManager/CreateJob";

var routes = [
  {
    path: "/index",
    name: "Bảng điều khiển",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/employer",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/employer",
  },
  {
    path: "/profile",
    name: "Thông tin của tôi",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/employer",
  },
  {
    path: "/buy-services",
    name: "Mua dịch vụ",
    icon: "ni ni-shop text-green",
    component: <Service />,
    layout: "/employer",
  },
  {
    path: "/job-manager",
    name: "Quản lý công việc",
    icon: "ni ni-single-02 text-yellow",
    component: <Job />,
    layout: "/employer",
  },
  {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/create-job",
    component: <CreateJob />,
    layout: "/employer",
  },
  {
    path: "/register",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
