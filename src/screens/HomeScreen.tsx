import React, {
    useMemo,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useQuery,
} from '@tanstack/react-query';

import {
    FlashList,
} from '@shopify/flash-list';

import {
    useNavigation,
} from '@react-navigation/native';

import type {
    NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import ProductCard from '@components/ProductCard';

import Watermark from '@components/Watermark';

import {
    COLORS,
    SIZES,
} from '@constants/theme';

import {
    ROOM_LABEL,
    STUDENT,
    examStamp,
} from '@constants/student';

import {
    useDebouncedValue,
} from '@hooks/useDebouncedValue';

import {
    getProducts,
} from '@services/productApi';

import type {
    Product,
} from '@services/productApi';

import {
    useCartStore,
} from '@stores/cartStore';

import type {
    ShopStackParamList,
} from '@navigation/ShopStack';


type NavigationProp =
    NativeStackNavigationProp<
        ShopStackParamList,
        'Home'
    >;


const HomeScreen = () => {

    const navigation =
        useNavigation<NavigationProp>();

    const addItem =
        useCartStore(
            state => state.addItem,
        );

    const [search, setSearch] =
        useState('');

    const debouncedSearch =
        useDebouncedValue(search);


    const {
        data,
        isPending,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: [
            'products',
            STUDENT.mssv,
        ],

        queryFn:
            getProducts,

        staleTime:
            15_000,
    });


    const filteredProducts =
        useMemo(() => {

            if (!data) {
                return [];
            }

            const keyword =
                debouncedSearch
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return data;
            }

            return data.filter(
                product =>
                    product.title
                        .toLowerCase()
                        .includes(keyword) ||

                    product.category
                        .toLowerCase()
                        .includes(keyword),
            );

        }, [
            data,
            debouncedSearch,
        ]);


    const renderProduct = ({
        item,
    }: {
        item: Product;
    }) => {

        return (
            <ProductCard
                product={item}

                onPress={() => {
                    navigation.navigate(
                        'Detail',
                        {
                            id: String(item.id),
                        },
                    );
                }}

                onAdd={() => {
                    addItem(item);
                }}
            />
        );
    };


    const renderHeader =
        () => (
            <View>

                <View
                    style={styles.header}>

                    <View
                        style={styles.headerText}>

                        <Text
                            style={styles.logo}>
                            KTXGo
                        </Text>

                        <Text
                            style={styles.room}>
                            Giao tận {ROOM_LABEL}
                        </Text>

                    </View>

                    <Text
                        style={styles.stamp}>
                        #{examStamp()}
                    </Text>

                </View>


                <Text
                    style={styles.student}>
                    {STUDENT.mssv} · {STUDENT.hoTen}
                </Text>


                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm món..."
                    placeholderTextColor={
                        COLORS.textLight
                    }
                    style={styles.searchInput}
                    returnKeyType="search"
                />


                {search.length > 0 && (
                    <Text
                        style={styles.searchInfo}>
                        Đang tìm: "{search}"
                    </Text>
                )}

            </View>
        );


    if (isPending) {

        return (
            <SafeAreaView
                style={styles.safeArea}>

                <View
                    style={styles.loadingContainer}>

                    <ActivityIndicator
                        size="large"
                        color={
                            COLORS.primary
                        }
                    />

                    <Text
                        style={styles.loadingText}>
                        Đang tải danh sách món...
                    </Text>

                </View>

                <Watermark />

            </SafeAreaView>
        );
    }


    if (isError) {

        return (
            <SafeAreaView
                style={styles.safeArea}>

                <View
                    style={styles.errorContainer}>

                    <Text
                        style={styles.errorTitle}>
                        Không thể tải dữ liệu
                    </Text>

                    <Text
                        style={styles.errorText}>
                        MSSV: {STUDENT.mssv}
                    </Text>

                    <Text
                        style={styles.errorText}>
                        {error instanceof Error
                            ? error.message
                            : 'Lỗi mạng không xác định'}
                    </Text>

                    <Pressable
                        onPress={() => {
                            refetch();
                        }}
                        style={styles.retryButton}>

                        <Text
                            style={styles.retryText}>
                            Thử lại
                        </Text>

                    </Pressable>

                </View>

                <Watermark />

            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            style={styles.safeArea}>

            <FlashList
                data={filteredProducts}

                renderItem={
                    renderProduct
                }

                numColumns={2}

                keyExtractor={item =>
                    `${STUDENT.mssv}-${item.id}`
                }

                ListHeaderComponent={
                    renderHeader
                }

                contentContainerStyle={
                    styles.listContent
                }

                refreshControl={
                    <RefreshControl
                        refreshing={
                            isRefetching
                        }

                        onRefresh={() => {
                            refetch();
                        }}

                        tintColor={
                            COLORS.primary
                        }
                    />
                }

                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }>

                        <Text
                            style={
                                styles.emptyTitle
                            }>
                            Không tìm thấy món
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }>
                            Thử từ khóa khác nhé.
                        </Text>

                    </View>
                }

                showsVerticalScrollIndicator={
                    false
                }
            />

            <Watermark />

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({

    safeArea: {
        flex: 1,

        backgroundColor:
            COLORS.background,
    },

    listContent: {
        padding: 8,

        paddingBottom: 28,
    },

    header: {
        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',

        paddingHorizontal: 8,

        paddingTop: 8,

        paddingBottom: 4,
    },

    headerText: {
        flex: 1,
    },

    logo: {
        fontSize: 28,

        fontWeight: '900',

        color:
            COLORS.primary,
    },

    room: {
        marginTop: 2,

        fontSize:
            SIZES.body2,

        color:
            COLORS.textLight,
    },

    stamp: {
        fontSize:
            SIZES.caption,

        fontWeight: '700',

        color:
            COLORS.textLight,
    },

    student: {
        paddingHorizontal: 8,

        marginBottom: 10,

        fontSize:
            SIZES.caption,

        fontWeight: '700',

        color:
            COLORS.textLight,
    },

    searchInput: {
        height: 48,

        marginHorizontal: 8,

        marginBottom: 6,

        paddingHorizontal: 14,

        borderWidth: 1,

        borderColor:
            COLORS.border,

        borderRadius:
            SIZES.radius,

        backgroundColor:
            COLORS.surface,

        color:
            COLORS.text,

        fontSize:
            SIZES.body2,
    },

    searchInfo: {
        marginHorizontal: 10,

        marginBottom: 6,

        fontSize:
            SIZES.caption,

        color:
            COLORS.textLight,
    },

    loadingContainer: {
        flex: 1,

        justifyContent:
            'center',

        alignItems: 'center',
    },

    loadingText: {
        marginTop: 12,

        fontSize:
            SIZES.body2,

        color:
            COLORS.textLight,
    },

    errorContainer: {
        flex: 1,

        justifyContent:
            'center',

        alignItems: 'center',

        padding:
            SIZES.padding,
    },

    errorTitle: {
        fontSize:
            SIZES.h2,

        fontWeight: '900',

        color:
            COLORS.error,

        marginBottom: 10,
    },

    errorText: {
        textAlign: 'center',

        fontSize:
            SIZES.body2,

        color:
            COLORS.textLight,

        marginBottom: 4,
    },

    retryButton: {
        marginTop: 18,

        paddingHorizontal: 28,

        height: 46,

        borderRadius:
            SIZES.radius,

        backgroundColor:
            COLORS.primary,

        justifyContent:
            'center',

        alignItems: 'center',
    },

    retryText: {
        color: '#FFFFFF',

        fontSize:
            SIZES.body1,

        fontWeight: '800',
    },

    emptyContainer: {
        alignItems: 'center',

        paddingTop: 50,
    },

    emptyTitle: {
        fontSize:
            SIZES.h2,

        fontWeight: '800',

        color:
            COLORS.text,
    },

    emptyText: {
        marginTop: 6,

        fontSize:
            SIZES.body2,

        color:
            COLORS.textLight,
    },

});


export default HomeScreen;