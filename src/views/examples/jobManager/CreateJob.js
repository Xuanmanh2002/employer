import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Button,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { createJob, getAllCategories } from "utils/ApiFunctions";
import { notification } from "antd";

const CreateJob = () => {
    const [jobDetails, setJobDetails] = useState({
        jobName: "",
        experience: "",
        price: "",
        applicationDeadline: "",
        recruitmentDetails: "",
        categoryId: "",
        ranker: "",
        quantity: "",
        workingForm: "",
        gender: "",
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getAllCategories();
                setCategories(result);
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh mục công việc.",
                });
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobDetails({ ...jobDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await createJob(
                jobDetails.jobName,
                jobDetails.experience,
                jobDetails.price,
                jobDetails.applicationDeadline,
                jobDetails.recruitmentDetails,
                jobDetails.categoryId,
                jobDetails.ranker,
                jobDetails.quantity,
                jobDetails.workingForm,
                jobDetails.gender
            );

            if (response.success) {
                notification.success({
                    message: "Thành công",
                    description: response.message || "Công việc đã được thêm.",
                });
                setJobDetails({
                    jobName: "",
                    experience: "",
                    price: "",
                    applicationDeadline: "",
                    recruitmentDetails: "",
                    categoryId: "",
                    ranker: "",
                    quantity: "",
                    workingForm: "",
                    gender: "",
                });
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Không thể thêm công việc.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.message || "Đã xảy ra lỗi khi thêm công việc.",
            });
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col>
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Tạo công việc mới</h3>
                            </CardHeader>
                            <CardBody>
                                <Form role="form" onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <label htmlFor="jobName">Tên công việc</label>
                                        <Input
                                            type="text"
                                            id="jobName"
                                            name="jobName"
                                            placeholder="Nhập tên công việc"
                                            value={jobDetails.jobName}
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
                                            placeholder="Nhập kinh nghiệm yêu cầu"
                                            value={jobDetails.experience}
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
                                            placeholder="Nhập lương đề xuất"
                                            value={jobDetails.price}
                                            min="0"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <label htmlFor="applicationDeadline">Hạn chót nộp đơn</label>
                                        <Input
                                            type="date"
                                            id="applicationDeadline"
                                            name="applicationDeadline"
                                            value={jobDetails.applicationDeadline}
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
                                            value={jobDetails.ranker}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn chức vụ</option>
                                            <option value="Thực tập sinh">Thực tập sinh</option>
                                            <option value="Nhân viên">Nhân viên</option>
                                            <option value="Quản lý">Quản lý</option>
                                            <option value="Giám đốc">Giám đốc</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <label htmlFor="ranker">Giới tính</label>
                                        <Input
                                            type="select"
                                            id="gender"
                                            name="gender"
                                            value={jobDetails.gender}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Không yêu cầu</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <label htmlFor="quantity">Số lượng nhân viên</label>
                                        <Input
                                            type="text"
                                            id="quantity"
                                            name="quantity"
                                            placeholder="Số lượng nhân viên"
                                            value={jobDetails.quantity}
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
                                            value={jobDetails.workingForm}
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
                                            placeholder="Nhập thông tin tuyển dụng"
                                            value={jobDetails.recruitmentDetails}
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
                                            value={jobDetails.categoryId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn một danh mục công việc</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>

                                    <Button type="submit" color="primary">
                                        Thêm công việc
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateJob;
