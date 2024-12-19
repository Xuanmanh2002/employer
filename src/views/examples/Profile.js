import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { getEmployer, updateEmployer, getAllAddress } from "utils/ApiFunctions";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { notification } from "antd";

const Profile = () => {
  const [employer, setEmployer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    avatar: "",
    gender: "",
    telephone: "",
    companyName: "",
    scale: "",
    fieldActivity: "",
    addressId: "",
  });
  const [addressName, setAddressName] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const employerData = await getEmployer(email, token);
        setEmployer(employerData);
        const allAddresses = await getAllAddress();
        setAddresses(allAddresses);
        if (employerData.addressId) {
          const address = allAddresses.find(addr => addr.id === employerData.addressId);
          setAddressName(address ? address.name : "Unknown");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Error fetching employer data");
      }
    };

    if (email && token) {
      fetchEmployerData();
    } else {
      setErrorMessage("User not logged in");
    }
  }, [email, token]);

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployer((prevEmployer) => ({
          ...prevEmployer,
          avatar: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("avatar-upload").click();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formattedBirthDate = () => {
    if (!employer.birthDate) return "";
    const birth = new Date(employer.birthDate);
    return isNaN(birth.getTime()) ? "" : format(birth, "yyyy-MM-dd");
  };

  const age = calculateAge(employer.birthDate);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prevEmployer) => ({
      ...prevEmployer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployer(
        employer.email,
        employer.firstName,
        employer.lastName,
        employer.gender,
        employer.avatar,
        employer.telephone,
        employer.birthDate,
        employer.companyName,
        employer.scale,
        employer.fieldActivity,
        employer.addressId,
      );
      openNotification("success", "Thành công", "Cập nhật thông tin thành công!");
    } catch (error) {
      openNotification("error", "Lỗi", error.message || "Cập nhật thông tin thất bại!");
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image" style={{ position: "relative" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                      <img
                        alt="Avatar"
                        className="rounded-circle"
                        src={
                          employer.avatar
                            ? `data:image/jpeg;base64,${employer.avatar}`
                            : require("../../assets/img/theme/team-4-800x800.jpg")
                        }
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    </label>
                    <FaEdit
                      onClick={triggerFileInput}
                      style={{
                        position: "absolute",
                        top: "80px",
                        right: "1px",
                        cursor: "pointer",
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "7px",
                        fontSize: "2rem",
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Kết nối
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Tin nhắn
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <div className="text-center">
                  <h3>
                    {employer.firstName} {employer.lastName}
                    <span className="font-weight-light">, {age !== null ? age : "N/A"}</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {addressName}
                  </div>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Hiển thị thêm...
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Tài khoản của tôi</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={handleSubmit}
                      size="sm"
                    >
                      Cập nhật
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Thông tin người dùng
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={employer.email}
                            type="email"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-gender">
                            Giới tính
                          </label>
                          <Input
                            type="select"
                            name="gender"
                            id="input-gender"
                            className="form-control-alternative"
                            value={employer.gender}
                            onChange={handleInputChange}
                          >
                            <option value="">Lựa chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Họ
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="firstName"
                            defaultValue={employer.firstName}
                            id="input-first-name"
                            onChange={handleInputChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Tên
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="lastName"
                            defaultValue={employer.lastName}
                            id="input-last-name"
                            onChange={handleInputChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-birthdate">
                            Ngày tháng năm sinh
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-birthdate"
                            name="birthDate"
                            value={formattedBirthDate()}
                            onChange={handleInputChange}
                            type="date"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">
                      Thông tin liên hệ
                    </h6>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Địa chỉ
                          </label>
                          <Input
                            type="select"
                            name="addressId"
                            onChange={(e) => {
                              const selectedAddressId = e.target.value;
                              setEmployer((prevEmployer) => ({ ...prevEmployer, addressId: selectedAddressId }));
                              const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                              setAddressName(selectedAddress ? selectedAddress.name : "");
                            }}
                            value={employer.addressId}
                          >
                            <option value="">Select an address</option>
                            {addresses.map((address) => (
                              <option key={address.id} value={address.id}>
                                {address.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Tên công ty
                          </label>
                          <Input
                            name="companyName"
                            className="form-control-alternative"
                            defaultValue={employer.companyName}
                            id="input-city"
                            type="text"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Quy mô
                          </label>
                          <Input
                            name="scale"
                            className="form-control-alternative"
                            value={employer.scale}
                            id="input-city"
                            type="text"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Lĩnh vực
                          </label>
                          <Input
                            name="fieldActivity"
                            className="form-control-alternative"
                            defaultValue={employer.fieldActivity}
                            id="input-city"
                            type="text"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
