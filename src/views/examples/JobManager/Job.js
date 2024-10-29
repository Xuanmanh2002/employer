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
} from "reactstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header.js";
import { getAllJob } from "utils/ApiFunctions";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; 

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilter(searchTerm);

    const filtered = searchTerm
      ? jobs.filter((job) =>
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

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getAllJob();
        setJobs(data); 
        setFilteredJobs(data);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Jobs Table</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Filter Jobs by name or details"
                    value={filter}
                    onChange={handleFilterChange}
                    className="me-2"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/employer/create-job')}
                    style={{ height: "40px" }}
                  >
                    Create
                  </button>
                </div>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Job Name</th>
                    <th scope="col">Experience</th>
                    <th scope="col">Application Deadline</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="text-danger text-center">{error}</td>
                    </tr>
                  ) : currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No jobs found.</td>
                    </tr>
                  ) : (
                    currentJobs.map((job, index) => (
                      <tr key={job.id}>
                        <th scope="row">{indexOfFirstJob + index + 1}</th>
                        <td>{job.jobName}</td>
                        <td>{job.experience}</td>
                        <td>{job.applicationDeadline ? format(new Date(job.applicationDeadline), "dd/MM/yyyy") : "N/A"}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" size="sm">
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              {/* Uncomment the below items if needed */}
                              {/* <DropdownItem onClick={() => handleDelete(job.id)}>Delete</DropdownItem> */}
                              <DropdownItem onClick={() => navigate(`/admin/update-job/${job.id}`, { state: job })}>
                                Edit
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
      </Container>
    </>
  );
};

export default Job;
