import React from 'react';

import {
    NavigationContainer,
} from '@react-navigation/native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';

import {
    useAuthStore,
} from '@stores/authStore';

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

const Stack =
    createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {

    const token =
        useAuthStore(
            state => state.token,
        );

    return (
        <NavigationContainer>

            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>

                {!token ? (
                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                    />
                ) : (
                    <Stack.Screen
                        name="Main"
                        component={MainTabs}
                    />
                )}

            </Stack.Navigator>

        </NavigationContainer>
    );
};

export default RootNavigator;