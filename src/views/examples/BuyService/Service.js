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
import { getAllService, addItemToCart } from "utils/ApiFunctions";
import { FaShoppingCart } from "react-icons/fa";
import { notification } from "antd"; 

const Service = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedStates, setExpandedStates] = useState([]);
    const [addingToCart, setAddingToCart] = useState([]); 

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getAllService();
                setServices(data);
                setError("");
                setExpandedStates(new Array(data.length).fill(false));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const toggleExpand = (index) => {
        const newExpandedStates = [...expandedStates];
        newExpandedStates[index] = !newExpandedStates[index];
        setExpandedStates(newExpandedStates);
    };

    const handleAddToCart = async (serviceId) => {
        try {
            setAddingToCart(prevState => [...prevState, serviceId]);
            await addItemToCart(serviceId, 1); 
            setAddingToCart(prevState => prevState.filter(id => id !== serviceId)); 
            notification.success({
                message: 'Thêm vào giỏ hàng thành công!',
                description: 'Dịch vụ đã được thêm vào giỏ hàng của bạn.',
                placement: 'topRight',
            });
        } catch (error) {
            setAddingToCart(prevState => prevState.filter(id => id !== serviceId)); 
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error.message,
                placement: 'topRight', 
            });
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
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                ) : services.length === 0 ? (
                    <div className="alert alert-warning text-center">
                        Không có dịch vụ nào để hiển thị.
                    </div>
                ) : (
                    <Row>
                        {services.map((service, index) => (
                            <Col md="4" key={index} className="mb-4">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5" className="text-success">
                                            {service.serviceName}
                                        </CardTitle>
                                        <h2 className="text-danger">
                                            {service.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                        </h2>
                                        <CardText
                                            style={{
                                                maxHeight: expandedStates[index] ? "none" : "100px",
                                                overflow: "hidden",
                                                transition: "max-height 0.3s ease",
                                            }}
                                        >
                                            {service.description}
                                        </CardText>
                                        <Button
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "green",
                                                color: "green",
                                            }}
                                            className="me-2"
                                            onClick={(e) =>{e.preventDefault(); handleAddToCart(service.id)}}
                                            disabled={addingToCart.includes(service.id)}
                                        >
                                            {addingToCart.includes(service.id) ? "Đang thêm..." : <><FaShoppingCart className="me-1" /> Thêm vào giỏ</>}
                                        </Button>
                                        <Button
                                            onClick={(e) =>{e.preventDefault(); handleAddToCart(service.id)}}
                                            disabled={addingToCart.includes(service.id)}
                                            color="success"> Mua ngay</Button>
                                        <Button
                                            color="link"
                                            onClick={() => toggleExpand(index)}
                                            className="mt-2"
                                        >
                                            {expandedStates[index] ? "Thu gọn" : "Xem thêm"}
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default Service;
