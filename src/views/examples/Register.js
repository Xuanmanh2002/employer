import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { registerEmployer, getAllAddress } from "utils/ApiFunctions";
import { LuScale } from "react-icons/lu";
import { FiBox } from "react-icons/fi";

const Register = () => {
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    avatar: null,
    gender: "",
    telephone: "",
    addressId: "",
    companyName: "",
    scale: "",
    fieldActivity: "",
    email: "",
    password: "",
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressList = await getAllAddress();
        setAddresses(addressList);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setErrorMessage("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistration((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRegistration((prev) => ({ ...prev, avatar: file }));
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      await registerEmployer(registration);
      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      navigate("/auth/login");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(`Registration error: ${error.message || "Unknown error"}`);
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);
  };
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Đăng ký với</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Hoặc đăng ký bằng thông tin đăng nhập</small>
              {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
              {successMessage && <p className="alert alert-success">{successMessage}</p>}
            </div>
            <Form role="form" onSubmit={handleRegistration}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Họ"
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-control"
                    value={registration.firstName}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Tên"
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-control"
                    value={registration.lastName}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Năm sinh"
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="form-control"
                    value={registration.birthDate}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-vector" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    name="gender"
                    id="gender"
                    className="form-control"
                    value={registration.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup className="text-center">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={previewAvatar || "https://www.topcv.vn/images/avatar-default.jpg"}
                    alt="Avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("avatarInput").click()}
                  />
                  <Input
                    type="file"
                    id="avatarInput"
                    name="avatar"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {previewAvatar && (
                  <p className="text-muted mt-2" style={{ fontSize: "12px" }}>
                    Nhấn vào ảnh để thay đổi
                  </p>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Số điện thoại"
                    id="telephone"
                    name="telephone"
                    type="text"
                    className="form-control"
                    value={registration.telephone}
                    onChange={handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    name="addressId"
                    className="form-control"
                    value={registration.addressId}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn địa chỉ</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.name}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-building" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Tên công ty"
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="form-control"
                    value={registration.companyName}
                    onChange={handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <LuScale />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Quy mô"
                    id="scale"
                    name="scale"
                    type="text"
                    className="form-control"
                    value={registration.scale}
                    onChange={handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <FiBox />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Lĩnh vực"
                    id="fieldActivity"
                    name="fieldActivity"
                    type="text"
                    className="form-control"
                    value={registration.fieldActivity}
                    onChange={handleInputChange} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={registration.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Mật khẩu"
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={registration.password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  độ mạnh của mật khẩu:{" "}
                  <span className="text-success font-weight-700">mạnh</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        Tôi đồng ý với{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Chính sách bảo mật
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Tạo mới tài khoản
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
