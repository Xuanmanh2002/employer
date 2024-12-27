import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { countApplicationDocuments, countApplicationDocumentsPending, countJobTrue } from "utils/ApiFunctions";

const Header = () => {
  const [applicationCount, setApplicationCount] = useState(0);
  const [applicationPending, setApplicationPending] = useState(0);
  const [jobTrue, setJobTrue] = useState(0);

  useEffect(() => {
    const fetchApplicationCount = async () => {
      try {
        const count = await countApplicationDocuments();
        setApplicationCount(count);
      } catch (error) {
        console.error("Error fetching application documents count:", error);
      }
    };

    const fetchApplicationCountPending = async () => {
      try {
        const count = await countApplicationDocumentsPending();
        setApplicationPending(count);
      } catch (error) {
        console.error("Error fetching application documents count:", error);
      }
    };

    const fetchJobCount = async () => {
      try {
        const count = await countJobTrue();
        setJobTrue(count);
      } catch (error) {
        console.error("Error fetching job count:", error);
      }
    };

    fetchJobCount();
    fetchApplicationCountPending();
    fetchApplicationCount();
  }, []);
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          CV tiếp nhận
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {applicationCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Cv ứng tuyển mới
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{applicationPending}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Tin tuyển dụng hiển thị
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{jobTrue}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
