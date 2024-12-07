import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateJob, checkRoleEmployer, getAllCategories } from "utils/ApiFunctions";
import { Button, Form, FormGroup, Input, Container, Row, Col, Card, CardBody, CardHeader, Alert, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import { format } from "date-fns";

const UpdateJob = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state || {};

    const [updatedJob, setUpdatedJob] = useState({
        jobName: job.jobName || "",
        experience: job.experience || "",
        price: job.price || "",
        applicationDeadline: job.applicationDeadline
            ? format(new Date(job.applicationDeadline), "yyyy-MM-dd")
            : "",
        recruitmentDetails: job.recruitmentDetails || "",
        categoryId: job.categoryId || "",
        ranker: job.ranker || "",
        quantity: job.quantity || "",
        workingForm: job.workingForm || "",
        gender: job.gender || "",
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
                    navigate("/auth/dang-nhap");
                    return;
                }

                const role = await checkRoleEmployer(token);
                setIsEmployer(role);
                if (!role) {
                    setErrorMessage("Access restricted to employers only.");
                    navigate("/auth/dang-nhap");
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

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        if (!isEmployer) return;

        try {
            setLoading(true);
            const result = await updateJob(id, updatedJob);
            if (result.success) {
                setSuccessMessage(result.message);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () =>
        updatedJob.jobName &&
        updatedJob.experience &&
        updatedJob.price &&
        updatedJob.applicationDeadline &&
        updatedJob.recruitmentDetails &&
        updatedJob.categoryId &&
        updatedJob.ranker &&
        updatedJob.workingForm &&
        updatedJob.quantity &&
        updatedJob.gender;

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Cập nhật công việc</h3>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner color="primary" />
                                ) : (
                                    <Form onSubmit={handleSubmit}>
                                        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
                                        {successMessage && <Alert color="success">{successMessage}</Alert>}

                                        <FormGroup>
                                            <label htmlFor="jobName">Tên công việc</label>
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
                                            <label htmlFor="experience">Kinh nghiệm</label>
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
                                            <label htmlFor="price">Lương</label>
                                            <Input
                                                type="text"
                                                id="price"
                                                name="price"
                                                value={updatedJob.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="applicationDeadline">Hạn chót nạp đơn</label>
                                            <Input
                                                type="date"
                                                id="applicationDeadline"
                                                name="applicationDeadline"
                                                value={updatedJob.applicationDeadline}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="ranker">Chức vụ</label>
                                            <Input
                                                type="select"
                                                id="ranker"
                                                name="ranker"
                                                value={updatedJob.ranker}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn chức vụ</option>
                                                <option value="Thực tập sinh">Thực tập sinh</option>
                                                <option value="Nhân viên">Nhân viên</option>
                                                <option value="Quản lý">Quản lý</option>
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="ranker">Giới tính</label>
                                            <Input
                                                type="select"
                                                id="gender"
                                                name="gender"
                                                value={updatedJob.gender}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="quantity">Số lượng nhân viên</label>
                                            <Input
                                                type="text"
                                                id="quantity"
                                                name="quantity"
                                                placeholder="Số lượng nhân viên"
                                                value={updatedJob.quantity}
                                                min="1"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="workingForm">Hình thức làm việc</label>
                                            <Input
                                                type="select"
                                                id="workingForm"
                                                name="workingForm"
                                                value={updatedJob.workingForm}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn hình thức làm việc</option>
                                                <option value="Toàn thời gian">Toàn thời gian</option>
                                                <option value="Bán thời gian">Bán thời gian</option>
                                                <option value="Tự do">Tự do</option>
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="recruitmentDetails">Chi tiết tuyển dụng</label>
                                            <Input
                                                type="textarea"
                                                id="recruitmentDetails"
                                                name="recruitmentDetails"
                                                value={updatedJob.recruitmentDetails}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="categoryId">Danh mục công việc</label>
                                            <Input
                                                type="select"
                                                id="categoryId"
                                                name="categoryId"
                                                value={updatedJob.categoryId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.categoryName}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>

                                        <Button type="submit" color="primary" disabled={loading || !isFormValid()}>
                                            {loading ? <Spinner size="sm" /> : "Cập nhật"}
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
