import React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

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

import type {
    Product,
} from '@services/productApi';

type ProductCardProps = {
    product: Product;
    onPress: () => void;
    onAdd: () => void;
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

const ProductCard = ({
    product,
    onPress,
    onAdd,
}: ProductCardProps) => {

    const handleAdd = () => {
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

        onAdd();
    };

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,

                pressed &&
                styles.cardPressed,
            ]}>

            <Image
                source={{
                    uri: product.image,
                }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.content}>

                <Text
                    style={styles.category}
                    numberOfLines={1}>
                    {product.category}
                </Text>

                <Text
                    style={styles.title}
                    numberOfLines={2}>
                    {product.title}
                </Text>

                <View
                    style={styles.bottomRow}>

                    <Text
                        style={styles.price}
                        numberOfLines={1}>
                        {formatPrice(
                            product.price,
                        )}
                    </Text>

                    <Pressable
                        onPress={event => {
                            event.stopPropagation();
                            handleAdd();
                        }}
                        style={({ pressed }) => [
                            styles.addButton,

                            pressed &&
                            styles.addButtonPressed,
                        ]}>

                        <Text
                            style={styles.addText}>
                            +
                        </Text>

                    </Pressable>

                </View>

            </View>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 6,
        minHeight: 260,
        backgroundColor:
            COLORS.surface,
        borderRadius:
            SIZES.radius,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },

    cardPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    image: {
        width: '100%',
        height: 145,
        backgroundColor:
            COLORS.background,
    },

    content: {
        flex: 1,
        padding: 10,
    },

    category: {
        fontSize: SIZES.caption,
        color: COLORS.textLight,
        marginBottom: 4,
        textTransform: 'capitalize',
    },

    title: {
        minHeight: 40,
        fontSize: SIZES.body2,
        lineHeight: 19,
        fontWeight: '700',
        color: COLORS.text,
    },

    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    price: {
        flex: 1,
        fontSize: 13,
        fontWeight: '900',
        color: COLORS.primary,
        marginRight: 6,
    },

    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
            COLORS.secondary,
    },

    addButtonPressed: {
        opacity: 0.7,
    },

    addText: {
        color: '#FFFFFF',
        fontSize: 25,
        lineHeight: 27,
        fontWeight: '700',
    },
});

export default ProductCard;