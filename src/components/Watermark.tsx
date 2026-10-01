import React from 'react';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    COLORS,
} from '@constants/theme';

import {
    STUDENT,
    VARIANT,
    examStamp,
} from '@constants/student';

const Watermark = () => {
    return (
        <View
            pointerEvents="none"
            style={[
                styles.container,

                VARIANT.watermarkAtTop
                    ? styles.top
                    : styles.bottom,
            ]}>

            <Text style={styles.text}>
                TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #
                {examStamp()}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        left: 0,
        right: 0,

        alignItems: 'center',

        zIndex: 100,
    },

    top: {
        top: 8,
    },

    bottom: {
        bottom: 8,
    },

    text: {
        fontSize: 10,

        fontWeight: '700',

        color: COLORS.textLight,

        opacity: 0.75,
    },
});

export default Watermark;