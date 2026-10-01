import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
    createJSONStorage,
    persist,
} from 'zustand/middleware';

import {
    STUDENT,
    examStamp,
} from '@constants/student';

type AuthState = {
    token: string | null;
    login: (phone: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            token: null,

            login: phone => {
                const token =
                    `ktxgo-${STUDENT.mssv}-${examStamp()}`;

                console.log(
                    '[KTXGo] Login phone:',
                    phone,
                );

                set({
                    token,
                });
            },

            logout: () => {
                set({
                    token: null,
                });
            },
        }),

        {
            name: `ktxgo-auth-${STUDENT.mssv}`,

            storage:
                createJSONStorage(
                    () => AsyncStorage,
                ),
        },
    ),
);