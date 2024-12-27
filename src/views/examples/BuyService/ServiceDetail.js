import React, { useState, useEffect } from "react";
import {
    Navbar, Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, InputGroup, Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaArrowLeft, FaShoppingCart, FaCheckCircle, FaClock } from "react-icons/fa";
import { notification } from "antd";
import { getServicePackById, addItemToCart } from "utils/ApiFunctions";
import { useParams, useNavigate } from "react-router-dom";

const ServiceDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [servicePack, setServicePack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServicePack = async () => {
            try {
                const data = await getServicePackById(id);
                setServicePack(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching service pack:", error);
                setLoading(false);
                notification.error({
                    message: "Lỗi",
                    description: error.message || "Có lỗi xảy ra khi tải dữ liệu.",
                    placement: "topRight",
                });
            }
        };

        fetchServicePack();
    }, [id]);

    const handleBuyNow = async () => {
        try {
            setAddingToCart(true);
            await addItemToCart(servicePack.id, quantity);
            setAddingToCart(false);
            notification.success({
                message: 'Thêm vào giỏ hàng thành công!',
                description: 'Dịch vụ đã được thêm vào giỏ hàng của bạn.',
                placement: 'topRight',
            });
        } catch (error) {
            setAddingToCart(false);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error.message,
                placement: 'topRight',
            });
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };
    
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1) setQuantity(value); 
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!servicePack) {
        return <div>No service pack data available.</div>;
    }

    return (
        <>
            <Header />
            <Navbar style={{ padding: "10px 20px", backgroundColor: "white" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        paddingLeft: "10px",
                    }}
                >
                    <Button
                        color="link"
                        onClick={() => window.history.back()}
                        style={{
                            padding: "5px 10px",
                            borderRadius: "12px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #ddd",
                        }}
                    >
                        <FaArrowLeft /> Quay lại
                    </Button>
                    <h2 style={{ margin: "0", fontSize: "18px" }}>Chi tiết dịch vụ</h2>
                </div>
            </Navbar>
            <Container className="mt-4" style={{ maxWidth: "1246px" }}>
                <Row>
                    <Col md="8">
                        <Card className="shadow-sm" style={{ borderRadius: "10px", border: "none" }}>
                            <CardBody>
                                <CardTitle tag="h4" className="mb-3" style={{ fontWeight: "bold" }}>
                                    Đăng tin tuyển dụng <span style={{ color: "#1abc9c", paddingLeft: "5px" }}>{servicePack.serviceName}</span>
                                </CardTitle>
                                <CardText className="mb-4" style={{ fontSize: "1rem", color: "#6c757d" }}>
                                    <FaCheckCircle style={{ color: "#1abc9c", marginRight: "8px" }} />
                                    Trải nghiệm đăng tin tuyển dụng hiệu quả với vị trí nổi bật trong việc làm tốt nhất kết hợp cùng các dịch vụ cao cấp, giá dùng thử hấp dẫn.
                                </CardText>
                                <CardText className="mb-4" style={{ fontSize: "1rem", color: "#6c757d" }}>
                                    <FaCheckCircle style={{ color: "#1abc9c", marginRight: "8px" }} />
                                    Đăng tải {servicePack.benefit} bài viết
                                </CardText>
                                <CardText className="mb-4" style={{ fontSize: "1rem", color: "#6c757d" }}>
                                    <FaCheckCircle style={{ color: "#1abc9c", marginRight: "8px" }} />
                                    Hiển thị trong {servicePack.displayPosition}
                                </CardText>
                                <div className="mb-3" style={{ display: "flex", alignItems: "center" }}>
                                    <FaClock style={{ color: "#1abc9c", marginRight: "8px" }} />
                                    <span>Thời gian hiệu lực: <b>{servicePack.validityPeriod} ngày</b></span>
                                </div>
                                <CardText>
                                    <b>Thông tin dịch vụ: </b> {servicePack.description}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="4">
                        <Card className="shadow-sm" style={{ borderRadius: "10px", border: "none" }}>
                            <CardBody>
                                <h3>Đăng tin tuyển dụng ({servicePack.serviceName})</h3>
                                <CardTitle
                                    tag="h4"
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        color: "#27ae60",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {new Intl.NumberFormat('vi-VN').format(servicePack.price)} VNĐ
                                </CardTitle>
                                <InputGroup className="mb-3">
                                    <div style={{ display: "flex", paddingTop: "10px", alignItems: "center", gap: "20px", justifyContent: "center" }}>
                                        <span>Số lượng</span>
                                        <Button color="secondary" onClick={decrementQuantity} disabled={quantity <= 1}>
                                            -
                                        </Button>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            style={{ width: "100px", textAlign: "center" }}
                                        />
                                        <Button color="secondary" onClick={incrementQuantity}>
                                            +
                                        </Button>
                                    </div>
                                </InputGroup>
                                <div style={{ display: "flex", paddingTop: "10px", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                                    <Button
                                        color="primary"
                                        onClick={handleBuyNow}
                                        style={{ width: "150px", height: "40px", fontSize: "13px" }}
                                        disabled={addingToCart}
                                    >
                                        <FaShoppingCart /> Thêm vào giỏ
                                    </Button>
                                    <Button
                                        color="success"
                                        onClick={handleBuyNow}
                                        style={{ width: "150px", height: "40px", fontSize: "13px" }}
                                        disabled={addingToCart}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>
                                <CardText style={{ color: "red", marginTop: "1.5rem" }}>
                                    * Giá dịch vụ chưa bao gồm VAT
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ServiceDetail;
