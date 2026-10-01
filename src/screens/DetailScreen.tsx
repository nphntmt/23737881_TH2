import React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useQuery,
} from '@tanstack/react-query';

import ReactNativeHapticFeedback from
    'react-native-haptic-feedback';

import {
    COLORS,
    SIZES,
} from '@constants/theme';

import {
    PRICE_MULTIPLIER,
    VARIANT,
} from '@constants/student';

import {
    getProductById,
} from '@services/productApi';

import {
    useCartStore,
} from '@stores/cartStore';

import Watermark from
    '@components/Watermark';

type DetailScreenProps = {
    route: {
        params: {
            id: string;
        };
    };
};

const formatPrice = (
    price: number,
): string => {
    const vndPrice =
        Math.round(
            price * PRICE_MULTIPLIER,
        );

    return (
        `${vndPrice.toLocaleString(
            'vi-VN',
        )} đ`
    );
};

const DetailScreen = ({
    route,
}: DetailScreenProps) => {
    const {
        id,
    } = route.params;

    const addItem =
        useCartStore(
            state => state.addItem,
        );

    const {
        data: product,
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [
            'product',
            id,
        ],

        queryFn: () =>
            getProductById(id),
    });

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        if (
            VARIANT.hapticOnAdd ===
            'selection'
        ) {
            ReactNativeHapticFeedback.trigger(
                'selection',
                {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                },
            );
        }

        addItem(product);
    };

    if (isPending) {
        return (
            <View style={styles.centerContainer}>

                <Text style={styles.loadingText}>
                    Đang tải sản phẩm...
                </Text>

                <Watermark />

            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={styles.centerContainer}>

                <Text style={styles.errorTitle}>
                    Không tải được sản phẩm
                </Text>

                <Text style={styles.errorText}>
                    {error instanceof Error
                        ? error.message
                        : 'Có lỗi xảy ra.'}
                </Text>

                <Pressable
                    onPress={() => {
                        refetch();
                    }}
                    style={({ pressed }) => [
                        styles.retryButton,

                        pressed &&
                        styles.buttonPressed,
                    ]}>

                    <Text
                        style={styles.retryText}>
                        {isFetching
                            ? 'Đang thử lại...'
                            : 'Thử lại'}
                    </Text>

                </Pressable>

                <Watermark />

            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Image
                source={{
                    uri: product.image,
                }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.content}>

                <Text
                    style={styles.category}>
                    {product.category}
                </Text>

                <Text
                    style={styles.title}>
                    {product.title}
                </Text>

                <Text
                    style={styles.price}>
                    {formatPrice(
                        product.price,
                    )}
                </Text>

                {product.rating && (
                    <View
                        style={styles.ratingRow}>

                        <Text
                            style={styles.rating}>
                            ★ {product.rating.rate}
                        </Text>

                        <Text
                            style={styles.ratingCount}>
                            ({product.rating.count} đánh giá)
                        </Text>

                    </View>
                )}

                <View
                    style={styles.descriptionCard}>

                    <Text
                        style={styles.descriptionTitle}>
                        Mô tả
                    </Text>

                    <Text
                        style={styles.description}>
                        {product.description}
                    </Text>

                </View>

                <Pressable
                    onPress={
                        handleAddToCart
                    }
                    style={({ pressed }) => [
                        styles.addButton,

                        pressed &&
                        styles.buttonPressed,
                    ]}>

                    <Text
                        style={styles.addButtonText}>
                        + Thêm vào giỏ
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
    },

    centerContainer: {
        flex: 1,
        backgroundColor:
            COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    loadingText: {
        fontSize: SIZES.body1,
        fontWeight: '700',
        color: COLORS.text,
    },

    errorTitle: {
        fontSize: SIZES.h2,
        fontWeight: '900',
        color: COLORS.error,
        textAlign: 'center',
    },

    errorText: {
        marginTop: 8,
        fontSize: SIZES.body2,
        lineHeight: 20,
        color: COLORS.textLight,
        textAlign: 'center',
    },

    retryButton: {
        marginTop: 18,
        minWidth: 120,
        height: 44,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor:
            COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    retryText: {
        color: '#FFFFFF',
        fontSize: SIZES.body2,
        fontWeight: '800',
    },

    image: {
        width: '100%',
        height: 280,
        backgroundColor:
            COLORS.surface,
    },

    content: {
        flex: 1,
        padding: 16,
    },

    category: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
        textTransform: 'capitalize',
        marginBottom: 6,
    },

    title: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '900',
        color: COLORS.text,
    },

    price: {
        marginTop: 12,
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.primary,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    rating: {
        fontSize: SIZES.body2,
        fontWeight: '900',
        color: COLORS.secondary,
    },

    ratingCount: {
        marginLeft: 6,
        fontSize: SIZES.caption,
        color: COLORS.textLight,
    },

    descriptionCard: {
        marginTop: 16,
        padding: 14,
        borderRadius:
            SIZES.radius,
        backgroundColor:
            COLORS.surface,
        borderWidth: 1,
        borderColor:
            COLORS.border,
    },

    descriptionTitle: {
        fontSize: SIZES.h3,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 7,
    },

    description: {
        fontSize: SIZES.body2,
        lineHeight: 21,
        color: COLORS.textLight,
    },

    addButton: {
        height: 50,
        borderRadius:
            SIZES.radius,
        backgroundColor:
            COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 24,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.body1,
        fontWeight: '900',
    },

    buttonPressed: {
        opacity: 0.7,
    },
});

export default DetailScreen;