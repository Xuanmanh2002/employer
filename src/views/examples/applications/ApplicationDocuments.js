import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { getApplicationsByEmployer, getAllJob, deleteApplicationDocuments } from "utils/ApiFunctions";
import { notification } from "antd";

const ApplicationDocuments = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [cvModal, setCvModal] = useState(false); 
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [cvData, setCvData] = useState(""); 
  const applicationsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const applicationsData = await getApplicationsByEmployer();
        const jobData = await getAllJob();
        setApplications(applicationsData);
        setJobs(jobData);
        setFilteredApplications(applicationsData);
      } catch (err) {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilter(searchTerm);

    const filtered = searchTerm
      ? applications.filter(
        (application) =>
          application.jobName?.toLowerCase().includes(searchTerm) ||
          application.details?.toLowerCase().includes(searchTerm)
      )
      : applications;

    setFilteredApplications(filtered);
  };

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (applicationId) => {
    setApplicationToDelete(applicationId);
    setModal(true);
  };

  const openCvModal = (cvBase64) => {
    setCvData(cvBase64);
    setCvModal(true); 
  };

  const handleConfirmDelete = async () => {
    if (applicationToDelete) {
      try {
        await deleteApplicationDocuments(applicationToDelete);
        setApplications(applications.filter((application) => application.id !== applicationToDelete));
        setFilteredApplications(filteredApplications.filter((application) => application.id !== applicationToDelete));
        notification.success({
          message: 'Thành công',
          description: 'Đã xóa hồ sơ tuyển dụng thành công.',
        });
      } catch (error) {
        setError("Không xóa được hồ sơ tuyển dụng.");
        notification.error({
          message: 'Error',
          description: 'Không xóa được hồ sơ tuyển dụng.',
        });
      } finally {
        setModal(false);
        setApplicationToDelete(null);
      }
    }
  };

  const getJobNameById = (jobId) => {
    const job = jobs.find(job => job.id === jobId);
    return job ? job.jobName : "Unknown";
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Bảng hồ sơ tuyển dụng</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Filter Applications by job name or details"
                    value={filter}
                    onChange={handleFilterChange}
                    className="me-2"
                  />
                </div>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Tên ứng viên</th>
                    <th scope="col">email</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Thư viết của ứng viên</th>
                    <th scope="col">Trạng thái cv</th>
                    <th scope="col">Tên công việc</th>
                    <th scope="col">Ngày khởi tạo</th>
                    <th scope="col">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="text-danger text-center">{error}</td>
                    </tr>
                  ) : currentApplications.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No applications found.</td>
                    </tr>
                  ) : (
                    currentApplications.map((application, index) => (
                      <tr key={application.id}>
                        <th scope="row">{indexOfFirstApplication + index + 1}</th>
                        <td>{application.fullName}</td>
                        <td>{application.email}</td>
                        <td>{application.telephone}</td>
                        <td>{application.letter}</td>
                        <td>{application.status}</td>
                        <td>{getJobNameById(application.jobId)}</td>
                        <td>{format(new Date(application.createAt), 'dd/MM/yyyy')}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => openModal(application.id)}>Xóa</DropdownItem>
                              <DropdownItem
                                onClick={() => openCvModal(`data:application/pdf;base64,${application.cv}`)}
                              >
                                Xem CV
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink onClick={() => paginate(currentPage - 1)} previous />
                    </PaginationItem>
                    {[...Array(Math.ceil(filteredApplications.length / applicationsPerPage))].map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(i + 1)}>{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === Math.ceil(filteredApplications.length / applicationsPerPage)}>
                      <PaginationLink onClick={() => paginate(currentPage + 1)} next />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>Xác nhận xóa</ModalHeader>
        <ModalBody>Bạn có chắc chắn muốn xóa ứng viên này không?</ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => setModal(false)}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={handleConfirmDelete}>
            Xóa
          </button>
        </ModalFooter>
      </Modal>

      {/* CV Modal */}
      <Modal isOpen={cvModal} toggle={() => setCvModal(false)} size="lg">
        <ModalHeader toggle={() => setCvModal(false)}>Xem CV</ModalHeader>
        <ModalBody>
          <embed src={cvData} width="100%" height="600px" />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => setCvModal(false)}>
            Đóng
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ApplicationDocuments;
