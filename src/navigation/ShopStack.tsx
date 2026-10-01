import React from 'react';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '@screens/HomeScreen';
import DetailScreen from '@screens/DetailScreen';

import {
    COLORS,
} from '@constants/theme';

export type ShopStackParamList = {
    Home: undefined;
    Detail: {
        id: string;
    };
};

const Stack =
    createNativeStackNavigator<ShopStackParamList>();

const ShopStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor:
                        COLORS.surface,
                },

                headerTintColor:
                    COLORS.text,

                headerTitleStyle: {
                    fontWeight: '800',
                },

                contentStyle: {
                    backgroundColor:
                        COLORS.background,
                },
            }}>

            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{
                    title: 'Chi tiết món',
                    presentation: 'card',
                }}
            />

        </Stack.Navigator>
    );
};

export default ShopStack;