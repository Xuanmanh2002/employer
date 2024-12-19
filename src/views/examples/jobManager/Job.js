import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
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
  Alert,
} from "reactstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { getAllJob, deleteJob, getAllCategories } from "utils/ApiFunctions";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobsData = await getAllJob();
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        const jobsWithCategoryName = jobsData.map((job) => {
          const category = categoriesData.find(
            (cat) => cat.id === job.categoryId
          );
          return {
            ...job,
            categoryName: category ? category.categoryName : "Unknown",
          };
        });

        setJobs(jobsWithCategoryName);
        setFilteredJobs(jobsWithCategoryName);
      } catch (err) {
        setError("Failed to load jobs.");
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
      ? jobs.filter(
        (job) =>
          job.jobName?.toLowerCase().includes(searchTerm) ||
          job.recruitmentDetails?.toLowerCase().includes(searchTerm)
      )
      : jobs;

    setFilteredJobs(filtered);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (jobId) => {
    setJobToDelete(jobId);
    setModal(true);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      try {
        await deleteJob(jobToDelete);
        setJobs(jobs.filter((job) => job.id !== jobToDelete));
        setFilteredJobs(filteredJobs.filter((job) => job.id !== jobToDelete));
        setSuccessMessage("Job deleted successfully.");
      } catch (error) {
        setError("Failed to delete job.");
      } finally {
        setModal(false);
        setJobToDelete(null);
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Bảng công việc tuyển dụng</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Lọc công việc theo tên hoặc chi tiết"
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ marginRight: "40px" }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/employer/tao-moi-cong-viec')}
                    style={{ height: "40px", width: "150px" }}
                  >
                    Tạo mới
                  </button>
                </div>
              </CardHeader>

              {successMessage && (
                <Alert color="success" toggle={() => setSuccessMessage("")}>
                  {successMessage}
                </Alert>
              )}

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Vị trí công viêc</th>
                    <th scope="col">Kinh nghiệm</th>
                    <th scope="col">Thời hạn nạp hồ sơ</th>
                    <th scope="col">Active</th>
                    <th scope="col">Thời hạn dịch vụ</th>
                    <th scope="col">Chi tiết công việc</th>
                    <th scope="col">Chức vụ</th>
                    <th scope="col">Số lượng nhân viên</th>
                    <th scope="col">Hình thức làm việc</th>
                    <th scope="col">Giới tính nhân viên</th>
                    <th scope="col">Danh mục công việc</th>
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
                  ) : currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center">Không có bài tuyển dụng nào</td>
                    </tr>
                  ) : (
                    currentJobs.map((job, index) => (
                      <tr key={job.id}>
                        <th scope="row">{indexOfFirstJob + index + 1}</th>
                        <td>{job.jobName}</td>
                        <td>{job.experience}<span> năm</span></td>
                        <td>{job.applicationDeadline ? format(new Date(job.applicationDeadline), "dd/MM/yyyy") : "N/A"}</td>
                        <td>
                          <span className={job.status ? "text-success" : "text-danger"}>
                            {job.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {job.activationDate && job.totalValidityPeriod
                            ? format(
                              new Date(job.activationDate).setDate(
                                new Date(job.activationDate).getDate() + job.totalValidityPeriod
                              ),
                              "dd/MM/yyyy"
                            )
                            : "N/A"}
                        </td>
                        <td>{job.recruitmentDetails}</td>
                        <td>{job.ranker}</td>
                        <td>{job.quantity}</td>
                        <td>{job.workingForm}</td>
                        <td>{job.gender}</td>
                        <td>{job.categoryName || "N/A"}</td>
                        <td>{job.createAt ? format(new Date(job.createAt), "dd/MM/yyyy") : "N/A"}</td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-link text-primary p-0 me-3"
                              onClick={() => navigate(`/employer/cap-nhat-cong-viec/${job.id}`, { state: job })}
                              title="Edit"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <button
                              className="btn btn-link text-danger p-0"
                              onClick={() => openModal(job.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt" />
                            </button>
                          </div>
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
                    {[...Array(Math.ceil(filteredJobs.length / jobsPerPage))].map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}>
                      <PaginationLink onClick={() => paginate(currentPage + 1)} next />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        <Modal isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>Xác nhận xóa</ModalHeader>
          <ModalBody>
            Bạn có chắc chắn muốn xóa công việc này không?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Hủy bỏ</button>
            <button className="btn btn-danger" onClick={handleConfirmDelete}>Xóa</button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default Job;
