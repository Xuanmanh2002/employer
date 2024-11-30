import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Button,
    Container,
    Row,
    Col,
    Table,
} from "reactstrap";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { notification } from "antd";
import Header from "components/Headers/Header.js";
import {
    getAllService,
    getAllCartItems,
    deleteCartItem,
    updateCartItem,
    getCartByEmployer,
    createOrder,
} from "utils/ApiFunctions";

const Cart = () => {
    const [state, setState] = useState({
        services: [],
        cartItems: [],
        carts: {},
        loading: true,
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            setState((prev) => ({ ...prev, loading: true }));
            try {
                const [cartItems, services, carts] = await Promise.all([
                    getAllCartItems(),
                    getAllService(),
                    getCartByEmployer(),
                ]);
                setState({ services, cartItems, carts, loading: false, error: "" });
            } catch (error) {
                setState({
                    services: [],
                    cartItems: [],
                    carts: {},
                    loading: false,
                    error: "Lỗi khi tải dữ liệu",
                });
            }
        };

        fetchData();
    }, []);

    const getServiceDetails = (serviceId) => {
        return state.services.find((service) => service.id === serviceId) || {};
    };

    const updateQuantity = async (serviceId, increment) => {
        const item = state.cartItems.find((item) => item.serviceId === serviceId);
        if (!item) return;

        const newQuantity = item.quantity + increment;
        if (newQuantity < 1) {
            notification.warning({
                message: "Cảnh báo",
                description: "Số lượng không được nhỏ hơn 1.",
            });
            return;
        }

        setState((prev) => ({ ...prev, loading: true }));
        try {
            await updateCartItem(serviceId, newQuantity);
            const updatedCartItems = await getAllCartItems();
            setState((prev) => ({ ...prev, cartItems: updatedCartItems, loading: false }));
            notification.success({
                message: "Thành công",
                description: "Cập nhật số lượng thành công.",
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.message || "Không thể cập nhật số lượng.",
            });
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const removeService = async (serviceId) => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            await deleteCartItem(serviceId);
            setState((prev) => ({
                ...prev,
                cartItems: prev.cartItems.filter((item) => item.serviceId !== serviceId),
                loading: false,
            }));
            notification.success({
                message: "Thành công",
                description: "Dịch vụ đã được xóa khỏi giỏ hàng.",
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.message || "Không thể xóa dịch vụ.",
            });
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const handleCreateOrder = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const cartId = state.carts?.id;
            if (!cartId) {
                throw new Error("Cart ID is missing");
            }

            await createOrder(cartId);

            notification.success({
                message: "Thành công",
                description: "Đơn hàng đã được tạo thành công.",
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.message || "Không thể tạo đơn hàng.",
            });
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const { cartItems, services, carts, loading, error } = state;
    const totalAmounts = carts?.totalAmounts || 0;
    const vat = totalAmounts * 0.08;
    const totalWithVAT = totalAmounts + vat;

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row>
                    <Col md="8">
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Dịch Vụ</th>
                                    <th>Đơn Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Thành Tiền</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Đang tải...</td>
                                    </tr>
                                ) : cartItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Giỏ hàng trống.</td>
                                    </tr>
                                ) : (
                                    cartItems.map((item, index) => {
                                        const service = getServiceDetails(item.serviceId);
                                        return (
                                            <tr key={item.serviceId}>
                                                <td>{index + 1}</td>
                                                <td>{service.serviceName || "Không xác định"}</td>
                                                <td>{service.price?.toLocaleString("vi-VN") || 0}₫</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.serviceId, -1)}
                                                        disabled={loading || item.quantity <= 1}
                                                    >
                                                        <FaMinus />
                                                    </Button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.serviceId, 1)}
                                                        disabled={loading}
                                                    >
                                                        <FaPlus />
                                                    </Button>
                                                </td>
                                                <td>{item.totalPrice?.toLocaleString("vi-VN") || 0}₫</td>
                                                <td>
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => removeService(item.serviceId)}
                                                        disabled={loading}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md="4">
                        <Card>
                            <CardBody>
                                <h5>Thông Tin Thanh Toán</h5>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td>Tổng cộng</td>
                                            <td>{totalAmounts.toLocaleString("vi-VN")}₫</td>
                                        </tr>
                                        <tr>
                                            <td>VAT (8%)</td>
                                            <td>{vat.toLocaleString("vi-VN")}₫</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Tổng thanh toán</strong>
                                            </td>
                                            <td>
                                                <strong className="text-danger">
                                                    {totalWithVAT.toLocaleString("vi-VN")}₫
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button
                                    color="success"
                                    className="w-100 mt-3"
                                    onClick={handleCreateOrder}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    Tạo đơn hàng
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Cart;
