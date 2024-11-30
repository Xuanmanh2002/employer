import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    Container,
    Row,
    Col,
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


const MyService = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        services: [],
        orderDetails: [],
        loading: true,
        error: "",
    });

    const [expandedStates, setExpandedStates] = useState({});
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

    const toggleExpand = (index) => {
        setExpandedStates((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
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

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="mb-4">
                    <Col>
                        <div className="alert alert-info">
                            <strong>Lưu ý quan trọng:</strong> Nhằm tránh rủi ro mạo danh và lừa đảo, TopCV khuyến nghị Quý khách hàng không chuyển khoản vào bất cứ tài khoản cá nhân nào và chỉ thực hiện thanh toán vào các tài khoản chính thức của chúng tôi.
                        </div>
                    </Col>
                </Row>
                {loading ? (
                    <div className="text-center">Đang tải...</div>
                ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : orderDetails.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
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
                    <Row>
                        {orderDetails.map((orderDetail, index) => {
                            const matchingService = services.find(
                                (service) => service.id === orderDetail.serviceId
                            );
                            return matchingService ? (
                                <Col md="4" key={index} className="mb-4">
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5" className="text-success">
                                                {matchingService.serviceName}
                                            </CardTitle>
                                            <h2 className="text-danger">
                                                {orderDetail.price.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </h2>
                                            <CardText
                                                style={{
                                                    maxHeight: expandedStates[index] ? "none" : "100px",
                                                    overflow: "hidden",
                                                    transition: "max-height 0.3s ease",
                                                }}
                                            >
                                                {matchingService.description}
                                            </CardText>
                                            <Button
                                                color="link"
                                                onClick={() => toggleExpand(index)}
                                            >
                                                {expandedStates[index] ? "Thu gọn" : "Xem thêm"}
                                            </Button>
                                            <Button
                                                style={{ marginLeft: "140px" }}
                                                color="danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteOrderDetail(orderDetail.serviceId)
                                                }
                                                disabled={loading}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ) : null;
                        })}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default MyService;
