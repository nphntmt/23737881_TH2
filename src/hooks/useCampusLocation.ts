import { useCallback, useEffect, useState } from 'react';

import {
    Linking,
    PermissionsAndroid,
    Platform,
} from 'react-native';

import Geolocation from
    '@react-native-community/geolocation';

import {
    BASE_SHIP_FEE,
    VARIANT,
} from '@constants/student';

export type Coordinates = {
    latitude: number;
    longitude: number;
};

type LocationStatus =
    | 'idle'
    | 'requesting'
    | 'granted'
    | 'denied'
    | 'blocked'
    | 'error';

type CampusLocationState = {
    coordinates: Coordinates | null;
    status: LocationStatus;
    error: string | null;
};

/*
 * Tọa độ cố định của khu KTX IUH.
 *
 * Latitude:  10.8294861
 * Longitude: 106.6885878
 */
const KTX_GATE = {
    latitude: 10.8294861,
    longitude: 106.6885878,
};

const toRadians = (
    degrees: number,
): number => {
    return (
        degrees *
        (Math.PI / 180)
    );
};

const haversineKm = (
    from: Coordinates,
    to: Coordinates,
): number => {
    const EARTH_RADIUS_KM = 6371;

    const dLat = toRadians(
        to.latitude -
        from.latitude,
    );

    const dLon = toRadians(
        to.longitude -
        from.longitude,
    );

    const lat1 =
        toRadians(from.latitude);

    const lat2 =
        toRadians(to.latitude);

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
        );

    return EARTH_RADIUS_KM * c;
};

const calculateShippingFee = (
    distanceKm: number,
): number => {
    if (
        VARIANT.shipFormula === 'B'
    ) {
        return (
            BASE_SHIP_FEE +
            Math.round(
                distanceKm * 1500,
            ) +
            2000
        );
    }

    return (
        BASE_SHIP_FEE +
        Math.round(
            distanceKm * 2000,
        )
    );
};

const requestAndroidPermission =
    async (): Promise<
        'granted' | 'denied' | 'blocked'
    > => {

        if (Platform.OS !== 'android') {
            return 'granted';
        }

        const permission =
            PermissionsAndroid.PERMISSIONS
                .ACCESS_FINE_LOCATION;

        const alreadyGranted =
            await PermissionsAndroid.check(
                permission,
            );

        if (alreadyGranted) {
            return 'granted';
        }

        const result =
            await PermissionsAndroid.request(
                permission,
            );

        if (
            result ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
            return 'granted';
        }

        if (
            result ===
            PermissionsAndroid.RESULTS
                .NEVER_ASK_AGAIN
        ) {
            return 'blocked';
        }

        return 'denied';
    };

export const useCampusLocation = () => {

    const [
        state,
        setState,
    ] = useState<CampusLocationState>({
        coordinates: null,
        status: 'idle',
        error: null,
    });

    const requestLocation =
        useCallback(async () => {

            setState({
                coordinates: null,
                status: 'requesting',
                error: null,
            });

            try {
                const permission =
                    await requestAndroidPermission();

                if (
                    permission === 'denied'
                ) {
                    setState({
                        coordinates: null,
                        status: 'denied',
                        error:
                            'Bạn chưa cấp quyền vị trí.',
                    });

                    return;
                }

                if (
                    permission === 'blocked'
                ) {
                    setState({
                        coordinates: null,
                        status: 'blocked',
                        error:
                            'Quyền vị trí đã bị chặn. Hãy mở Cài đặt để cấp quyền.',
                    });

                    return;
                }

                Geolocation.getCurrentPosition(
                    position => {

                        const coordinates = {
                            latitude:
                                position.coords
                                    .latitude,

                            longitude:
                                position.coords
                                    .longitude,
                        };

                        setState({
                            coordinates,
                            status: 'granted',
                            error: null,
                        });
                    },

                    error => {
                        setState({
                            coordinates: null,
                            status: 'error',
                            error:
                                error.message ||
                                'Không lấy được vị trí.',
                        });
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    },
                );

            } catch (error) {

                setState({
                    coordinates: null,
                    status: 'error',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Có lỗi khi lấy vị trí.',
                });
            }

        }, []);

    const openLocationSettings =
        useCallback(() => {
            Linking.openSettings();
        }, []);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    const distanceKm =
        state.coordinates
            ? haversineKm(
                state.coordinates,
                KTX_GATE,
            )
            : null;

    const shippingFee =
        distanceKm !== null
            ? calculateShippingFee(
                distanceKm,
            )
            : null;

    return {
        coordinates:
            state.coordinates,

        status:
            state.status,

        error:
            state.error,

        distanceKm,

        shippingFee,

        requestLocation,

        openLocationSettings,
    };
};