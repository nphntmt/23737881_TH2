import React, {
    useState,
} from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import Watermark from '@components/Watermark';

import {
    COLORS,
    SIZES,
} from '@constants/theme';

import {
    STUDENT,
    examStamp,
} from '@constants/student';

import {
    useAuthStore,
} from '@stores/authStore';


const LoginScreen = () => {

    const [phone, setPhone] =
        useState('');

    const login =
        useAuthStore(
            state => state.login,
        );


    const handleLogin = () => {

        const value =
            phone.trim();

        if (!value) {
            Alert.alert(
                'Thiếu thông tin',
                'Vui lòng nhập số điện thoại.',
            );

            return;
        }

        login(value);
    };


    return (
        <SafeAreaView
            style={styles.safeArea}>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }>

                <View
                    style={styles.container}>

                    <View
                        style={styles.logoContainer}>

                        <Text
                            style={styles.logo}>
                            KTXGo
                        </Text>

                        <Text
                            style={styles.subtitle}>
                            Giao đồ tận phòng
                        </Text>

                    </View>


                    <View
                        style={styles.card}>

                        <Text
                            style={styles.title}>
                            Đăng nhập
                        </Text>

                        <Text
                            style={styles.description}>
                            Đăng nhập để đặt món và giao
                            đồ đến phòng ký túc xá.
                        </Text>


                        <Text
                            style={styles.label}>
                            Số điện thoại
                        </Text>

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            placeholderTextColor={
                                COLORS.textLight
                            }
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                            style={styles.input}
                        />


                        <View
                            style={styles.studentInfo}>

                            <Text
                                style={styles.studentText}>
                                MSSV: {STUDENT.mssv}
                            </Text>

                            <Text
                                style={styles.studentText}>
                                {STUDENT.hoTen}
                            </Text>

                            <Text
                                style={styles.studentStamp}>
                                #{examStamp()}
                            </Text>

                        </View>


                        <View
                            style={styles.buttonContainer}>

                            <Text
                                onPress={handleLogin}
                                style={styles.buttonText}>
                                Vào cửa hàng
                            </Text>

                        </View>

                    </View>

                </View>

            </KeyboardAvoidingView>

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

    flex: {
        flex: 1,
    },

    container: {
        flex: 1,

        justifyContent: 'center',

        padding:
            SIZES.padding,
    },

    logoContainer: {
        alignItems: 'center',

        marginBottom: 28,
    },

    logo: {
        fontSize: 42,

        fontWeight: '900',

        color:
            COLORS.primary,

        letterSpacing: -1,
    },

    subtitle: {
        marginTop: 4,

        fontSize:
            SIZES.body2,

        color:
            COLORS.textLight,
    },

    card: {
        backgroundColor:
            COLORS.surface,

        borderRadius:
            SIZES.radius,

        padding: 20,

        borderWidth: 1,

        borderColor:
            COLORS.border,
    },

    title: {
        fontSize:
            SIZES.h1,

        fontWeight: '800',

        color:
            COLORS.text,

        marginBottom: 8,
    },

    description: {
        fontSize:
            SIZES.body2,

        lineHeight: 20,

        color:
            COLORS.textLight,

        marginBottom: 20,
    },

    label: {
        fontSize:
            SIZES.body2,

        fontWeight: '700',

        color:
            COLORS.text,

        marginBottom: 8,
    },

    input: {
        height: 50,

        borderWidth: 1,

        borderColor:
            COLORS.border,

        borderRadius:
            SIZES.radius,

        paddingHorizontal: 14,

        fontSize:
            SIZES.body1,

        color:
            COLORS.text,

        backgroundColor:
            COLORS.background,

        marginBottom: 16,
    },

    studentInfo: {
        padding: 12,

        borderRadius: 10,

        backgroundColor:
            COLORS.background,

        marginBottom: 18,
    },

    studentText: {
        fontSize: 12,

        fontWeight: '600',

        color:
            COLORS.textLight,

        marginBottom: 2,
    },

    studentStamp: {
        fontSize: 12,

        fontWeight: '800',

        color:
            COLORS.primary,

        marginTop: 3,
    },

    buttonContainer: {
        height: 50,

        borderRadius:
            SIZES.radius,

        backgroundColor:
            COLORS.primary,

        justifyContent: 'center',

        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',

        fontSize:
            SIZES.body1,

        fontWeight: '800',
    },
});


export default LoginScreen;