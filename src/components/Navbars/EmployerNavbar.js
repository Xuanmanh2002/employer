import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Navbar,
  Nav,
  Container,
  Media,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "components/Auth/AuthProvider";
import { checkRoleEmployer, getAllCartItems, getNotificationsByRole } from "utils/ApiFunctions";

const EmployerNavbar = (props) => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [employer, setEmployer] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
    roles: [{ id: "", name: "" }],
  });
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getAllCartItems();
        setCartItemCount(items.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const data = await getNotificationsByRole();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    const fetchEmployerData = () => {
      const storedFirstName = localStorage.getItem("firstName");
      const storedLastName = localStorage.getItem("lastName");
      const storedAvatar = localStorage.getItem("avatar");

      setEmployer((prevEmployer) => ({
        ...prevEmployer,
        firstName: storedFirstName || "",
        lastName: storedLastName || "",
        avatar: storedAvatar || "",
      }));
    };

    if (!token) {
      handleLogout();
      navigate("/auth/login", {
        state: { message: "Token expired. Please log in again." },
      });
      return;
    }

    fetchNotifications();
    fetchEmployerData();
    fetchCartItems();

    const verifyRole = async () => {
      try {
        const isEmployer = await checkRoleEmployer(token);
        if (!isEmployer) {
          navigate("/auth/login", {
            state: { message: "Access restricted to employers only!" },
          });
        }
      } catch (error) {
        console.error("Error checking role:", error);
        navigate("/auth/login", {
          state: { message: "An error occurred. Please try again." },
        });
      }

      setLoading(false);
    };

    verifyRole();
  }, [navigate, handleLogout, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employerId");
    handleLogout();
    navigate("/auth/login", { state: { message: "You have been logged out!" } });
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <Button
              color="link"
              className="text-white position-relative"
              onClick={() => navigate("/employer/gio-hang")}
            >
              <i className="ni ni-cart" />
              <Badge
                color="danger"
                pill
                className="position-absolute"
                style={{ top: "0", right: "-10px", fontSize: "0.75rem" }}
              >
                {cartItemCount}
              </Badge>
            </Button>

            <UncontrolledDropdown nav className="position-relative">
              <DropdownToggle nav>
                <i className="ni ni-bell-55 text-white" />
                <Badge
                  color="danger"
                  pill
                  className="position-absolute"
                  style={{ top: "-2px", right: "-20px", fontSize: "0.75rem" }}
                >
                  {notifications.length}
                </Badge>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Thông báo</h6>
                </DropdownItem>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <DropdownItem key={index}>
                      <i className="ni ni-bell-55" />
                      <span>{notification.title}</span>
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem className="text-center text-muted">
                    Không có thông báo
                  </DropdownItem>
                )}
                <DropdownItem divider />
                <DropdownItem className="text-center text-muted" disabled>
                  Xem tất cả thông báo
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav  style={{paddingLeft: "20px"}}>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="Avatar"
                      src={`data:image/jpeg;base64,${employer.avatar}`}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {employer.firstName} {employer.lastName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Chào mừng!</h6>
                </DropdownItem>
                <DropdownItem to="/employer/thong-tin-cua-toi" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Thông tin cá nhân</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogoutClick();
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Đăng xuất</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default EmployerNavbar;
