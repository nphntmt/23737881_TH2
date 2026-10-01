import React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    FlashList,
} from '@shopify/flash-list';

import {
    COLORS,
    SIZES,
} from '@constants/theme';

import {
    ROOM_LABEL,
    STUDENT,
    PRICE_MULTIPLIER,
} from '@constants/student';

import {
    useCartStore,
} from '@stores/cartStore';

import {
    useCampusLocation,
} from '@hooks/useCampusLocation';

import type {
    CartItem,
} from '@stores/cartStore';

import Watermark from
    '@components/Watermark';

const formatPrice = (
    value: number,
): string => {
    return (
        `${Math.round(value).toLocaleString(
            'vi-VN',
        )} đ`
    );
};

const getItemPrice = (
    price: number,
): number => {
    return Math.round(
        price * PRICE_MULTIPLIER,
    );
};

const CartScreen = () => {
    const items =
        useCartStore(
            state => state.items,
        );

    const addItem =
        useCartStore(
            state => state.addItem,
        );

    const removeItem =
        useCartStore(
            state => state.removeItem,
        );

    const changeQty =
        useCartStore(
            state => state.changeQty,
        );

    const clearCart =
        useCartStore(
            state => state.clearCart,
        );

    const getTotalQuantity =
        useCartStore(
            state => state.getTotalQuantity,
        );

    const getTotalAmount =
        useCartStore(
            state => state.getTotalAmount,
        );

    const {
        status: locationStatus,
        distanceKm,
        shippingFee,
    } = useCampusLocation();

    const totalQuantity =
        getTotalQuantity();

    const subtotal =
        getTotalAmount();

    const hasShipping =
        locationStatus === 'granted' &&
        shippingFee !== null;

    const currentShippingFee =
        hasShipping
            ? shippingFee
            : 0;

    const grandTotal =
        subtotal +
        currentShippingFee;

    const renderItem = ({
        item,
    }: {
        item: CartItem;
    }) => {
        const productPrice =
            getItemPrice(
                item.product.price,
            );

        const itemTotal =
            productPrice *
            item.quantity;

        return (
            <View style={styles.itemCard}>

                <Image
                    source={{
                        uri: item.product.image,
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                />

                <View style={styles.itemContent}>

                    <Text
                        style={styles.category}
                        numberOfLines={1}>
                        {item.product.category}
                    </Text>

                    <Text
                        style={styles.productTitle}
                        numberOfLines={2}>
                        {item.product.title}
                    </Text>

                    <Text style={styles.unitPrice}>
                        {formatPrice(productPrice)}
                    </Text>

                    <Text style={styles.itemTotal}>
                        Thành tiền:{' '}
                        {formatPrice(itemTotal)}
                    </Text>

                    <View
                        style={styles.quantityRow}>

                        <Pressable
                            onPress={() => {
                                if (
                                    item.quantity === 1
                                ) {
                                    removeItem(
                                        item.product.id,
                                    );
                                } else {
                                    changeQty(
                                        item.product.id,
                                        item.quantity - 1,
                                    );
                                }
                            }}
                            style={({ pressed }) => [
                                styles.quantityButton,

                                pressed &&
                                styles.buttonPressed,
                            ]}>

                            <Text
                                style={styles.quantityButtonText}>
                                −
                            </Text>

                        </Pressable>

                        <Text
                            style={styles.quantityText}>
                            {item.quantity}
                        </Text>

                        <Pressable
                            onPress={() => {
                                addItem(
                                    item.product,
                                );
                            }}
                            style={({ pressed }) => [
                                styles.quantityButton,

                                pressed &&
                                styles.buttonPressed,
                            ]}>

                            <Text
                                style={styles.quantityButtonText}>
                                +
                            </Text>

                        </Pressable>

                    </View>

                    <Pressable
                        onPress={() => {
                            changeQty(
                                item.product.id,
                                0,
                            );
                        }}
                        style={styles.removeButton}>

                        <Text
                            style={styles.removeText}>
                            Xóa món
                        </Text>

                    </Pressable>

                </View>

            </View>
        );
    };

    if (items.length === 0) {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.title}>
                        Giỏ hàng
                    </Text>

                    <Text style={styles.subtitle}>
                        Giao tận {ROOM_LABEL}
                    </Text>
                </View>

                <View style={styles.emptyContainer}>

                    <Text style={styles.emptyIcon}>
                        🛒
                    </Text>

                    <Text style={styles.emptyTitle}>
                        Giỏ hàng đang trống
                    </Text>

                    <Text style={styles.emptyText}>
                        Hãy quay lại Cửa hàng và
                        thêm món vào giỏ.
                    </Text>

                </View>

                <Watermark />

            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View>
                    <Text style={styles.title}>
                        Giỏ hàng
                    </Text>

                    <Text style={styles.subtitle}>
                        Giao tận {ROOM_LABEL}
                    </Text>
                </View>

                <Pressable
                    onPress={clearCart}
                    style={({ pressed }) => [
                        styles.clearButton,

                        pressed &&
                        styles.buttonPressed,
                    ]}>

                    <Text
                        style={styles.clearButtonText}>
                        Xóa tất cả
                    </Text>

                </Pressable>

            </View>

            <View style={styles.countCard}>

                <Text style={styles.countLabel}>
                    Tổng số lượng
                </Text>

                <Text style={styles.countValue}>
                    {totalQuantity} món
                </Text>

            </View>

            <FlashList
                data={items}
                renderItem={renderItem}
                keyExtractor={item =>
                    `${STUDENT.mssv}-${item.product.id}`
                }
                contentContainerStyle={
                    styles.listContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            />

            <View style={styles.summaryCard}>

                <View style={styles.summaryRow}>
                    <Text
                        style={styles.summaryLabel}>
                        Tạm tính
                    </Text>

                    <Text
                        style={styles.summaryValue}>
                        {formatPrice(subtotal)}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text
                        style={styles.summaryLabel}>
                        Khoảng cách
                    </Text>

                    <Text
                        style={styles.summaryValue}>
                        {distanceKm !== null
                            ? `${distanceKm.toFixed(2)} km`
                            : 'Chưa có vị trí'}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text
                        style={styles.summaryLabel}>
                        Phí giao hàng
                    </Text>

                    <Text
                        style={[
                            styles.summaryValue,
                            styles.shippingValue,
                        ]}>

                        {hasShipping
                            ? formatPrice(
                                currentShippingFee,
                            )
                            : 'Chưa tính'}

                    </Text>
                </View>

                <View
                    style={styles.divider}
                />

                <View style={styles.totalRow}>

                    <Text style={styles.totalLabel}>
                        Tổng cộng
                    </Text>

                    <Text style={styles.totalValue}>
                        {formatPrice(grandTotal)}
                    </Text>

                </View>

                {locationStatus !==
                    'granted' && (
                        <Text style={styles.locationNote}>
                            Cấp quyền vị trí trong tab
                            Tôi để tính phí giao hàng.
                        </Text>
                    )}

                <Pressable
                    onPress={() => { }}
                    style={({ pressed }) => [
                        styles.orderButton,

                        pressed &&
                        styles.buttonPressed,
                    ]}>

                    <Text
                        style={styles.orderButtonText}>
                        Đặt món
                    </Text>

                </Pressable>

            </View>

            <Watermark />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            COLORS.background,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 9,
        backgroundColor:
            COLORS.error,
    },

    clearButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.caption,
        fontWeight: '800',
    },

    countCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:
            COLORS.surface,
        borderRadius:
            SIZES.radius,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginBottom: 10,
    },

    countLabel: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    countValue: {
        fontSize: SIZES.body2,
        fontWeight: '900',
        color: COLORS.primary,
    },

    listContent: {
        paddingBottom: 10,
    },

    itemCard: {
        flexDirection: 'row',
        backgroundColor:
            COLORS.surface,
        borderRadius:
            SIZES.radius,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        padding: 10,
        marginBottom: 10,
    },

    productImage: {
        width: 90,
        height: 110,
        backgroundColor:
            COLORS.background,
        borderRadius: 8,
    },

    itemContent: {
        flex: 1,
        marginLeft: 12,
    },

    category: {
        fontSize: SIZES.caption,
        color: COLORS.textLight,
        textTransform: 'capitalize',
        marginBottom: 3,
    },

    productTitle: {
        fontSize: SIZES.body2,
        lineHeight: 19,
        fontWeight: '800',
        color: COLORS.text,
    },

    unitPrice: {
        marginTop: 5,
        fontSize: SIZES.body2,
        fontWeight: '800',
        color: COLORS.primary,
    },

    itemTotal: {
        marginTop: 3,
        fontSize: SIZES.caption,
        fontWeight: '700',
        color: COLORS.textLight,
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor:
            COLORS.background,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quantityButtonText: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: '900',
        color: COLORS.primary,
    },

    quantityText: {
        minWidth: 34,
        textAlign: 'center',
        fontSize: SIZES.body2,
        fontWeight: '900',
        color: COLORS.text,
    },

    removeButton: {
        alignSelf: 'flex-start',
        marginTop: 6,
    },

    removeText: {
        fontSize: SIZES.caption,
        fontWeight: '800',
        color: COLORS.error,
    },

    summaryCard: {
        backgroundColor:
            COLORS.surface,
        borderRadius:
            SIZES.radius,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        padding: 14,
        marginTop: 4,
        marginBottom: 36,
    },

    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    summaryLabel: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    summaryValue: {
        fontSize: SIZES.body2,
        fontWeight: '800',
        color: COLORS.text,
    },

    shippingValue: {
        color: COLORS.secondary,
    },

    divider: {
        height: 1,
        backgroundColor:
            COLORS.border,
        marginVertical: 5,
    },

    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 3,
    },

    totalLabel: {
        fontSize: SIZES.body1,
        fontWeight: '900',
        color: COLORS.text,
    },

    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },

    locationNote: {
        marginTop: 8,
        fontSize: SIZES.caption,
        lineHeight: 17,
        color: COLORS.textLight,
    },

    orderButton: {
        height: 46,
        borderRadius:
            SIZES.radius,
        backgroundColor:
            COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },

    orderButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.body1,
        fontWeight: '900',
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },

    emptyIcon: {
        fontSize: 54,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: SIZES.h2,
        fontWeight: '900',
        color: COLORS.text,
    },

    emptyText: {
        marginTop: 7,
        textAlign: 'center',
        fontSize: SIZES.body2,
        lineHeight: 20,
        color: COLORS.textLight,
        maxWidth: 280,
    },

    buttonPressed: {
        opacity: 0.7,
    },
});

export default CartScreen;