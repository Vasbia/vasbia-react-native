import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BackIcon from '../assets/icons/BackIcon';
import RatingIcon from '../assets/icons/RatingIcon';
import LogOutIcon from '../assets/icons/LogOutIcon';
import RatingModal from '../components/bottomSheet/RatingModal';
import { Dimensions } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import ToastError from '../components/ToastError';
import ToastSuccess from '../components/ToastSuccess';

export default function SettingScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [showRatingSuccess, setShowRatingSuccess] = useState(false);
    const [showRatingError, setShowRatingError] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const [showLogoutError, setShowLogoutError] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [ratingModalVisible, setRatingModalVisible] = useState(false);

    const handleLogout = async () => {
        setShowLogoutModal(false);
        setShowLogoutSuccess(true);
        setTimeout(() => {
            setShowLogoutSuccess(false); // Hide toast
            navigation.replace('Login'); // Navigate to Login screen
        }, 3000); // 3 seconds
        await CookieManager.clearAll(true);
    };

    return (
        <View style={styles.container}>
            {showRatingSuccess && (
                <ToastSuccess toastMessage="Feedback submitted!" onHide={() => setShowRatingSuccess(false)} />
            )}
            {showRatingError && (
                <ToastError toastMessage="Error submitting feedback." onHide={() => setShowRatingError(false)} />
            )}
            {showLogoutSuccess && (
                <ToastSuccess toastMessage="Logged out successfully!" onHide={() => setShowLogoutSuccess(false)} />
            )}
            {showLogoutError && (
                <ToastError toastMessage="Error logging out." onHide={() => setShowLogoutError(false)} />
            )}

            <View style={styles.titleBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <BackIcon size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Settings</Text>
            </View>

            <View style={styles.settingContent}>
                <TouchableOpacity style={styles.settingContentCard} onPress={() => setRatingModalVisible(true)}>
                    <RatingIcon />
                    <Text style={styles.settingContentText}>Rating</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingContentCard} onPress={() => setShowLogoutModal(true)}>
                    <LogOutIcon />
                    <Text style={styles.settingContentText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <RatingModal
                visible={ratingModalVisible}
                onClose={() => setRatingModalVisible(false)}
                onSuccess={() => setShowRatingSuccess(true)}
                onError={() => setShowRatingError(true)}
            />

            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                        <View style={{ flexDirection: 'row', marginTop: 16}}>
                            <TouchableOpacity
                                style={[styles.modalButton]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: '#000' }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#ff2d2d', marginLeft: 12 }]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.modalButtonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    titleBar: {
        width: '100%',
        marginTop: 64,
        paddingHorizontal: screenWidth * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: screenWidth * 0.04,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: '30%',
        transform: [{translateY: -screenWidth * 0.035}],
    },
    pageTitle: {
        fontSize: 32,
        fontFamily: 'Inter_24pt-Bold',
        color: '#000',
    },
    settingContent: {
        flex: 1,
        padding: screenWidth * 0.05,
    },
    settingContentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    settingContentText: {
        marginLeft: 12,
        fontSize: 20,
        fontFamily: 'Inter_24pt-SemiBold',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '80%',
    },
    modalText: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'Inter_24pt-SemiBold',
        textAlign: 'center',
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_24pt-SemiBold',
    },
});
