import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    createJSONStorage,
    persist,
} from 'zustand/middleware';

import { create } from 'zustand';

import {
    PRICE_MULTIPLIER,
    STUDENT,
} from '@constants/student';

import type {
    Product,
} from '@services/productApi';

export type CartItem = {
    product: Product;
    quantity: number;
};

type CartState = {
    items: CartItem[];

    addItem: (
        product: Product,
    ) => void;

    removeItem: (
        productId: number,
    ) => void;

    changeQty: (
        productId: number,
        quantity: number,
    ) => void;

    clearCart: () => void;

    getTotalQuantity: () => number;

    getTotalAmount: () => number;

    getProductPrice: (
        product: Product,
    ) => number;

    // Giữ lại để các màn hình cũ
    // không bị lỗi trong lúc chuyển đổi.
    getTotalPrice: () => number;
};

export const useCartStore =
    create<CartState>()(
        persist(
            (set, get) => ({
                items: [],

                addItem: product => {
                    set(state => {
                        const existing =
                            state.items.find(
                                item =>
                                    item.product.id ===
                                    product.id,
                            );

                        if (existing) {
                            return {
                                items:
                                    state.items.map(
                                        item =>
                                            item.product.id ===
                                                product.id
                                                ? {
                                                    ...item,
                                                    quantity:
                                                        item.quantity + 1,
                                                }
                                                : item,
                                    ),
                            };
                        }

                        return {
                            items: [
                                ...state.items,

                                {
                                    product,
                                    quantity: 1,
                                },
                            ],
                        };
                    });
                },

                removeItem: productId => {
                    set(state => ({
                        items:
                            state.items
                                .map(item =>
                                    item.product.id ===
                                        productId
                                        ? {
                                            ...item,
                                            quantity:
                                                item.quantity - 1,
                                        }
                                        : item,
                                )
                                .filter(
                                    item =>
                                        item.quantity > 0,
                                ),
                    }));
                },

                changeQty: (
                    productId,
                    quantity,
                ) => {
                    if (quantity <= 0) {
                        set(state => ({
                            items:
                                state.items.filter(
                                    item =>
                                        item.product.id !==
                                        productId,
                                ),
                        }));

                        return;
                    }

                    set(state => ({
                        items:
                            state.items.map(
                                item =>
                                    item.product.id ===
                                        productId
                                        ? {
                                            ...item,
                                            quantity,
                                        }
                                        : item,
                            ),
                    }));
                },

                clearCart: () => {
                    set({
                        items: [],
                    });
                },

                getTotalQuantity: () => {
                    return get().items.reduce(
                        (total, item) =>
                            total + item.quantity,
                        0,
                    );
                },

                getProductPrice: product => {
                    return Math.round(
                        product.price *
                        PRICE_MULTIPLIER,
                    );
                },

                getTotalAmount: () => {
                    return get().items.reduce(
                        (total, item) => {
                            const price =
                                Math.round(
                                    item.product.price *
                                    PRICE_MULTIPLIER,
                                );

                            return (
                                total +
                                price *
                                item.quantity
                            );
                        },
                        0,
                    );
                },

                // Alias tạm thời cho code cũ.
                getTotalPrice: () => {
                    return get().items.reduce(
                        (total, item) => {
                            const price =
                                Math.round(
                                    item.product.price *
                                    PRICE_MULTIPLIER,
                                );

                            return (
                                total +
                                price *
                                item.quantity
                            );
                        },
                        0,
                    );
                },
            }),

            {
                name:
                    `ktxgo-cart-${STUDENT.mssv}`,

                storage:
                    createJSONStorage(
                        () => AsyncStorage,
                    ),
            },
        ),
    );