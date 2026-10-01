import React from 'react';

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import ShopStack from '@navigation/ShopStack';

import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';

import {
    COLORS,
} from '@constants/theme';

import {
    useCartStore,
} from '@stores/cartStore';

export type MainTabsParamList = {
    Shop: undefined;
    Cart: undefined;
    Me: undefined;
};

const Tab =
    createBottomTabNavigator<MainTabsParamList>();

const MainTabs = () => {
    const totalQuantity =
        useCartStore(
            state => state.getTotalQuantity(),
        );

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor:
                    COLORS.primary,

                tabBarInactiveTintColor:
                    COLORS.textLight,

                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                    backgroundColor:
                        COLORS.surface,
                    borderTopColor:
                        COLORS.border,
                },
            }}>

            <Tab.Screen
                name="Shop"
                component={ShopStack}
                options={{
                    title: 'Cửa hàng',
                }}
            />

            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    title: 'Giỏ',

                    tabBarBadge:
                        totalQuantity > 0
                            ? totalQuantity
                            : undefined,

                    tabBarBadgeStyle: {
                        backgroundColor:
                            COLORS.secondary,
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: '800',
                    },
                }}
            />

            <Tab.Screen
                name="Me"
                component={MeScreen}
                options={{
                    title: 'Tôi',
                }}
            />

        </Tab.Navigator>
    );
};

export default MainTabs;