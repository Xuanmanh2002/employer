import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Container,
    Row,
    Col,
    Card,
    Input,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import {
    getAllService,
    getOrderDetails,
    deleteOrderDetail,
} from "utils/ApiFunctions";
import { notification } from "antd";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const MyService = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        services: [],
        orderDetails: [],
        loading: true,
        error: "",
    });

    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;
    const [deleting, setDeleting] = useState(null);

    const { services, orderDetails, loading, error } = state;

    useEffect(() => {
        const fetchData = async () => {
            setState((prev) => ({ ...prev, loading: true }));
            try {
                const [orderDetails, services] = await Promise.all([
                    getOrderDetails(),
                    getAllService(),
                ]);
                setState({ services, orderDetails, loading: false, error: "" });
            } catch (err) {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: "Lỗi khi tải dữ liệu",
                }));
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteOrderDetail = async (serviceId) => {
        setDeleting(serviceId);
        try {
            await deleteOrderDetail(serviceId);
            setState((prev) => ({
                ...prev,
                orderDetails: prev.orderDetails.filter(
                    (detail) => detail.serviceId !== serviceId
                ),
            }));
            notification.success({
                message: "Thành công",
                description: "Dịch vụ đã được xóa khỏi kho.",
            });
        } catch (err) {
            notification.error({
                message: "Lỗi",
                description: err.message || "Không thể xóa dịch vụ.",
            });
        } finally {
            setDeleting(null);
        }
    };

    const filteredJobs = orderDetails.filter((orderDetail) => {
        const matchingService = services.find(
            (service) => service.id === orderDetail.serviceId
        );
        if (!matchingService) return false;

        return (
            matchingService.serviceName.toLowerCase().includes(filter.toLowerCase()) ||
            matchingService.description.toLowerCase().includes(filter.toLowerCase())
        );
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Header />
            <Container className="mt-5" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Bảng dịch vụ</h3>
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc mô tả"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    style={{ maxWidth: "300px" }}
                                />
                            </CardHeader>
                            {loading ? (
                                <div className="text-center">Đang tải...</div>
                            ) : error ? (
                                <div className="alert alert-danger text-center">{error}</div>
                            ) : currentJobs.length === 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        paddingBottom: "40px"
                                    }}
                                >
                                    <div>
                                        <img
                                            src="https://tuyendung.topcv.vn/app/_nuxt/img/invoice_service_empty.25af6a6.png"
                                            alt="No services"
                                            style={{ maxWidth: "150px", marginBottom: "20px" }}
                                        />
                                        <div>
                                            <p>Bạn chưa có dịch vụ nào trong tài khoản</p>
                                            <Button color="success" onClick={() => navigate("/employer/mua-dich-vu")}>
                                                Thêm dịch vụ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Tên dịch vụ</th>
                                                <th scope="col">Số lượng</th>
                                                <th scope="col">Giá</th>
                                                <th scope="col">Thời hạn hiệu lực</th>
                                                <th scope="col">Tổng tiền</th>
                                                <th scope="col">Mô tả</th>
                                                <th scope="col">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentJobs.map((orderDetail, index) => {
                                                const matchingService = services.find(
                                                    (service) => service.id === orderDetail.serviceId
                                                );
                                                return matchingService ? (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            {indexOfFirstJob + index + 1}
                                                        </th>
                                                        <td>{matchingService.serviceName}</td>
                                                        <td>{orderDetail.quantity}</td>
                                                        <td>
                                                            {orderDetail.price.toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }
                                                            )}
                                                        </td>
                                                        <td>{orderDetail.activationDate && orderDetail.totalValidityPeriod
                                                            ? format(
                                                                new Date(orderDetail.activationDate).setDate(
                                                                    new Date(orderDetail.activationDate).getDate() + orderDetail.totalValidityPeriod
                                                                ),
                                                                "dd/MM/yyyy"
                                                            )
                                                            : "N/A"}</td>
                                                        <td>
                                                            {orderDetail.totalAmounts.toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }
                                                            )}
                                                        </td>
                                                        <td>{matchingService.description}</td>
                                                        <td>
                                                            <Button
                                                                color="danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeleteOrderDetail(
                                                                        orderDetail.serviceId
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting === orderDetail.serviceId
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ) : null;
                                            })}
                                        </tbody>
                                    </Table>
                                    <CardFooter className="py-4">
                                        <nav aria-label="Pagination">
                                            <Pagination className="pagination justify-content-end mb-0">
                                                <PaginationItem disabled={currentPage === 1}>
                                                    <PaginationLink
                                                        previous
                                                        onClick={() => paginate(currentPage - 1)}
                                                    />
                                                </PaginationItem>
                                                {[...Array(Math.ceil(filteredJobs.length / jobsPerPage))].map((_, i) => (
                                                    <PaginationItem key={i} active={i + 1 === currentPage}>
                                                        <PaginationLink
                                                            onClick={() => paginate(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem
                                                    disabled={
                                                        currentPage ===
                                                        Math.ceil(filteredJobs.length / jobsPerPage)
                                                    }
                                                >
                                                    <PaginationLink
                                                        next
                                                        onClick={() => paginate(currentPage + 1)}
                                                    />
                                                </PaginationItem>
                                            </Pagination>
                                        </nav>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default MyService;
