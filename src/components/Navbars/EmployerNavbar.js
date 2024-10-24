import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "components/Auth/AuthProvider";
import { checkRoleEmployer } from "utils/ApiFunctions";

const EmployerNavbar = (props) => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const [employer, setEmployer] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
    roles: [{ id: "", name: "" }]
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchemployerData = () => {
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

    fetchemployerData();

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
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="Avatar"  src={
                          employer.avatar
                            ? `data:image/jpeg;base64,${employer.avatar}`
                            : require("../../assets/img/theme/team-4-800x800.jpg")
                        }
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
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/employer/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
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
                  <span>Logout</span>
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
