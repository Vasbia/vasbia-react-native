import {TouchableOpacity, View, StyleSheet, Text} from "react-native";
import {useState} from "react";

interface ToastErrorProps {
    toastMessage: string;
}

export default function ToastError({ toastMessage }: ToastErrorProps) {

    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    }

    setTimeout(() => {
        setIsVisible(false);
    }, 3000);

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>  
                <Text style={styles.titleToast} >Error!</Text>
                <Text style={styles.subTitleToast}>{toastMessage}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} >
                <Text style={styles.closeButton}> X </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '8%',
        backgroundColor: '#F8D7DA',
        top: 50,
        left: 20,
        paddingHorizontal: 20,
        paddingVertical: 0,
        marginTop:10,
        borderRadius: 10,
        zIndex: 1000,
        borderColor: '#F5C6CB',
        borderWidth: 2,

    },

    messageContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        gap: 2,
        maxWidth: '90%',
        
    },

    titleToast:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    subTitleToast:{
        fontSize: 14,
        color: '#555',
    },
    closeButton:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    }

});