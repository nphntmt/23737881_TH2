import React from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    COLORS,
    SIZES,
} from '@constants/theme';

import {
    ROOM_LABEL,
    STUDENT,
} from '@constants/student';

import {
    useCampusLocation,
} from '@hooks/useCampusLocation';

import {
    useAuthStore,
} from '@stores/authStore';

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

const MeScreen = () => {
    const logout =
        useAuthStore(
            state => state.logout,
        );

    const {
        coordinates,
        status,
        error,
        distanceKm,
        shippingFee,
        requestLocation,
        openLocationSettings,
    } = useCampusLocation();

    const renderLocationContent =
        () => {

            // =========================
            // ĐANG XIN QUYỀN / LẤY VỊ TRÍ
            // =========================
            if (
                status === 'requesting'
            ) {
                return (
                    <View style={styles.statusBox}>

                        <Text
                            style={styles.statusTitle}>
                            Đang lấy vị trí...
                        </Text>

                        <Text
                            style={styles.statusText}>
                            Vui lòng chờ trong giây lát.
                        </Text>

                    </View>
                );
            }

            // =========================
            // ĐÃ CẤP QUYỀN
            // =========================
            if (
                status === 'granted'
            ) {
                return (
                    <View style={styles.statusBox}>

                        <Text
                            style={styles.successTitle}>
                            ✓ Đã cấp quyền vị trí
                        </Text>

                        {coordinates && (
                            <>
                                <View
                                    style={styles.locationRow}>

                                    <Text
                                        style={styles.locationLabel}>
                                        Latitude
                                    </Text>

                                    <Text
                                        style={styles.locationValue}>
                                        {coordinates.latitude.toFixed(
                                            6,
                                        )}
                                    </Text>

                                </View>

                                <View
                                    style={styles.locationRow}>

                                    <Text
                                        style={styles.locationLabel}>
                                        Longitude
                                    </Text>

                                    <Text
                                        style={styles.locationValue}>
                                        {coordinates.longitude.toFixed(
                                            6,
                                        )}
                                    </Text>

                                </View>
                            </>
                        )}

                        <View
                            style={styles.infoHighlight}>

                            <Text
                                style={styles.infoHighlightLabel}>
                                Khoảng cách tới KTX
                            </Text>

                            <Text
                                style={styles.infoHighlightValue}>
                                {distanceKm !== null
                                    ? `${distanceKm.toFixed(
                                        2,
                                    )} km`
                                    : '--'}
                            </Text>

                        </View>

                        <View
                            style={styles.infoHighlight}>

                            <Text
                                style={styles.infoHighlightLabel}>
                                Phí giao hàng
                            </Text>

                            <Text
                                style={[
                                    styles.infoHighlightValue,
                                    styles.shippingValue,
                                ]}>

                                {shippingFee !== null
                                    ? formatPrice(
                                        shippingFee,
                                    )
                                    : '--'}

                            </Text>

                        </View>

                        <View
                            style={styles.infoHighlight}>

                            <Text
                                style={styles.infoHighlightLabel}>
                                Phòng giao
                            </Text>

                            <Text
                                style={styles.infoHighlightValue}>
                                {ROOM_LABEL}
                            </Text>

                        </View>

                    </View>
                );
            }

            // =========================
            // DENIED
            // =========================
            if (
                status === 'denied'
            ) {
                return (
                    <View style={styles.statusBox}>

                        <Text
                            style={styles.errorTitle}>
                            Chưa được cấp quyền
                        </Text>

                        <Text
                            style={styles.statusText}>
                            Ứng dụng cần quyền vị trí
                            để tính khoảng cách và
                            phí giao hàng.
                        </Text>

                        <Pressable
                            onPress={
                                requestLocation
                            }
                            style={({ pressed }) => [
                                styles.primaryButton,

                                pressed &&
                                styles.buttonPressed,
                            ]}>

                            <Text
                                style={styles.primaryButtonText}>
                                Cấp quyền vị trí
                            </Text>

                        </Pressable>

                    </View>
                );
            }

            // =========================
            // BLOCKED
            // =========================
            if (
                status === 'blocked'
            ) {
                return (
                    <View style={styles.statusBox}>

                        <Text
                            style={styles.errorTitle}>
                            Quyền vị trí đang bị chặn
                        </Text>

                        <Text
                            style={styles.statusText}>
                            Quyền vị trí đã bị chặn.
                            Hãy mở Cài đặt để cấp
                            quyền cho ứng dụng.
                        </Text>

                        <Pressable
                            onPress={
                                openLocationSettings
                            }
                            style={({ pressed }) => [
                                styles.secondaryButton,

                                pressed &&
                                styles.buttonPressed,
                            ]}>

                            <Text
                                style={styles.secondaryButtonText}>
                                Mở Cài đặt
                            </Text>

                        </Pressable>

                    </View>
                );
            }

            // =========================
            // ERROR
            // =========================
            if (
                status === 'error'
            ) {
                return (
                    <View style={styles.statusBox}>

                        <Text
                            style={styles.errorTitle}>
                            Không lấy được vị trí
                        </Text>

                        {error && (
                            <Text
                                style={styles.statusText}>
                                {error}
                            </Text>
                        )}

                        <Pressable
                            onPress={
                                requestLocation
                            }
                            style={({ pressed }) => [
                                styles.primaryButton,

                                pressed &&
                                styles.buttonPressed,
                            ]}>

                            <Text
                                style={styles.primaryButtonText}>
                                Thử lại
                            </Text>

                        </Pressable>

                    </View>
                );
            }

            // =========================
            // IDLE
            // =========================
            return (
                <View style={styles.statusBox}>

                    <Text
                        style={styles.statusText}>
                        Chưa kiểm tra quyền vị trí.
                    </Text>

                    <Pressable
                        onPress={
                            requestLocation
                        }
                        style={({ pressed }) => [
                            styles.primaryButton,

                            pressed &&
                            styles.buttonPressed,
                        ]}>

                        <Text
                            style={styles.primaryButtonText}>
                            Kiểm tra vị trí
                        </Text>

                    </Pressable>

                </View>
            );
        };

    return (
        <View style={styles.container}>

            {/* =========================
          HEADER
      ========================= */}

            <View style={styles.header}>

                <Text style={styles.title}>
                    Tôi
                </Text>

                <Text style={styles.student}>
                    {STUDENT.hoTen}
                </Text>

                <Text style={styles.mssv}>
                    MSSV: {STUDENT.mssv}
                </Text>

            </View>

            {/* =========================
          LOCATION
      ========================= */}

            <View style={styles.card}>

                <Text style={styles.cardTitle}>
                    📍 Vị trí giao hàng
                </Text>

                <Text
                    style={styles.cardDescription}>
                    Vị trí được sử dụng để tính
                    khoảng cách tới cổng KTX và
                    phí vận chuyển.
                </Text>

                {renderLocationContent()}

            </View>

            {/* =========================
          STUDENT INFO
      ========================= */}

            <View style={styles.card}>

                <Text style={styles.cardTitle}>
                    Thông tin sinh viên
                </Text>

                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Họ tên
                    </Text>

                    <Text style={styles.infoValue}>
                        {STUDENT.hoTen}
                    </Text>

                </View>

                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        MSSV
                    </Text>

                    <Text style={styles.infoValue}>
                        {STUDENT.mssv}
                    </Text>

                </View>

                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Phòng giao
                    </Text>

                    <Text style={styles.infoValue}>
                        {ROOM_LABEL}
                    </Text>

                </View>

            </View>

            {/* =========================
          LOGOUT
      ========================= */}

            <Pressable
                onPress={logout}
                style={({ pressed }) => [
                    styles.logoutButton,

                    pressed &&
                    styles.buttonPressed,
                ]}>

                <Text style={styles.logoutText}>
                    Đăng xuất
                </Text>

            </Pressable>

            <Watermark />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            COLORS.background,
        padding: 16,
    },

    header: {
        marginBottom: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
    },

    student: {
        marginTop: 6,
        fontSize: SIZES.body1,
        fontWeight: '700',
        color: COLORS.text,
    },

    mssv: {
        marginTop: 3,
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    card: {
        backgroundColor:
            COLORS.surface,
        borderRadius:
            SIZES.radius,
        borderWidth: 1,
        borderColor:
            COLORS.border,
        padding: 16,
        marginBottom: 14,
    },

    cardTitle: {
        fontSize: SIZES.h3,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 8,
    },

    cardDescription: {
        fontSize: SIZES.body2,
        lineHeight: 20,
        color: COLORS.textLight,
        marginBottom: 14,
    },

    statusBox: {
        borderRadius: 10,
        backgroundColor:
            COLORS.background,
        padding: 12,
    },

    statusTitle: {
        fontSize: SIZES.body1,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 5,
    },

    successTitle: {
        fontSize: SIZES.body1,
        fontWeight: '900',
        color: COLORS.success,
        marginBottom: 10,
    },

    errorTitle: {
        fontSize: SIZES.body1,
        fontWeight: '900',
        color: COLORS.error,
        marginBottom: 8,
    },

    statusText: {
        fontSize: SIZES.body2,
        lineHeight: 20,
        color: COLORS.textLight,
        marginBottom: 5,
    },

    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },

    locationLabel: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    locationValue: {
        fontSize: SIZES.body2,
        fontWeight: '800',
        color: COLORS.text,
    },

    infoHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 9,
        backgroundColor:
            COLORS.surface,
        borderWidth: 1,
        borderColor:
            COLORS.border,
    },

    infoHighlightLabel: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    infoHighlightValue: {
        fontSize: SIZES.body2,
        fontWeight: '900',
        color: COLORS.primary,
    },

    shippingValue: {
        color: COLORS.secondary,
    },

    primaryButton: {
        height: 44,
        borderRadius: 10,
        backgroundColor:
            COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginTop: 10,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.body2,
        fontWeight: '800',
    },

    secondaryButton: {
        height: 44,
        borderRadius: 10,
        backgroundColor:
            COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginTop: 10,
    },

    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.body2,
        fontWeight: '800',
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor:
            COLORS.border,
    },

    infoLabel: {
        fontSize: SIZES.body2,
        color: COLORS.textLight,
    },

    infoValue: {
        flex: 1,
        marginLeft: 12,
        textAlign: 'right',
        fontSize: SIZES.body2,
        fontWeight: '800',
        color: COLORS.text,
    },

    logoutButton: {
        height: 48,
        borderRadius:
            SIZES.radius,
        backgroundColor:
            COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 36,
    },

    logoutText: {
        color: '#FFFFFF',
        fontSize: SIZES.body1,
        fontWeight: '900',
    },

    buttonPressed: {
        opacity: 0.75,
    },
});

export default MeScreen;