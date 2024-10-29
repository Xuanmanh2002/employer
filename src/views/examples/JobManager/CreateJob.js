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

const CreateJob = () => {
    const [jobDetails, setJobDetails] = useState({
        jobName: "",
        experience: "",
        applicationDeadline: "",
        recruitmentDetails: "",
        categoryId: "", 
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getAllCategories();
                setCategories(result);
            } catch (error) {
                setErrorMessage("Error fetching categories");
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
                jobDetails.applicationDeadline,
                jobDetails.recruitmentDetails,
                jobDetails.categoryId 
            );

            if (response.success) {
                setSuccessMessage(response.message);
                setJobDetails({
                    jobName: "",
                    experience: "",
                    applicationDeadline: "",
                    recruitmentDetails: "",
                    categoryId: "", 
                });
                setErrorMessage("");
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
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
                                <h3 className="mb-0">Create New Job</h3>
                            </CardHeader>
                            <CardBody>
                                <Form role="form" onSubmit={handleSubmit}>
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                                    <FormGroup>
                                        <label htmlFor="jobName">Job Name</label>
                                        <Input
                                            type="text"
                                            id="jobName"
                                            name="jobName"
                                            placeholder="Enter job name"
                                            value={jobDetails.jobName}
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
                                            placeholder="Enter experience required"
                                            value={jobDetails.experience}
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
                                            value={jobDetails.applicationDeadline}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <label htmlFor="recruitmentDetails">Recruitment Details</label>
                                        <Input
                                            type="textarea"
                                            id="recruitmentDetails"
                                            name="recruitmentDetails"
                                            placeholder="Enter recruitment details"
                                            value={jobDetails.recruitmentDetails}
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
                                            value={jobDetails.categoryId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.categoryName} 
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>

                                    <Button type="submit" color="primary">
                                        Create Job
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
