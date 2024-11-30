import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import { getEmployer } from "utils/ApiFunctions";

const UserHeader = () => {
  const [employer, setEmployer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    avatar: "",
    gender: "",
    telephone: "",
    addressId: "",
    companyName: ""
  });
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const employerData = await getEmployer(email, token);
        setEmployer(employerData);
      } catch (error) {
        console.error(error);
      }
    };

    if (email && token) {
      fetchEmployerData();
    }
  }, [email, token]);
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage: `url(${employer.avatar
              ? `data:image/jpeg;base64,${employer.avatar}`
              : require("../../assets/img/theme/profile-cover.jpg")
            })`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="mask bg-gradient-default opacity-8" />
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Chào {employer.firstName} {employer.lastName}</h1>
              <p className="text-white mt-0 mb-5">
              Đây là trang hồ sơ của bạn. Bạn có thể thấy tiến độ bạn đã đạt được trong công việc và quản lý các dự án hoặc nhiệm vụ được giao
              </p>
              <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Chỉnh sửa thông tin
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
