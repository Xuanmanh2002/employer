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
  ModalFooter,
  Button
} from "reactstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { getApplicationsByEmployer, getAllJob, deleteApplicationDocuments, updateApplicationStatus, getApplicationDocumentsByStatus } from "utils/ApiFunctions";
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
  const [selectedStatus, setSelectedStatus] = useState("");


  const handleFilterByStatus = async (status) => {
    setLoading(true);
    setError("");
    setSelectedStatus(status);
  
    const adminId = localStorage.getItem("adminId"); 
  
    try {
      const filteredData = await getApplicationDocumentsByStatus(status, adminId);
      setFilteredApplications(filteredData);
    } catch (err) {
      setError("Không thể lọc dữ liệu theo trạng thái.");
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };


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

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      setLoading(true);
      await updateApplicationStatus(applicationId, status);
      const updatedApplications = applications.map((application) =>
        application.id === applicationId ? { ...application, status } : application
      );
      setApplications(updatedApplications);
      setFilteredApplications(updatedApplications);
      notification.success({
        message: 'Thành công',
        description: `Mail đã được gửi cho bên ứng viên.`,
      });
    } catch (error) {
      setError("Không thể cập nhật trạng thái.");
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể cập nhật trạng thái.',
      });
    } finally {
      setLoading(false);
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
                    type="select"
                    value={selectedStatus}
                    onChange={(e) => handleFilterByStatus(e.target.value)}
                    style={{ marginRight: "10px", width: "160px" }}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Accept">Trạng thái chấp nhận</option>
                    <option value="Reject">Trạng thái từ chối</option>
                    <option value="Received">Trạng thái tiếp nhận</option>
                  </Input>
                  <Input
                    type="text"
                    placeholder="Lọc ứng dụng theo tên công việc hoặc chi tiết"
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ width: "280px" }}
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
                      <td colSpan="10" className="text-center">Không có bài tuyển dụng nào</td>
                    </tr>
                  ) : (
                    currentApplications.map((application, index) => (
                      <tr key={application.id}>
                        <th scope="row">{indexOfFirstApplication + index + 1}</th>
                        <td>{application.fullName}</td>
                        <td>{application.email}</td>
                        <td>{application.telephone}</td>
                        <td>{application.letter}</td>
                        <td>
                          <span className={`status-badge ${application.status === 'Accept' ? 'status-accepted' :
                            application.status === 'Reject' ? 'status-rejected' : 'status-pending'
                            }`}>
                            {application.status === 'Accept' ? 'Chấp nhận' :
                              application.status === 'Reject' ? 'Từ chối' : 'Tiếp nhận'}
                          </span>
                        </td>
                        <td>{getJobNameById(application.jobId)}</td>
                        <td>{format(new Date(application.createAt), 'dd/MM/yyyy')}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <Button
                              onClick={() => openCvModal(`data:application/pdf;base64,${application.cv}`)}
                            >
                              Xem CV
                            </Button>
                            <DropdownMenu className="dropdown-menu-arrow" left>
                            </DropdownMenu>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => handleUpdateStatus(application.id, 'Accept')}>
                                Chấp nhận
                              </DropdownItem>
                              <DropdownItem onClick={() => handleUpdateStatus(application.id, 'Reject')}>
                                Từ chối
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

      <style>
        {`
          .status-badge {
            border-radius: 12px; 
            padding: 5px 15px;
            font-weight: bold;
            text-align: center;
          }

          .status-accepted {
            background-color: #28a745;
            color: white;
          }

          .status-rejected {
            background-color: #dc3545;
            color: white;
          }

          .status-pending {
            background-color: #ffc107;
            color: black;
          }
        `}
      </style>
    </>
  );
};

export default ApplicationDocuments;
