import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateJob, checkRoleEmployer, getAllCategories } from "utils/ApiFunctions";
import { Button, Form, FormGroup, Input, Container, Row, Col, Card, CardBody, CardHeader, Alert, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import { format} from "date-fns";

const UpdateJob = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state || {};

    const [updatedJob, setUpdatedJob] = useState({
        jobName: job.jobName || "",
        experience: job.experience || "",
        applicationDeadline: job.applicationDeadline || "",
        recruitmentDetails: job.recruitmentDetails || "",
        categoryId: job.categoryId || "",
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEmployer, setIsEmployer] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchCategoriesAndRole = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    setErrorMessage("No token found. Please log in as an employer.");
                    navigate("/auth/login");
                    return;
                }

                const role = await checkRoleEmployer(token);
                setIsEmployer(role);
                if (!role) {
                    setErrorMessage("Access restricted to employers only.");
                    navigate("/auth/login");
                } else {
                    const categoriesData = await getAllCategories();
                    setCategories(categoriesData);
                }
            } catch (error) {
                setErrorMessage("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategoriesAndRole();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedJob({ ...updatedJob, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmployer) return;
    
        try {
            setLoading(true);
            const result = await updateJob(id, updatedJob);
            if (result.success) {
                setSuccessMessage(result.message);
                setErrorMessage("");
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = () => {
        if (!job.applicationDeadline) return "";
        const birth = new Date(job.applicationDeadline);
        return isNaN(birth.getTime()) ? "" : format(birth, "yyyy-MM-dd");
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Update Job</h3>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner color="primary" />
                                ) : (
                                    <Form onSubmit={handleSubmit}>
                                        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
                                        {successMessage && <Alert color="success">{successMessage}</Alert>}

                                        <FormGroup>
                                            <label htmlFor="jobName">Job Name</label>
                                            <Input
                                                type="text"
                                                id="jobName"
                                                name="jobName"
                                                value={updatedJob.jobName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="experience">Experience</label>
                                            <Input
                                                type="text"
                                                id="experience"
                                                name="experience"
                                                value={updatedJob.experience}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="applicationDeadline">Application Deadline</label>
                                            <Input
                                                type="date"
                                                id="applicationDeadline"
                                                name="applicationDeadline"
                                                value={formattedDate()}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="recruitmentDetails">Recruitment Details</label>
                                            <Input
                                                type="text"
                                                id="recruitmentDetails"
                                                name="recruitmentDetails"
                                                value={updatedJob.recruitmentDetails}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="categoryId">Category</label>
                                            <Input
                                                type="select"
                                                id="categoryId"
                                                name="categoryId"
                                                value={updatedJob.categoryId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.categoryName}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>

                                        <Button type="submit" color="primary" disabled={loading}>
                                            {loading ? <Spinner size="sm" /> : "Update Job"}
                                        </Button>
                                    </Form>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default UpdateJob;
